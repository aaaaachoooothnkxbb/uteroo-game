import React from 'react';
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CulturalPractice {
  practice_name: string;
  description: string;
  country_origin: string;
  instructions: string;
  benefits: string[];
}

export const CulturalWellness = ({ phase }: { phase: string }) => {
  const { data: practices } = useQuery({
    queryKey: ['cultural-practices', phase],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cultural_practices')
        .select('*')
        .eq('phase', phase);

      if (error) throw error;
      return data as CulturalPractice[];
    }
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-6 h-6 text-teal-500" />
        <h3 className="text-lg font-medium">Global Wellness Traditions</h3>
      </div>

      <div className="space-y-6">
        {practices?.map((practice, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{practice.practice_name}</h4>
              <span className="text-sm text-teal-600">
                From {practice.country_origin}
              </span>
            </div>

            <p className="text-gray-600">{practice.description}</p>

            <div className="bg-teal-50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">How to Practice:</h5>
              <p>{practice.instructions}</p>
            </div>

            <div>
              <h5 className="font-medium mb-2">Benefits:</h5>
              <ul className="list-disc list-inside space-y-1">
                {practice.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-gray-600">{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};