
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { audioService } from "@/utils/audioService";

export const AudioToggle = () => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Initialize state from audio service
    setIsMuted(audioService.getMuted());
  }, []);

  const toggleMute = () => {
    const newMutedState = audioService.toggleMute();
    setIsMuted(newMutedState);
    
    // Play a test sound when unmuting
    if (!newMutedState) {
      audioService.play('click');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleMute}
      className="h-8 w-8 p-0 rounded-full"
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
    >
      {isMuted ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
};
