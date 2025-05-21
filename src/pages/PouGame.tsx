import React, { useState, useEffect, useCallback } from 'react';
import { UterooCharacter } from '@/components/UterooCharacter';
import { Room } from '@/components/Room';
import { Item, ItemType } from '@/components/Item';
import { Modal } from '@/components/Modal';
import { Heart, Apple, Droplet, BatteryFull, Coins as CoinsIcon } from 'lucide-react';
import { audioService } from '@/utils/audioService';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

// Define types for stats and items
type Phase = "menstruation" | "follicular" | "ovulatory" | "luteal";

type Stats = {
  hunger: number;
  hygiene: number;
  energy: number;
  happiness: number;
  hearts?: number;
  coins?: number;
};

type ItemData = {
  id: string;
  name: string;
  type: ItemType;
  image: string;
  effect: number;
  cost: number;
  description: string;
  sound?: string;
};

// Data for items
const items: ItemData[] = [
  {
    id: "apple",
    name: "Apple",
    type: "food",
    image: "/lovable-uploads/lovable-uploads/6964a937-d063-4579-999b-89a99575e75a.png",
    effect: 15,
    cost: 5,
    description: "A juicy apple to satisfy hunger.",
    sound: 'eat'
  },
  {
    id: "soap",
    name: "Soap",
    type: "hygiene",
    image: "/lovable-uploads/lovable-uploads/6964a937-d063-4579-999b-89a99575e75a.png",
    effect: 20,
    cost: 8,
    description: "Keeps Uteroo clean and happy.",
    sound: 'bubbles'
  },
  {
    id: "nap",
    name: "Nap",
    type: "energy",
    image: "/lovable-uploads/lovable-uploads/6964a937-d063-4579-999b-89a99575e75a.png",
    effect: 25,
    cost: 10,
    description: "A short nap to restore energy.",
    sound: 'sleep'
  },
  {
    id: "game",
    name: "Game",
    type: "entertainment",
    image: "/lovable-uploads/lovable-uploads/6964a937-d063-4579-999b-89a99575e75a.png",
    effect: 18,
    cost: 7,
    description: "A fun game to boost happiness.",
    sound: 'game_reward'
  },
];

// Data for rooms
const gameRooms = [
  {
    id: "bedroom",
    name: "Bedroom",
    image: "/lovable-uploads/lovable-uploads/6964a937-d063-4579-999b-89a99575e75a.png",
    description: "A cozy bedroom for resting.",
    sound: 'ambient_bedroom'
  },
  {
    id: "kitchen",
    name: "Kitchen",
    image: "/lovable-uploads/lovable-uploads/6964a937-d063-4579-999b-89a99575e75a.png",
    description: "A fully equipped kitchen for cooking.",
    sound: 'ambient_kitchen'
  },
  {
    id: "bathroom",
    name: "Bathroom",
    image: "/lovable-uploads/lovable-uploads/6964a937-d063-4579-999b-89a99575e75a.png",
    description: "A clean bathroom for personal hygiene.",
    sound: 'ambient_bathroom'
  },
  {
    id: "lab",
    name: "Lab",
    image: "/lovable-uploads/lovable-uploads/6964a937-d063-4579-999b-89a99575e75a.png",
    description: "A science lab for experiments.",
    sound: 'ambient_lab'
  },
];

const phases: Phase[] = ["menstruation", "follicular", "ovulatory", "luteal"];

// Interface for floating hearts
interface FloatingHeart {
  id: string;
  x: number;
  y: number;
}

