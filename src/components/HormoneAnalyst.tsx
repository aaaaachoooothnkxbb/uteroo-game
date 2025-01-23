import React from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Brain, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface HormoneAnalysis {
  prediction: string;
  suggestions: string[];
  commentary: string;
}

export const HormoneAnalyst = ({ phase }: { phase: string }) => {
  const { toast } = useToast();

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ['hormone-analysis', phase],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hormone_analysis')
        .select('*')
        .eq('phase', phase)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as HormoneAnalysis | null;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-medium">Loading analysis...</h3>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-medium">Unable to load hormone analysis</h3>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-medium">No analysis available for this phase</h3>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="w-6 h-6 text-purple-500" />
        <h3 className="text-lg font-medium">AI Hormone Analyst</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-800 font-medium">{analysis.prediction}</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Suggested Strategies:</h4>
          <ul className="list-disc list-inside space-y-1">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="text-gray-600">{suggestion}</li>
            ))}
          </ul>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-pink-500 mt-1" />
          <p className="text-pink-800 italic">{analysis.commentary}</p>
        </div>
      </div>
    </Card>
  );
};