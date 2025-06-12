
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Monster {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  icon: string;
  suggestion: string;
}

interface MonsterDefeatSystemProps {
  monsters: Monster[];
  onMonsterDefeated: (monsterId: string, xp: number, coins: number) => void;
  onMonsterWeakened: (monsterId: string, damage: number) => void;
  children: React.ReactNode;
}

interface DroppedItem {
  item: any;
  effectiveness: number;
  x: number;
  y: number;
}

export const MonsterDefeatSystem = ({
  monsters,
  onMonsterDefeated,
  onMonsterWeakened,
  children
}: MonsterDefeatSystemProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [droppedItem, setDroppedItem] = useState<DroppedItem | null>(null);
  const [showDamage, setShowDamage] = useState<{monsterId: string, damage: number} | null>(null);
  const [defeatedMonster, setDefeatedMonster] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    try {
      const dragData = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { item, effectiveness } = dragData;

      if (effectiveness > 0 && monsters.length > 0) {
        // Find the most effective target monster
        let targetMonster = monsters[0];
        let maxEffectiveness = 0;

        monsters.forEach(monster => {
          const monsterEffectiveness = item.effectiveness[monster.id] || 0;
          if (monsterEffectiveness > maxEffectiveness) {
            maxEffectiveness = monsterEffectiveness;
            targetMonster = monster;
          }
        });

        const damage = effectiveness;
        const newHp = Math.max(0, targetMonster.hp - damage);

        // Show damage animation
        setShowDamage({ monsterId: targetMonster.id, damage });
        setTimeout(() => setShowDamage(null), 1500);

        // Show item drop animation
        const rect = e.currentTarget.getBoundingClientRect();
        setDroppedItem({
          item,
          effectiveness,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        setTimeout(() => setDroppedItem(null), 2000);

        if (newHp <= 0) {
          // Monster defeated
          setDefeatedMonster(targetMonster.id);
          setTimeout(() => setDefeatedMonster(null), 2000);
          
          const xpReward = targetMonster.maxHp * 10;
          const coinReward = targetMonster.maxHp * 5;
          onMonsterDefeated(targetMonster.id, xpReward, coinReward);
        } else {
          // Monster weakened
          onMonsterWeakened(targetMonster.id, damage);
        }
      }
    } catch (error) {
      console.error("Error processing dropped item:", error);
    }
  };

  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        dragOver ? "bg-yellow-100/50 scale-105" : ""
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drag over indicator */}
      {dragOver && (
        <div className="absolute inset-0 border-4 border-dashed border-yellow-400 rounded-lg flex items-center justify-center bg-yellow-100/30 pointer-events-none z-10">
          <div className="text-lg font-bold text-yellow-700 text-center">
            ⚡ Drop here to help Uteroo! ⚡
          </div>
        </div>
      )}

      {/* Dropped item animation */}
      {droppedItem && (
        <div 
          className="absolute pointer-events-none z-20 animate-bounce"
          style={{
            left: droppedItem.x,
            top: droppedItem.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="text-2xl bg-white rounded-full p-2 shadow-lg border-2 border-yellow-400">
            {droppedItem.item.name.split(' ')[0]}
          </div>
        </div>
      )}

      {/* Damage indicator */}
      {showDamage && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div className="text-xl font-bold text-red-600 animate-bounce bg-white/80 rounded-full px-3 py-1 border-2 border-red-400">
            -{showDamage.damage} HP
          </div>
        </div>
      )}

      {/* Victory animation */}
      {defeatedMonster && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="text-center animate-pulse-glow">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-xl font-bold text-green-600 bg-white/90 rounded-lg px-4 py-2 shadow-lg">
              Monster Defeated!
            </div>
            <div className="text-lg text-yellow-600 font-semibold mt-1">
              Victory! 🏆
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
