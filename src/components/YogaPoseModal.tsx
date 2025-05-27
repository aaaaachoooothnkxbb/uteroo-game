
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

// Pose detection configuration for each phase
const POSE_MODELS = {
  menstruation: "/models/menstruation_poses/",
  follicular: "/models/follicular_poses/",
  ovulatory: "/models/ovulatory_poses/",
  luteal: "/models/luteal_poses/"
};

export const YogaPoseModal = ({ isOpen, onClose, poses, phase }: YogaPoseModalProps) => {
  const [isPoseDetectionActive, setIsPoseDetectionActive] = useState(false);
  const [currentPoseValidation, setCurrentPoseValidation] = useState<string | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Expected poses for each phase (this would map to your Teachable Machine models)
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
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setWebcamStream(stream);
      setIsPoseDetectionActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // In a real implementation, you would load the Teachable Machine model here
      // const modelUrl = POSE_MODELS[phase as keyof typeof POSE_MODELS];
      // const model = await tmPose.load(modelUrl + "model.json", modelUrl + "metadata.json");
      
      toast({
        title: "Pose Detection Started",
        description: `Ready to validate ${phase} phase yoga poses!`,
      });

    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopPoseDetection = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
    setIsPoseDetectionActive(false);
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
  };

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopPoseDetection();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            Recommended Yoga Poses for {phase}
            {isPoseDetectionActive && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                AI Detection Active
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
        
        <div className="flex gap-4 h-[70vh]">
          {/* Pose List */}
          <div className="flex-1">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {poses.map((pose) => (
                  <div 
                    key={pose.name} 
                    className={`bg-white p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                      selectedPose?.name === pose.name ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedPose(pose)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{pose.name}</h3>
                      <Badge variant="secondary" className={difficultyColors[pose.difficulty]}>
                        {pose.difficulty}
                      </Badge>
                    </div>
                    {pose.sanskrit_name && (
                      <p className="text-sm text-gray-600 italic mb-2">
                        Sanskrit: {pose.sanskrit_name}
                      </p>
                    )}
                    <p className="text-gray-700 mb-3">{pose.description}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium mb-1 text-sm">Benefits:</h4>
                        <ul className="list-disc list-inside text-xs text-gray-600">
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
          <div className="w-80 bg-gray-50 rounded-lg p-4">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">AI Pose Validation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Use your camera to get real-time feedback on your yoga poses
                </p>
              </div>

              {!isPoseDetectionActive ? (
                <Button 
                  onClick={startPoseDetection}
                  className="w-full"
                  size="lg"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Start Pose Detection
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      width="300"
                      height="225"
                      className="rounded-lg bg-black"
                      autoPlay
                      muted
                    />
                    <canvas
                      ref={canvasRef}
                      width="300"
                      height="225"
                      className="absolute top-0 left-0 rounded-lg"
                      style={{ display: 'none' }}
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

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Hold your pose for validation
                    </p>
                    <div className="space-y-2">
                      <Button 
                        onClick={() => selectedPose && validatePoseForPhase(selectedPose.name)}
                        variant="outline"
                        size="sm"
                        disabled={!selectedPose}
                      >
                        Validate Current Pose
                      </Button>
                      <Button 
                        onClick={stopPoseDetection}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Stop Detection
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {selectedPose && (
                <div className="bg-white p-3 rounded-lg border">
                  <h4 className="font-medium text-sm mb-2">Selected Pose</h4>
                  <p className="text-sm">{selectedPose.name}</p>
                  <div className="mt-2">
                    <h5 className="font-medium text-xs mb-1">Quick Instructions:</h5>
                    <ol className="list-decimal list-inside text-xs text-gray-600">
                      {selectedPose.instructions.slice(0, 3).map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 text-center">
                <p>Expected poses for {phase} phase:</p>
                <p className="font-medium">{getExpectedPosesForPhase().join(", ").replace(/_/g, " ")}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
