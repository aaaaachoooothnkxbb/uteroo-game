
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Settings } from "lucide-react";
import { audioService } from "@/utils/audioService";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export const AudioToggle = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [uiMuted, setUiMuted] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [ambientMuted, setAmbientMuted] = useState(false);
  const [uiVolume, setUiVolume] = useState(0.5);
  const [voiceVolume, setVoiceVolume] = useState(0.7);
  const [ambientVolume, setAmbientVolume] = useState(0.3);

  useEffect(() => {
    // Initialize state from audio service
    setIsMuted(audioService.getMuted());
    setUiMuted(audioService.getCategoryMuted('ui'));
    setVoiceMuted(audioService.getCategoryMuted('voice'));
    setAmbientMuted(audioService.getCategoryMuted('ambient'));
    setUiVolume(audioService.getCategoryVolume('ui'));
    setVoiceVolume(audioService.getCategoryVolume('voice'));
    setAmbientVolume(audioService.getCategoryVolume('ambient'));
  }, []);

  const toggleMute = () => {
    const newMutedState = audioService.toggleMute();
    setIsMuted(newMutedState);
    
    // Play a test sound when unmuting
    if (!newMutedState) {
      audioService.play('click');
    }
  };

  const handleUiMuteChange = (checked: boolean) => {
    audioService.setCategoryMute('ui', checked);
    setUiMuted(checked);
    
    // Play test sound if unmuting
    if (!checked && !isMuted) {
      audioService.play('click');
    }
  };

  const handleVoiceMuteChange = (checked: boolean) => {
    audioService.setCategoryMute('voice', checked);
    setVoiceMuted(checked);
  };

  const handleAmbientMuteChange = (checked: boolean) => {
    audioService.setCategoryMute('ambient', checked);
    setAmbientMuted(checked);
  };

  const handleUiVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    audioService.setCategoryVolume('ui', newVolume);
    setUiVolume(newVolume);
    
    // Play test sound
    if (!isMuted && !uiMuted) {
      audioService.play('click');
    }
  };

  const handleVoiceVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    audioService.setCategoryVolume('voice', newVolume);
    setVoiceVolume(newVolume);
  };

  const handleAmbientVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    audioService.setCategoryVolume('ambient', newVolume);
    setAmbientVolume(newVolume);
  };

  return (
    <div className="flex items-center gap-2">
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
      
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            aria-label="Audio settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sound Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Main audio toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="main-audio" className="text-base">All Audio</Label>
              <Switch 
                id="main-audio" 
                checked={!isMuted}
                onCheckedChange={(checked) => {
                  audioService.setMute(!checked);
                  setIsMuted(!checked);
                  if (checked) audioService.play('click');
                }}
              />
            </div>
            
            <div className="space-y-4">
              {/* UI Sound Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ui-audio" className="text-sm">UI Sounds</Label>
                  <Switch 
                    id="ui-audio" 
                    checked={!uiMuted}
                    onCheckedChange={(checked) => handleUiMuteChange(!checked)}
                    disabled={isMuted}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Slider
                    disabled={isMuted || uiMuted}
                    value={[uiVolume]}
                    onValueChange={handleUiVolumeChange}
                    max={1}
                    step={0.05}
                    aria-label="UI Sound Volume"
                  />
                  <div className="flex text-xs text-gray-500 justify-between">
                    <span>Quiet</span>
                    <span>Loud</span>
                  </div>
                </div>
              </div>
              
              {/* Voice Sound Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-audio" className="text-sm">Voice Feedback</Label>
                  <Switch 
                    id="voice-audio" 
                    checked={!voiceMuted}
                    onCheckedChange={(checked) => handleVoiceMuteChange(!checked)}
                    disabled={isMuted}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Slider
                    disabled={isMuted || voiceMuted}
                    value={[voiceVolume]}
                    onValueChange={handleVoiceVolumeChange}
                    max={1}
                    step={0.05}
                    aria-label="Voice Feedback Volume"
                  />
                  <div className="flex text-xs text-gray-500 justify-between">
                    <span>Quiet</span>
                    <span>Loud</span>
                  </div>
                </div>
              </div>
              
              {/* Ambient Sound Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ambient-audio" className="text-sm">Ambient Sounds</Label>
                  <Switch 
                    id="ambient-audio" 
                    checked={!ambientMuted}
                    onCheckedChange={(checked) => handleAmbientMuteChange(!checked)}
                    disabled={isMuted}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Slider
                    disabled={isMuted || ambientMuted}
                    value={[ambientVolume]}
                    onValueChange={handleAmbientVolumeChange}
                    max={1}
                    step={0.05}
                    aria-label="Ambient Sound Volume"
                  />
                  <div className="flex text-xs text-gray-500 justify-between">
                    <span>Quiet</span>
                    <span>Loud</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mt-4">
              Sounds help make Uteroo more accessible and emotionally connected to your experience.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
