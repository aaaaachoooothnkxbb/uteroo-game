
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Check, X } from "lucide-react";
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
      console.log("Requesting camera access...");
      
      // Request camera access with more specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log("Camera access granted", stream);
      setWebcamStream(stream);
      setIsPoseDetectionActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          console.log("Video playing");
        };
      }

      toast({
        title: "Camera Started",
        description: `Ready to validate ${phase} phase yoga poses!`,
      });

    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(error instanceof Error ? error.message : "Unknown camera error");
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions and try again.",
        variant: "destructive"
      });
    }
  };

  const stopPoseDetection = () => {
    console.log("Stopping pose detection...");
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => {
        track.stop();
        console.log("Camera track stopped");
      });
      setWebcamStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsPoseDetectionActive(false);
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
              {isPoseDetectionActive && (
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
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                  {cameraError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700 font-medium">Camera Error:</p>
                      <p className="text-xs text-red-600 mt-1">{cameraError}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <video
                      ref={videoRef}
                      width="100%"
                      height="200"
                      className="w-full h-48 object-cover bg-gray-200"
                      autoPlay
                      muted
                      playsInline
                    />
                    
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
                      Hold your pose for validation
                    </p>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => selectedPose && validatePoseForPhase(selectedPose.name)}
                        variant="outline"
                        size="sm"
                        disabled={!selectedPose}
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
