
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, CheckCircle, AlertTriangle, Cookie, Shield } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

interface BloodworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: string;
}

// Schema for the form
const formSchema = z.object({
  file: z.instanceof(File).optional(),
});

export const BloodworkModal = ({ isOpen, onClose, phase }: BloodworkModalProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [cookieConsent, setCookieConsent] = useState<'all' | 'essential' | 'none' | null>(null);
  const [showCookieDialog, setShowCookieDialog] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      form.setValue("file", e.target.files[0]);
      setAnalysisResult(null);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    const file = form.getValues("file");
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a bloodwork file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Check if bucket exists first
      const { data: buckets, error: bucketsError } = await supabase
        .storage
        .listBuckets();
        
      if (bucketsError) {
        throw new Error(`Storage error: ${bucketsError.message}`);
      }
      
      const bloodworkBucketExists = buckets.some(bucket => bucket.name === 'bloodwork');
      
      if (!bloodworkBucketExists) {
        throw new Error("Bloodwork bucket not found. Please contact support.");
      }
      
      // Upload to storage
      const fileName = `bloodwork-${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('bloodwork')
        .upload(fileName, file);

      if (error) throw error;

      // Simulate bloodwork analysis with structured response format
      setTimeout(() => {
        // Mock analysis results based on the current phase
        const analysisResults = {
          menstruation: {
            criticalAlerts: ["Iron levels slightly low → Keep an eye on your energy levels"],
            wellnessOpportunities: ["Vitamin B → Try including more leafy greens and beans in your diet"],
            balanced: ["Hormone balance → Great job keeping things in check!"]
          },
          follicular: {
            criticalAlerts: [],
            wellnessOpportunities: ["Magnesium → Consider adding nuts and seeds to your diet"],
            balanced: ["Estrogen levels → Perfect balance for this phase!"]
          },
          ovulatory: {
            criticalAlerts: [],
            wellnessOpportunities: ["Zinc → Pumpkin seeds and oysters can help boost levels"],
            balanced: ["Estrogen → Peak levels looking fantastic!"]
          },
          luteal: {
            criticalAlerts: [],
            wellnessOpportunities: ["Vitamin D → Try getting more sunlight or consider supplements"],
            balanced: ["Progesterone → Very good levels for this phase"]
          }
        };
        
        const results = analysisResults[phase as keyof typeof analysisResults];
        
        // Format the analysis according to the structured template
        const formattedAnalysis = `
### 🩸 Bloodwork Breakdown

${results.criticalAlerts.length > 0 ? `**1. 🚨 Critical Alerts**
${results.criticalAlerts.map(alert => `- ${alert}`).join('\n')}
` : ''}

**2. 💖 Wellness Opportunities**
${results.wellnessOpportunities.map(opp => `- ${opp}`).join('\n')}

**3. ✨ Perfectly Balanced**
${results.balanced.map(bal => `- ${bal}`).join('\n')}

**4. ⚠️ Legal Footer**
*These insights are general wellness suggestions, not medical advice. Always consult your doctor. Data processed per GDPR/LOPDGDD.*
        `;
        
        setAnalysisResult(formattedAnalysis);
        
        toast({
          title: "Analysis Complete",
          description: "Your bloodwork has been processed successfully!",
        });
        
        setUploading(false);
      }, 2000);
      
    } catch (error: any) {
      console.error("Error uploading bloodwork:", error);
      setUploadError(error.message || "Upload failed");
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your bloodwork",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  const handleCookieConsent = (choice: 'all' | 'essential' | 'none') => {
    setCookieConsent(choice);
    setShowCookieDialog(false);
    
    // In a real app, you would store this choice in localStorage or a cookie
    localStorage.setItem('cookieConsent', choice);
    
    toast({
      title: "Preferences saved",
      description: choice === 'all' 
        ? "Thank you for accepting all cookies!" 
        : "Your cookie preferences have been saved.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">🩸 Your Bloodwork BFF is Here! 🌈</DialogTitle>
          <DialogDescription className="text-center italic">
            "Upload your lab results and let's turn those confusing numbers into <span className="font-bold">your</span> personalized wellness story!"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Form {...form}>
            <div className="flex flex-col items-center gap-4">
              <FormField
                control={form.control}
                name="file"
                render={({ field: { ref, ...field } }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <label 
                          htmlFor="bloodwork-upload" 
                          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 animate-pulse"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-3 text-pink-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm font-semibold">
                              Click to upload <span className="text-gray-500 font-normal">or drag and drop</span>
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
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {form.getValues("file") && (
                <div className="text-sm bg-gray-100 p-3 rounded-lg w-full">
                  <span className="font-medium">Selected file:</span> {form.getValues("file")?.name}
                </div>
              )}
              
              {uploadError && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200 w-full">
                  <div className="flex items-center mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <h3 className="font-bold text-red-700">Upload Error</h3>
                  </div>
                  <p className="text-xs text-red-600">{uploadError}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Please try again or contact support if the problem persists.
                  </p>
                </div>
              )}
              
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200 w-full">
                <h3 className="font-bold text-pink-700 mb-2">💖 What happens next?</h3>
                <ul className="text-sm text-pink-600 space-y-2">
                  <li className="flex items-center"><span className="mr-2">✨</span> <strong>No-judgment analysis</strong> (we're your wellness hype squad!)</li>
                  <li className="flex items-center"><span className="mr-2">🍳</span> <strong>Delicious health hacks</strong> (yes, chocolate might be involved)</li>
                  <li className="flex items-center"><span className="mr-2">💅</span> <strong>Glow-up tips</strong> (because health should feel fabulous)</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 w-full">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 text-blue-600 mr-2" />
                  <h3 className="font-bold text-blue-700">Your Data Safety:</h3>
                </div>
                <p className="text-xs text-blue-600 mb-2 italic">By uploading, you agree to:</p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-blue-500 mr-1 flex-shrink-0" />
                    <span>Secure processing of your data per EU GDPR & Spanish LOPDGDD</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-blue-500 mr-1 flex-shrink-0" />
                    <span>Temporary storage for 30 days</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-blue-500 mr-1 flex-shrink-0" />
                    <span>Strict confidentiality (no third-party sharing)</span>
                  </li>
                </ul>
                <p className="text-xs text-blue-600 mt-2">
                  Manage preferences or exercise ARCO rights at <a href="#" className="underline">privacy@uteroo.com</a>
                </p>
              </div>
              
              {showCookieDialog && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 w-full">
                  <div className="flex items-center mb-2">
                    <Cookie className="w-4 h-4 text-gray-600 mr-2" />
                    <h3 className="font-bold text-gray-700">We Use Cookies!</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    "Just essential ones to run this tool + analytics (to improve)."
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={() => handleCookieConsent('all')} 
                      variant="default" 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Accept All
                    </Button>
                    <Button 
                      onClick={() => handleCookieConsent('essential')} 
                      variant="outline" 
                      size="sm"
                    >
                      Choose Cookies
                    </Button>
                    <Button 
                      onClick={() => handleCookieConsent('none')} 
                      variant="outline" 
                      size="sm"
                    >
                      Reject Non-Essential
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 w-full">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
                  <h3 className="font-bold text-amber-700">Remember:</h3>
                </div>
                <p className="text-xs text-amber-600 italic">
                  "This is informational only! Always consult your doctor for medical advice. We follow Organic Law 3/2018 on Data Protection."
                </p>
              </div>
              
              <p className="text-xs text-gray-500 italic">
                P.S. Your data is safer than our secret stash of gummy vitamins! 🔒
              </p>
              
              {uploading && (
                <div className="text-center animate-pulse font-medium text-pink-600">
                  Analyzing your bloodwork with AI magic... ✨
                </div>
              )}
              
              {analysisResult && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 w-full">
                  <h3 className="font-bold text-green-700 mb-1">✨ Your Personalized Results</h3>
                  <div className="text-sm text-green-600 whitespace-pre-line">{analysisResult}</div>
                </div>
              )}
            </div>
          </Form>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Maybe Later</Button>
          <Button 
            onClick={handleUpload} 
            disabled={!form.getValues("file") || uploading}
            className="bg-pink-500 hover:bg-pink-600"
          >
            {uploading ? "Working Magic..." : "Let's Do This!"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
