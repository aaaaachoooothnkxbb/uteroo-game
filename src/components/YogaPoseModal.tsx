
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Recommended Yoga Poses for {phase}
          </DialogTitle>
        </DialogHeader>
        <Separator className="my-4" />
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {poses.map((pose) => (
              <div key={pose.name} className="bg-white p-4 rounded-lg shadow-sm">
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
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-1">Benefits:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {pose.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Instructions:</h4>
                    <ol className="list-decimal list-inside text-sm text-gray-600">
                      {pose.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
