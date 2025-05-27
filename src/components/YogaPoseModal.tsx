
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Check, X, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
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

  const startPoseDetection = async () => {
    try {
      setCameraError(null);
      console.log("Starting camera detection...");
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      console.log("Requesting camera permissions...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      console.log("Camera permission granted, stream received:", stream);
      console.log("Video tracks:", stream.getVideoTracks());
      
      setWebcamStream(stream);
      
      if (videoRef.current) {
        console.log("Setting video source...");
        videoRef.current.srcObject = stream;
        
        // Handle video metadata loaded
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Video playing successfully");
                setIsVideoPlaying(true);
                setIsPoseDetectionActive(true);
              })
              .catch(error => {
                console.error("Error playing video:", error);
                setCameraError("Failed to start video playback");
              });
          }
        };

        // Handle video errors
        videoRef.current.onerror = (error) => {
          console.error("Video element error:", error);
          setCameraError("Video playback error");
        };

        // Force load the video
        videoRef.current.load();
      }

      toast({
        title: "Camera Starting",
        description: "Initializing camera for pose detection...",
      });

    } catch (error) {
      console.error("Camera error:", error);
      let errorMessage = "Unknown camera error";
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Camera permission denied. Please allow camera access and try again.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No camera found. Please connect a camera and try again.";
        } else if (error.name === 'NotReadableError') {
          errorMessage = "Camera is already in use by another application.";
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = "Camera doesn't support the required settings.";
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

  const stopPoseDetection = () => {
    console.log("Stopping pose detection...");
    
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => {
        console.log("Stopping track:", track.kind);
        track.stop();
      });
      setWebcamStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
    
    setIsPoseDetectionActive(false);
    setIsVideoPlaying(false);
    setCurrentPoseValidation(null);
    setCameraError(null);
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
  };

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopPoseDetection();
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPoseDetection();
    };
  }, []);

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
                  Use your camera to get real-time feedback on your yoga poses
                </p>
              </div>

              {!isPoseDetectionActive ? (
                <div className="space-y-3">
                  <Button 
                    onClick={startPoseDetection}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                    disabled={!!cameraError}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                  
                  {cameraError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-red-700 font-medium">Camera Error:</p>
                          <p className="text-xs text-red-600 mt-1">{cameraError}</p>
                          <Button 
                            onClick={() => setCameraError(null)} 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 text-xs"
                          >
                            Try Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-600 bg-white/70 p-3 rounded border border-gray-200">
                    <p className="font-medium mb-1">Camera Requirements:</p>
                    <ul className="text-gray-700 space-y-1">
                      <li>• Allow camera permissions</li>
                      <li>• Use HTTPS (secure connection)</li>
                      <li>• Close other apps using camera</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <video
                      ref={videoRef}
                      width="100%"
                      height="200"
                      className="w-full h-48 object-cover bg-gray-100"
                      autoPlay
                      muted
                      playsInline
                    />
                    
                    {!isVideoPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Loading camera...</p>
                        </div>
                      </div>
                    )}
                    
                    {currentPoseValidation && (
                      <div className={`absolute top-2 right-2 p-2 rounded-full ${
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
                    <p className="text-sm text-gray-700">
                      {isVideoPlaying ? "Hold your pose for validation" : "Starting camera..."}
                    </p>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => selectedPose && validatePoseForPhase(selectedPose.name)}
                        variant="outline"
                        size="sm"
                        disabled={!selectedPose || !isVideoPlaying}
                        className="w-full bg-white hover:bg-gray-50 border-gray-300"
                      >
                        Validate Current Pose
                      </Button>
                      <Button 
                        onClick={stopPoseDetection}
                        variant="outline"
                        size="sm"
                        className="w-full bg-white hover:bg-gray-50 border-gray-300"
                      >
                        Stop Camera
                      </Button>
                    </div>
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

              <div className="text-xs text-gray-600 text-center bg-white/70 p-3 rounded border border-gray-200">
                <p className="font-medium mb-1">Expected poses for {phase} phase:</p>
                <p className="text-gray-700">{getExpectedPosesForPhase().join(", ").replace(/_/g, " ")}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