const PouGame = () => {
  const [stats, setStats] = useState<Stats>({
    hunger: 50,
    hygiene: 50,
    energy: 50,
    happiness: 50,
    hearts: 0,
    coins: 0,
  });
  const [currentRoom, setCurrentRoom] = useState(gameRooms[0]);
  const [currentPhase, setCurrentPhase] = useState<Phase>(phases[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [draggedItem, setDraggedItem] = useState<ItemData | null>(null);
  const [showHeartBonus, setShowHeartBonus] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [boostIndicator, setBoostIndicator] = useState<{ item: string; type: string } | null>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [phaseModalContent, setPhaseModalContent] = useState<React.ReactNode>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to handle phase transition
  const handlePhaseTransition = useCallback(() => {
    const currentPhaseIndex = phases.indexOf(currentPhase);
    const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
    const nextPhase = phases[nextPhaseIndex];

    // Set the next phase
    setCurrentPhase(nextPhase);

    // Show phase transition modal
    setPhaseModalContent(
      <div className="flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-4">Phase Transition!</h2>
        <p className="text-lg">Uteroo is now entering the <span className="font-semibold">{nextPhase}</span> phase.</p>
        <button onClick={() => setShowPhaseModal(false)} className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Continue
        </button>
      </div>
    );
    setShowPhaseModal(true);
  }, [currentPhase]);

  // Lifecycle: Check if it's time for a phase transition every 30 seconds
  useEffect(() => {
    const phaseInterval = setInterval(() => {
      handlePhaseTransition();
    }, 30000); // Transition every 30 seconds (for testing)

    return () => clearInterval(phaseInterval);
  }, [handlePhaseTransition]);

  // Function to handle Uteroo interaction
  const handleUterooClick = useCallback(() => {
    // Play a sound when Uteroo is clicked
    audioService.play('cute_click');

    // Create a new floating heart
    const newHeart: FloatingHeart = {
      id: `heart-${Date.now()}`,
      x: Math.random() * 40 - 20, // Random offset for x position
      y: -20 - Math.random() * 30, // Start position above character
    };

    setFloatingHearts(prev => [...prev, newHeart]);

    // Remove the heart after animation completes
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
    }, 1500);
  }, []);

  // Calculate overall health level based on stats (weighted average)
  const calculateHealthLevel = () => {
    // Weight each stat differently
    const weights = {
      hunger: 0.25,
      hygiene: 0.2,
      energy: 0.3,
      happiness: 0.25
    };
    
    // Calculate weighted average
    const weightedSum = (stats.hunger * weights.hunger) + 
                        (stats.hygiene * weights.hygiene) + 
                        (stats.energy * weights.energy) + 
                        (stats.happiness * weights.happiness);
    
    return weightedSum;
  };

  // Function to handle item usage
  const useItem = (item: ItemData) => {
    setStats((prevStats) => {
      const updatedStats = { ...prevStats };
      switch (item.type) {
        case "food":
          updatedStats.hunger = Math.min(100, prevStats.hunger + item.effect);
          break;
        case "hygiene":
          updatedStats.hygiene = Math.min(100, prevStats.hygiene + item.effect);
          break;
        case "energy":
          updatedStats.energy = Math.min(100, prevStats.energy + item.effect);
          break;
        case "entertainment":
          updatedStats.happiness = Math.min(100, prevStats.happiness + item.effect);
          break;
      }

      // Play item-specific sound
      if (item.sound) {
        audioService.play(item.sound);
      }

      // Show boost indicator
      setBoostIndicator({ item: item.name, type: item.type });
      setTimeout(() => setBoostIndicator(null), 3000);

      return updatedStats;
    });
  };

  // Function to handle room change
  const changeRoom = (room: typeof gameRooms[number]) => {
    setCurrentRoom(room);
  };

  // Function to get progress color based on value
  const getProgressColor = (value: number) => {
    if (value < 30) return "bg-red-500";
    if (value < 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Stats panel rendering with updated styling - transparent and cute
  const renderStatsPanel = () => {
    return (
      <div className="bg-gradient-to-r from-pink-50/30 to-purple-50/30 backdrop-blur-sm p-4 rounded-2xl border border-white/30 shadow-sm mb-4 animate-pulse-slow">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center">
            <span className="text-lg mr-1">✨</span> 
            Uteroo Status
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-yellow-100/70 px-2 py-0.5 rounded-full">
              <CoinsIcon className="h-3.5 w-3.5 text-yellow-500 mr-1" />
              <span className="text-xs font-medium text-yellow-800">{stats.coins || 0}</span>
            </div>
            
            <div className="flex items-center bg-pink-100/70 px-2 py-0.5 rounded-full">
              <Heart className="h-3.5 w-3.5 text-pink-500 mr-1 animate-bounce-slow" />
              <span className="text-xs font-medium text-pink-800">{stats.hearts || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">Hunger</span>
              <Apple className="h-3.5 w-3.5 text-red-500" />
            </div>
            <Progress value={stats.hunger} className="h-2 mb-2" indicatorClassName={getProgressColor(stats.hunger)} />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">Hygiene</span>
              <Droplet className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <Progress value={stats.hygiene} className="h-2 mb-2" indicatorClassName={getProgressColor(stats.hygiene)} />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">Energy</span>
              <BatteryFull className="h-3.5 w-3.5 text-green-500" />
            </div>
            <Progress value={stats.energy} className="h-2 mb-2" indicatorClassName={getProgressColor(stats.energy)} />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">Happiness</span>
              <Heart className="h-3.5 w-3.5 text-pink-500" />
            </div>
            <Progress value={stats.happiness} className="h-2 mb-2" indicatorClassName={getProgressColor(stats.happiness)} />
          </div>
        </div>
      </div>
    );
  };

  // Drag and Drop Handlers
  const handleDragStart = (item: ItemData) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem) {
      useItem(draggedItem);
      setDraggedItem(null);

      // Show heart bonus
      setShowHeartBonus(true);
      setTimeout(() => setShowHeartBonus(false), 2000);

      // Add floating hearts
      const numberOfHearts = 3;
      for (let i = 0; i < numberOfHearts; i++) {
        const newHeart: FloatingHeart = {
          id: `heart-${Date.now()}-${i}`,
          x: Math.random() * 60 - 30,
          y: -20 - Math.random() * 40,
        };
        setFloatingHearts((prev) => [...prev, newHeart]);

        // Remove the heart after animation completes
        setTimeout(() => {
          setFloatingHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id));
        }, 1500);
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <img
          src="/lovable-uploads/lovable-uploads/6964a937-d063-4579-999b-89a99575e75a.png"
          alt="Background"
          className="object-cover w-full h-full"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full bg-white/50 backdrop-blur-sm border-b border-white/30 h-24 flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-black drop-shadow-md">Uteroo Game</h1>
          <nav>
            <button onClick={() => navigate('/about')} className="bg-blue-500 text-white rounded-full px-4 py-2">About</button>
          </nav>
        </header>

        {/* Main content area */}
        <div className="flex-1 pt-28 pb-6 px-4">
          <div className="max-w-md mx-auto">
            {/* Room navigation */}
            <div className="flex justify-between mb-4">
              {gameRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => changeRoom(room)}
                  className={`bg-gray-200 rounded-full px-4 py-2 ${currentRoom.id === room.id ? 'bg-blue-300' : ''}`}
                >
                  {room.name}
                </button>
              ))}
            </div>
            
            {/* Stats panel */}
            {renderStatsPanel()}
            
            {/* Character area with healthLevel prop */}
            <div 
              className="relative flex justify-center mb-4 mx-auto"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {/* Heart bonus indicator */}
              {showHeartBonus && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-bold animate-bounce-slow z-20">
                  +5 Hearts Bonus! 💗
                </div>
              )}
              
              {/* Floating hearts animation */}
              {floatingHearts.map(heart => (
                <div
                  key={heart.id}
                  className="absolute pointer-events-none"
                  style={{
                    transform: `translate(${heart.x}px, ${heart.y}px)`,
                    animation: 'float-up 1.5s ease-out forwards'
                  }}
                >
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
                    <span className="text-xs font-bold text-white bg-pink-500 rounded-full px-1 ml-0.5">+1</span>
                  </div>
                </div>
              ))}
              
              <UterooCharacter 
                phase={currentPhase} 
                currentRoom={currentRoom.id} 
                size="large" 
                minimal={false}
                healthLevel={calculateHealthLevel()} 
                onClick={handleUterooClick}
              />
              
              {/* Boost indicators */}
              {boostIndicator && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-bold animate-bounce-slow z-20">
                  +{boostIndicator.item} {boostIndicator.type}!
                </div>
              )}
            </div>
            
            {/* Items to use */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Items</h3>
              <div className="flex overflow-x-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="mr-4 last:mr-0 flex-shrink-0 w-24"
                  >
                    <div
                      className="relative rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={() => handleDragStart(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-24"
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-sm p-2">
                        {item.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phase Transition Modal */}
        <Modal isOpen={showPhaseModal} onClose={() => setShowPhaseModal(false)}>
          {phaseModalContent}
        </Modal>
      </div>
      
      <style>
        {`
        /* Floating animation for hearts */
        @keyframes float-up {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }

        /* Bouncing animation for bonus indicators */
        @keyframes bounce-slow {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        `}
      </style>
    </div>
  );
};

export default PouGame;
