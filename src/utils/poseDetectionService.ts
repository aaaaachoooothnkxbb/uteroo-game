
// Pose Detection Service for Teachable Machine Integration
// This service handles the AI pose detection functionality

interface PoseModel {
  predict: (canvas: HTMLCanvasElement) => Promise<PosePrediction[]>;
  dispose: () => void;
}

interface PosePrediction {
  className: string;
  probability: number;
}

interface PoseWebcam {
  setup: () => Promise<void>;
  play: () => Promise<void>;
  update: () => void;
  canvas: HTMLCanvasElement;
}

// Configuration for each hormonal phase
const POSE_MODELS_CONFIG = {
  menstruation: {
    modelUrl: "/models/menstruation_poses/",
    expectedPoses: ["child_pose", "gentle_twist", "legs_up_wall", "savasana"],
    validationThreshold: 0.7
  },
  follicular: {
    modelUrl: "/models/follicular_poses/",
    expectedPoses: ["warrior_ii", "tree_pose", "sun_salutation", "downward_dog"],
    validationThreshold: 0.75
  },
  ovulatory: {
    modelUrl: "/models/ovulatory_poses/",
    expectedPoses: ["dancer_pose", "camel_pose", "crow_pose", "headstand"],
    validationThreshold: 0.8
  },
  luteal: {
    modelUrl: "/models/luteal_poses/",
    expectedPoses: ["forward_fold", "pigeon_pose", "bridge_pose", "restorative_twist"],
    validationThreshold: 0.7
  }
};

class PoseDetectionService {
  private currentModel: PoseModel | null = null;
  private webcam: PoseWebcam | null = null;
  private isLoaded = false;
  private currentPhase: string = "";

  // Check if Teachable Machine library is available
  private isTeachableMachineAvailable(): boolean {
    return typeof window !== 'undefined' && 'tmPose' in window;
  }

  // Load the Teachable Machine model for the current phase
  async loadModel(phase: string): Promise<boolean> {
    if (!this.isTeachableMachineAvailable()) {
      console.warn("Teachable Machine library not loaded. Pose detection disabled.");
      return false;
    }

    try {
      const config = POSE_MODELS_CONFIG[phase as keyof typeof POSE_MODELS_CONFIG];
      if (!config) {
        console.error(`No model configuration found for phase: ${phase}`);
        return false;
      }

      // Load the model using Teachable Machine API
      // Note: This assumes the tmPose global is available
      const tmPose = (window as any).tmPose;
      this.currentModel = await tmPose.load(
        config.modelUrl + "model.json",
        config.modelUrl + "metadata.json"
      );

      this.currentPhase = phase;
      this.isLoaded = true;
      console.log(`Pose model loaded for ${phase} phase`);
      return true;

    } catch (error) {
      console.error("Failed to load pose model:", error);
      return false;
    }
  }

  // Initialize webcam for pose detection
  async initializeWebcam(width = 640, height = 480): Promise<boolean> {
    if (!this.isTeachableMachineAvailable() || !this.isLoaded) {
      return false;
    }

    try {
      const tmPose = (window as any).tmPose;
      this.webcam = new tmPose.Webcam(width, height, true);
      await this.webcam.setup();
      await this.webcam.play();
      
      console.log("Webcam initialized for pose detection");
      return true;

    } catch (error) {
      console.error("Failed to initialize webcam:", error);
      return false;
    }
  }

  // Predict pose from current webcam frame
  async predictPose(): Promise<PosePrediction[]> {
    if (!this.currentModel || !this.webcam) {
      return [];
    }

    try {
      this.webcam.update();
      const predictions = await this.currentModel.predict(this.webcam.canvas);
      return predictions;

    } catch (error) {
      console.error("Pose prediction failed:", error);
      return [];
    }
  }

  // Validate if the detected pose is appropriate for the current phase
  validatePoseForPhase(predictions: PosePrediction[]): {
    isValid: boolean;
    detectedPose: string | null;
    confidence: number;
    feedback: string;
  } {
    const config = POSE_MODELS_CONFIG[this.currentPhase as keyof typeof POSE_MODELS_CONFIG];
    if (!config) {
      return {
        isValid: false,
        detectedPose: null,
        confidence: 0,
        feedback: "Phase configuration not found"
      };
    }

    // Find the highest confidence prediction
    const bestPrediction = predictions.reduce((best, current) => 
      current.probability > best.probability ? current : best
    , { className: "", probability: 0 });

    if (bestPrediction.probability < config.validationThreshold) {
      return {
        isValid: false,
        detectedPose: bestPrediction.className,
        confidence: bestPrediction.probability,
        feedback: "Pose not clearly detected. Try adjusting your position."
      };
    }

    // Check if the pose is expected for this phase
    const isExpectedPose = config.expectedPoses.some(expectedPose =>
      bestPrediction.className.toLowerCase().includes(expectedPose.replace('_', ' '))
    );

    return {
      isValid: isExpectedPose,
      detectedPose: bestPrediction.className,
      confidence: bestPrediction.probability,
      feedback: isExpectedPose 
        ? `Great! This ${bestPrediction.className} is perfect for your ${this.currentPhase} phase.`
        : `This pose might be better for a different phase. Try gentler poses for ${this.currentPhase}.`
    };
  }

  // Get the webcam canvas for display
  getWebcamCanvas(): HTMLCanvasElement | null {
    return this.webcam?.canvas || null;
  }

  // Cleanup resources
  dispose(): void {
    if (this.currentModel) {
      this.currentModel.dispose();
      this.currentModel = null;
    }
    
    if (this.webcam) {
      // Webcam cleanup would be handled by the component
      this.webcam = null;
    }
    
    this.isLoaded = false;
    this.currentPhase = "";
  }

  // Get expected poses for the current phase
  getExpectedPoses(): string[] {
    const config = POSE_MODELS_CONFIG[this.currentPhase as keyof typeof POSE_MODELS_CONFIG];
    return config?.expectedPoses || [];
  }
}

// Export a singleton instance
export const poseDetectionService = new PoseDetectionService();

// Export types for use in components
export type { PosePrediction };
