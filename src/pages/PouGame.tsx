import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { UterooCharacter } from '@/components/UterooCharacter';
import { UterooTutorial } from '@/components/UterooTutorial';
import { SachetButton } from '@/components/SachetButton';

const PouGame = () => {
  const [stats, setStats] = useState({ happiness: 50, energy: 50, health: 50 });
  const [isLoading, setIsLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if tutorial should be shown
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenUterooTutorial');
    if (!hasSeenTutorial && user) {
      setShowTutorial(true);
    }
  }, [user]);

  // Load pet stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('pet_stats')
          .select('happiness, energy, health')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching pet stats:', error);
          // Use default stats if none exist
          setStats({ happiness: 50, energy: 50, health: 50 });
        } else if (data) {
          setStats({
            happiness: data.happiness || 50,
            energy: data.energy || 50,
            health: data.health || 50
          });
        }
      } catch (error) {
        console.error('Unexpected error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const updateStats = async (newStats: typeof stats) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('pet_stats')
        .upsert({
          user_id: user.id,
          happiness: newStats.happiness,
          energy: newStats.energy,
          health: newStats.health,
        });

      if (error) {
        console.error('Error updating stats:', error);
      } else {
        setStats(newStats);
      }
    } catch (error) {
      console.error('Unexpected error updating stats:', error);
    }
  };

  const handleFeed = () => {
    const newStats = {
      ...stats,
      happiness: Math.min(100, stats.happiness + 10),
      health: Math.min(100, stats.health + 5),
    };
    updateStats(newStats);
    toast({ title: "Fed your companion!", description: "Happiness and health increased!" });
  };

  const handlePlay = () => {
    const newStats = {
      ...stats,
      happiness: Math.min(100, stats.happiness + 15),
      energy: Math.max(0, stats.energy - 10),
    };
    updateStats(newStats);
    toast({ title: "Played with your companion!", description: "Happiness increased but energy decreased!" });
  };

  const handleRest = () => {
    const newStats = {
      ...stats,
      energy: Math.min(100, stats.energy + 20),
      health: Math.min(100, stats.health + 5),
    };
    updateStats(newStats);
    toast({ title: "Your companion is resting!", description: "Energy and health restored!" });
  };

  const handleTutorialComplete = () => {
    localStorage.setItem('hasSeenUterooTutorial', 'true');
    setShowTutorial(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your companion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      {showTutorial && <UterooTutorial onComplete={handleTutorialComplete} />}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
            Your Uteroo Companion
          </h1>
          <p className="text-gray-600 text-lg">Take care of your menstrual health companion!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Character Display */}
          <Card className="p-6 bg-white/80 backdrop-blur-lg shadow-xl">
            <UterooCharacter 
              happiness={stats.happiness}
              energy={stats.energy}
              health={stats.health}
            />
          </Card>

          {/* Stats and Controls */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="p-6 bg-white/80 backdrop-blur-lg shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Companion Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Happiness</span>
                    <span className="text-sm text-gray-600">{stats.happiness}/100</span>
                  </div>
                  <Progress value={stats.happiness} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Energy</span>
                    <span className="text-sm text-gray-600">{stats.energy}/100</span>
                  </div>
                  <Progress value={stats.energy} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Health</span>
                    <span className="text-sm text-gray-600">{stats.health}/100</span>
                  </div>
                  <Progress value={stats.health} className="h-3" />
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Card className="p-6 bg-white/80 backdrop-blur-lg shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Care Actions</h2>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={handleFeed}
                  className="bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white"
                >
                  🍎 Feed (+10 Happiness, +5 Health)
                </Button>
                <Button 
                  onClick={handlePlay}
                  className="bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white"
                >
                  🎮 Play (+15 Happiness, -10 Energy)
                </Button>
                <Button 
                  onClick={handleRest}
                  className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white"
                >
                  😴 Rest (+20 Energy, +5 Health)
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <SachetButton />
    </div>
  );
};

export default PouGame;
