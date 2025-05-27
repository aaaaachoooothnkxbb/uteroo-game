
// Placeholder for Teachable Machine Pose library
// In a real implementation, you would include the actual Teachable Machine library
// This file serves as a placeholder to prevent errors when the service is called

if (typeof window !== 'undefined') {
  window.tmPose = {
    load: async (modelUrl, metadataUrl) => {
      console.log('Loading pose model from:', modelUrl);
      // Mock model object for development
      return {
        predict: async (canvas) => {
          // Mock predictions for development
          const mockPoses = [
            { className: 'child_pose', probability: 0.85 },
            { className: 'warrior_ii', probability: 0.92 },
            { className: 'tree_pose', probability: 0.78 }
          ];
          // Return random prediction for demo
          return [mockPoses[Math.floor(Math.random() * mockPoses.length)]];
        },
        dispose: () => {
          console.log('Model disposed');
        }
      };
    },
    
    Webcam: class {
      constructor(width, height, flip) {
        this.width = width;
        this.height = height;
        this.flip = flip;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
      }
      
      async setup() {
        console.log('Webcam setup complete');
      }
      
      async play() {
        console.log('Webcam playing');
      }
      
      update() {
        // Mock webcam update
      }
    }
  };
}
