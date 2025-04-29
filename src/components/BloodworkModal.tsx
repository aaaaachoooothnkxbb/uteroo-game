
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BloodworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: string;
}

export const BloodworkModal = ({ isOpen, onClose, phase }: BloodworkModalProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysisResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a bloodwork file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload to storage - this can be implemented with Supabase storage
      const fileName = `bloodwork-${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('bloodwork')
        .upload(fileName, file);

      if (error) throw error;

      // Simulate bloodwork analysis with Deep Seek
      // In a real app, you would call your analysis API here
      setTimeout(() => {
        // Mock analysis results based on the current phase
        const results = {
          menstruation: "Iron levels slightly low. Consider iron supplements.",
          follicular: "Hormones balanced. Optimal time for new activities.",
          ovulatory: "Estrogen levels at peak. Energy levels optimal.",
          luteal: "Progesterone slightly elevated. Consider magnesium-rich foods."
        };
        
        setAnalysisResult(results[phase as keyof typeof results]);
        
        toast({
          title: "Analysis Complete",
          description: "Your bloodwork has been processed successfully!",
        });
        
        setUploading(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error uploading bloodwork:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your bloodwork",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upload Bloodwork</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="bloodwork-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 10MB)</p>
                </div>
                <input 
                  id="bloodwork-upload" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  className="hidden" 
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>
            {file && (
              <div className="text-sm bg-gray-100 p-2 rounded w-full">
                Selected file: {file.name}
              </div>
            )}
            {uploading && (
              <div className="text-sm text-center animate-pulse">
                Analyzing your bloodwork with AI...
              </div>
            )}
            {analysisResult && (
              <div className="bg-green-50 p-3 rounded-md border border-green-200 w-full">
                <h3 className="font-bold text-green-700">Analysis Results</h3>
                <p className="text-sm text-green-600">{analysisResult}</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? "Analyzing..." : "Process Bloodwork"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
