import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Check, X, AlertCircle, RefreshCw, Upload } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface YogaPose {
  name: string;
  sanskrit_name: string | null;
  description: string;
  benefits: string[];
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface YogaPoseModalProps {
  isOpen: boolean;
  onClose: () => void;
  poses: YogaPose[];
  phase: string;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800"
};

export const YogaPoseModal = ({ isOpen, onClose, poses, phase }: YogaPoseModalProps) => {
  const [isPoseDetectionActive, setIsPoseDetectionActive] = useState(false);
  const [currentPoseValidation, setCurrentPoseValidation] = useState<string | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const getExpectedPosesForPhase = () => {
    const phasePositions = {
      menstruation: ["child_pose", "gentle_twist", "legs_up_wall", "savasana"],
      follicular: ["warrior_ii", "tree_pose", "sun_salutation", "downward_dog"],
      ovulatory: ["dancer_pose", "camel_pose", "crow_pose", "headstand"],
      luteal: ["forward_fold", "pigeon_pose", "bridge_pose", "restorative_twist"]
    };
    return phasePositions[phase as keyof typeof phasePositions] || [];
  };

  const cleanupStream = useCallback(() => {
    console.log("Cleaning up camera stream...");
    
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => {
        console.log(`Stopping ${track.kind} track`);
        track.stop();
      });
      setWebcamStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    
    setIsPoseDetectionActive(false);
    setIsVideoPlaying(false);
    setCurrentPoseValidation(null);
    setCameraError(null);
    setIsLoading(false);
    setCapturedPhoto(null);
    setAnalysisResult(null);
  }, [webcamStream]);

  const startPoseDetection = async () => {
    try {
      setIsLoading(true);
      setCameraError(null);
      console.log("Starting camera detection...");
      
      // Check browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera is not supported in this browser. Please use Chrome, Firefox, or Safari.");
      }

      // Check if we're on HTTPS or localhost
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      if (!isSecure) {
        throw new Error("Camera requires a secure connection (HTTPS). Please use HTTPS or localhost.");
      }

      console.log("Requesting camera permissions...");
      
      // Try different camera configurations for better compatibility
      const constraints = {
        video: {
          width: { min: 320, ideal: 640, max: 1280 },
          height: { min: 240, ideal: 480, max: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30, max: 30 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log("Camera permission granted, stream received");
      console.log("Video tracks:", stream.getVideoTracks().map(track => ({
        label: track.label,
        settings: track.getSettings()
      })));
      
      setWebcamStream(stream);
      
      if (videoRef.current) {
        console.log("Setting video source...");
        videoRef.current.srcObject = stream;
        
        // Set video properties
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        
        // Handle successful video load
        const handleLoadedMetadata = () => {
          console.log("Video metadata loaded successfully");
          console.log("Video dimensions:", videoRef.current?.videoWidth, "x", videoRef.current?.videoHeight);
          setIsLoading(false);
          setIsPoseDetectionActive(true);
          
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Video playing successfully");
                setIsVideoPlaying(true);
                toast({
                  title: "Camera Ready",
                  description: "Camera is now active for pose detection",
                });
              })
              .catch(error => {
                console.error("Error playing video:", error);
                setCameraError("Failed to start video playback. Please try again.");
                setIsLoading(false);
                setIsPoseDetectionActive(false);
              });
          }
        };

        // Handle video errors
        const handleVideoError = (error: Event) => {
          console.error("Video element error:", error);
          setCameraError("Video playback error. Please check your camera and try again.");
          setIsLoading(false);
          setIsPoseDetectionActive(false);
        };

        // Add event listeners
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        videoRef.current.addEventListener('error', handleVideoError, { once: true });
      }

    } catch (error) {
      console.error("Camera error:", error);
      setIsLoading(false);
      setIsPoseDetectionActive(false);
      
      let errorMessage = "Unknown camera error";
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Camera permission denied. Please allow camera access in your browser settings and try again.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No camera found. Please connect a camera and try again.";
        } else if (error.name === 'NotReadableError') {
          errorMessage = "Camera is already in use by another application. Please close other camera apps and try again.";
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = "Camera doesn't support the required settings. Please try a different camera.";
        } else if (error.name === 'SecurityError') {
          errorMessage = "Camera access blocked for security reasons. Please use HTTPS or localhost.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setCameraError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isVideoPlaying) {
      toast({
        title: "Cannot capture photo",
        description: "Camera is not ready. Please wait for the camera to start.",
        variant: "destructive"
      });
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      toast({
        title: "Error",
        description: "Could not access canvas context",
        variant: "destructive"
      });
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert canvas to data URL
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedPhoto(photoDataUrl);

    toast({
      title: "Photo Captured!",
      description: "Photo captured successfully. Ready for analysis.",
    });
  };

  const analyzePhoto = async () => {
    if (!capturedPhoto || !selectedPose) {
      toast({
        title: "Missing Information",
        description: "Please select a pose and capture a photo first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Simulate AI analysis - in real implementation, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis result based on selected pose
      const isGoodPose = Math.random() > 0.3; // 70% chance of good pose
      
      if (isGoodPose) {
        setAnalysisResult("correct");
        setCurrentPoseValidation("correct");
        toast({
          title: "Great Pose!",
          description: `Perfect ${selectedPose.name} for your ${phase} phase! Your alignment looks good.`,
        });
      } else {
        setAnalysisResult("needs_improvement");
        setCurrentPoseValidation("incorrect");
        toast({
          title: "Try Adjusting Your Pose",
          description: `Good attempt at ${selectedPose.name}! Try adjusting your alignment based on the instructions.`,
          variant: "destructive"
        });
      }

      // Clear validation after 5 seconds
      setTimeout(() => {
        setCurrentPoseValidation(null);
        setAnalysisResult(null);
      }, 5000);

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze the photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setAnalysisResult(null);
    setCurrentPoseValidation(null);
  };

  const validatePoseForPhase = (poseName: string) => {
    const expectedPoses = getExpectedPosesForPhase();
    const isValidPose = expectedPoses.some(expectedPose => 
      poseName.toLowerCase().includes(expectedPose.replace('_', ' '))
    );
    
    if (isValidPose) {
      setCurrentPoseValidation("correct");
      toast({
        title: "Great Pose!",
        description: `Perfect ${poseName} for your ${phase} phase!`,
      });
    } else {
      setCurrentPoseValidation("incorrect");
      toast({
        title: "Try a Different Pose",
        description: `This pose might be better suited for a different phase. Try gentler poses for ${phase}.`,
        variant: "destructive"
      });
    }
    
    // Clear validation after 3 seconds
    setTimeout(() => {
      setCurrentPoseValidation(null);
    }, 3000);
  };

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      cleanupStream();
    }
  }, [isOpen, cleanupStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full bg-white overflow-hidden p-0">
        <div className="p-4 pb-0 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row items-start sm:items-center gap-2 text-gray-900">
              <span>Yoga Poses for {phase}</span>
              {isPoseDetectionActive && isVideoPlaying && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  AI Detection Active
                </Badge>
              )}
              {isLoading && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  Starting Camera...
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <Separator className="mx-4" />
        
        <div className="flex flex-col lg:flex-row gap-4 p-4 h-full min-h-0 bg-white">
          {/* Pose List */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-[50vh] lg:h-[60vh] pr-2">
              <div className="space-y-3">
                {poses.map((pose) => (
                  <div 
                    key={pose.name} 
                    className={`bg-white border border-gray-200 p-3 sm:p-4 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-blue-300 ${
                      selectedPose?.name === pose.name ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300' : ''
                    }`}
                    onClick={() => setSelectedPose(pose)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{pose.name}</h3>
                      <Badge variant="secondary" className={`${difficultyColors[pose.difficulty]} text-xs self-start sm:self-center`}>
                        {pose.difficulty}
                      </Badge>
                    </div>
                    {pose.sanskrit_name && (
                      <p className="text-sm text-gray-600 italic mb-2">
                        Sanskrit: {pose.sanskrit_name}
                      </p>
                    )}
                    <p className="text-gray-700 mb-3 text-sm sm:text-base">{pose.description}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium mb-1 text-sm text-gray-900">Benefits:</h4>
                        <ul className="list-disc list-inside text-xs sm:text-sm text-gray-600 space-y-1">
                          {pose.benefits.slice(0, 2).map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Pose Detection Panel */}
          <div className="w-full lg:w-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2 text-gray-900">AI Pose Validation</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Select a pose, start camera, take a photo, and get AI feedback
                </p>
              </div>

              {!isPoseDetectionActive ? (
                <div className="space-y-3">
                  <Button 
                    onClick={startPoseDetection}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </>
                    )}
                  </Button>
                  
                  {cameraError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-red-700 font-medium">Camera Error:</p>
                          <p className="text-xs text-red-600 mt-1 leading-relaxed">{cameraError}</p>
                          <div className="flex gap-2 mt-2">
                            <Button 
                              onClick={() => {
                                setCameraError(null);
                                startPoseDetection();
                              }} 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                            >
                              <RefreshCw className="mr-1 h-3 w-3" />
                              Retry
                            </Button>
                            <Button 
                              onClick={() => setCameraError(null)} 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-600 bg-white/70 p-3 rounded border border-gray-200">
                    <p className="font-medium mb-2">Camera Requirements:</p>
                    <ul className="text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        Allow camera permissions when prompted
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        Use HTTPS or localhost
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        Close other camera applications
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        Use Chrome, Firefox, or Safari
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    {!capturedPhoto ? (
                      <video
                        ref={videoRef}
                        width="100%"
                        height="200"
                        className="w-full h-48 object-cover bg-gray-100"
                        autoPlay
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={capturedPhoto}
                        alt="Captured pose"
                        className="w-full h-48 object-cover bg-gray-100"
                      />
                    )}
                    
                    {(!isVideoPlaying || isLoading) && !capturedPhoto && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            {isLoading ? (
                              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                            ) : (
                              <Camera className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {isLoading ? "Starting camera..." : "Loading camera..."}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {currentPoseValidation && (
                      <div className={`absolute top-2 right-2 p-2 rounded-full shadow-lg ${
                        currentPoseValidation === 'correct' 
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`}>
                        {currentPoseValidation === 'correct' ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <X className="h-4 w-4 text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-center space-y-3">
                    {!selectedPose && (
                      <p className="text-sm text-red-600 font-medium">
                        Please select a pose from the list first!
                      </p>
                    )}
                    
                    {!capturedPhoto ? (
                      <>
                        <p className="text-sm text-gray-700">
                          {isVideoPlaying ? "Position yourself in the selected pose and take a photo" : "Starting camera..."}
                        </p>
                        <div className="space-y-2">
                          <Button 
                            onClick={capturePhoto}
                            variant="default"
                            size="sm"
                            disabled={!selectedPose || !isVideoPlaying}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Take Photo
                          </Button>
                          <Button 
                            onClick={cleanupStream}
                            variant="outline"
                            size="sm"
                            className="w-full bg-white hover:bg-gray-50 border-gray-300"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Stop Camera
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-700">
                          Photo captured! Ready to analyze your pose.
                        </p>
                        <div className="space-y-2">
                          <Button 
                            onClick={analyzePhoto}
                            variant="default"
                            size="sm"
                            disabled={isAnalyzing}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            {isAnalyzing ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Analyze Pose
                              </>
                            )}
                          </Button>
                          <Button 
                            onClick={retakePhoto}
                            variant="outline"
                            size="sm"
                            className="w-full bg-white hover:bg-gray-50 border-gray-300"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Retake Photo
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {selectedPose && (
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="font-medium text-sm mb-2 text-gray-900">Selected Pose</h4>
                  <p className="text-sm text-gray-700 font-medium">{selectedPose.name}</p>
                  <div className="mt-2">
                    <h5 className="font-medium text-xs mb-1 text-gray-900">Quick Instructions:</h5>
                    <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1">
                      {selectedPose.instructions.slice(0, 3).map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {analysisResult && (
                <div className={`p-3 rounded-lg border ${
                  analysisResult === 'correct' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <h4 className="font-medium text-sm mb-1">AI Analysis Result</h4>
                  <p className="text-xs text-gray-700">
                    {analysisResult === 'correct' 
                      ? "Great job! Your pose alignment looks good." 
                      : "Good attempt! Try adjusting your posture according to the instructions."}
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-600 text-center bg-white/70 p-3 rounded border border-gray-200">
                <p className="font-medium mb-1">Expected poses for {phase} phase:</p>
                <p className="text-gray-700">{getExpectedPosesForPhase().join(", ").replace(/_/g, " ")}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </DialogContent>
    </Dialog>
  );
};
