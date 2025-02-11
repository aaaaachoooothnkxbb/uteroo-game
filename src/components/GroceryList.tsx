
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GroceryItem {
  id: string;
  item_name: string;
  is_checked: boolean;
}

interface GroceryListProps {
  phase: string;
}

export function GroceryList({ phase }: GroceryListProps) {
  const [items, setItems] = useState<GroceryItem[]>([]);

  useEffect(() => {
    fetchGroceryList();
  }, [phase]);

  const fetchGroceryList = async () => {
    const { data, error } = await supabase
      .from('grocery_lists')
      .select('*')
      .eq('phase', phase)
      .order('item_name');

    if (error) {
      console.error('Error fetching grocery list:', error);
      return;
    }

    setItems(data);
  };

  const toggleItem = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from('grocery_lists')
      .update({ is_checked: !currentState })
      .eq('id', id);

    if (error) {
      console.error('Error updating item:', error);
      return;
    }

    setItems(items.map(item => 
      item.id === id ? { ...item, is_checked: !currentState } : item
    ));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <img 
            src="/lovable-uploads/b293163a-3aff-42ee-8b1f-d2c10ccadafb.png" 
            alt="Grocery List" 
            className="w-12 h-12 object-contain pixelated"
          />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">
            {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase Grocery List
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[80vh] mt-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg"
              >
                <span className={item.is_checked ? "line-through text-gray-500" : ""}>
                  {item.item_name}
                </span>
                <button
                  onClick={() => toggleItem(item.id, item.is_checked)}
                  className={`p-1 rounded-full ${
                    item.is_checked ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {item.is_checked ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
