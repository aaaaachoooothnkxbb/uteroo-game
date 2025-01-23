import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Reward {
  reward_name: string;
  description: string;
  brand: string;
  discount_code: string;
  required_streak: number;
  valid_until: string;
}

export const CycleRewards = ({ streak }: { streak: number }) => {
  const { data: rewards } = useQuery({
    queryKey: ['cycle-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cycle_rewards')
        .select('*')
        .lte('required_streak', streak)
        .gt('valid_until', new Date().toISOString());

      if (error) throw error;
      return data as Reward[];
    }
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-6 h-6 text-pink-500" />
        <h3 className="text-lg font-medium">Available Rewards</h3>
      </div>

      <div className="space-y-4">
        {rewards?.map((reward, index) => (
          <Card key={index} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{reward.reward_name}</h4>
                <p className="text-sm text-gray-600">{reward.description}</p>
                <p className="text-sm text-purple-600 mt-2">By {reward.brand}</p>
              </div>
              <Button variant="outline" className="text-pink-500 border-pink-500">
                {reward.discount_code}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};