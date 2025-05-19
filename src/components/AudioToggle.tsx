
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Settings, Volume1, Headphones, Music } from "lucide-react";
import { audioService } from "@/utils/audioService";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const AudioToggle = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [uiMuted, setUiMuted] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [ambientMuted, setAmbientMuted] = useState(false);
  const [uiVolume, setUiVolume] = useState(0.5);
  const [voiceVolume, setVoiceVolume] = useState(0.7);
  const [ambientVolume, setAmbientVolume] = useState(0.3);
  const [showAccessibilityTip, setShowAccessibilityTip] = useState(true);

  useEffect(() => {
    // Initialize state from audio service
    setIsMuted(audioService.getMuted());
    setUiMuted(audioService.getCategoryMuted('ui'));
    setVoiceMuted(audioService.getCategoryMuted('voice'));
    setAmbientMuted(audioService.getCategoryMuted('ambient'));
    setUiVolume(audioService.getCategoryVolume('ui'));
    setVoiceVolume(audioService.getCategoryVolume('voice'));
    setAmbientVolume(audioService.getCategoryVolume('ambient'));
    
    // Check if we've shown the accessibility tip before
    const tipShown = localStorage.getItem('uteroo_accessibility_tip_shown');
    if (tipShown) {
      setShowAccessibilityTip(false);
    }
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
    
    // Play test voice sound if unmuting
    if (!checked && !isMuted) {
      audioService.play('voice_welcome');
    }
  };

  const handleAmbientMuteChange = (checked: boolean) => {
    audioService.setCategoryMute('ambient', checked);
    setAmbientMuted(checked);
    
    // Play test ambient sound if unmuting
    if (!checked && !isMuted) {
      audioService.play('yoga');
    }
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
    
    // Play test voice sound if volume is high enough
    if (!isMuted && !voiceMuted && newVolume > 0.1) {
      audioService.play('voice_welcome');
    }
  };

  const handleAmbientVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    audioService.setCategoryVolume('ambient', newVolume);
    setAmbientVolume(newVolume);
    
    // Play test ambient sound if volume is high enough
    if (!isMuted && !ambientMuted && newVolume > 0.1) {
      audioService.play('yoga');
    }
  };

  const dismissAccessibilityTip = () => {
    setShowAccessibilityTip(false);
    localStorage.setItem('uteroo_accessibility_tip_shown', 'true');
  };

  // Function to get the volume icon based on volume level
  const getVolumeIcon = () => {
    if (isMuted) return <VolumeX className="h-4 w-4" />;
    
    // Get the average of all unmuted volumes
    let totalVolume = 0;
    let unmutedCount = 0;
    
    if (!uiMuted) {
      totalVolume += uiVolume;
      unmutedCount++;
    }
    if (!voiceMuted) {
      totalVolume += voiceVolume;
      unmutedCount++;
    }
    if (!ambientMuted) {
      totalVolume += ambientVolume;
      unmutedCount++;
    }
    
    const averageVolume = unmutedCount > 0 ? totalVolume / unmutedCount : 0;
    
    if (averageVolume < 0.3) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleMute}
        className={cn(
          "h-8 w-8 p-0 rounded-full", 
          !isMuted && "bg-green-50"
        )}
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      >
        {getVolumeIcon()}
      </Button>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            aria-label="Audio settings"
            onClick={() => audioService.play('click')}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Sound & Accessibility Settings
            </DialogTitle>
            <DialogDescription>
              Customize your sound experience to make Uteroo work best for you.
            </DialogDescription>
          </DialogHeader>
          
          {showAccessibilityTip && (
            <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
              <h4 className="font-medium text-blue-800 mb-1">Accessibility Tip</h4>
              <p className="text-blue-700 text-xs">
                Sound cues help make Uteroo more accessible for everyone. Each phase has unique sounds to help you identify them, and UI elements have distinct audio feedback.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-xs h-7"
                onClick={dismissAccessibilityTip}
              >
                Got it
              </Button>
            </div>
          )}
          
          <div className="space-y-6 py-4">
            {/* Main audio toggle */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <Music className="h-5 w-5 text-primary" />
                <Label htmlFor="main-audio" className="text-base">All Audio</Label>
              </div>
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
            
            <div className="space-y-5">
              {/* UI Sound Controls */}
              <div className="space-y-2 border-b pb-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ui-audio" className="text-sm font-medium">UI Sounds</Label>
                  <Switch 
                    id="ui-audio" 
                    checked={!uiMuted}
                    onCheckedChange={(checked) => handleUiMuteChange(!checked)}
                    disabled={isMuted}
                  />
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Button clicks, interactions, and interface feedback
                </p>
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
              <div className="space-y-2 border-b pb-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-audio" className="text-sm font-medium">Voice Feedback</Label>
                  <Switch 
                    id="voice-audio" 
                    checked={!voiceMuted}
                    onCheckedChange={(checked) => handleVoiceMuteChange(!checked)}
                    disabled={isMuted}
                  />
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Uteroo's voice guidance and emotional support
                </p>
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
                  <Label htmlFor="ambient-audio" className="text-sm font-medium">Ambient Sounds</Label>
                  <Switch 
                    id="ambient-audio" 
                    checked={!ambientMuted}
                    onCheckedChange={(checked) => handleAmbientMuteChange(!checked)}
                    disabled={isMuted}
                  />
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Phase transitions and room environment sounds
                </p>
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
              <p>
                Each cycle phase has unique sounds to help identify them through audio cues.
                These sounds change based on your current phase and help create a more immersive experience.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                // Test all sound categories
                if (!isMuted) {
                  if (!uiMuted) audioService.play('click');
                  if (!voiceMuted) setTimeout(() => audioService.play('voice_welcome'), 500);
                  if (!ambientMuted) setTimeout(() => audioService.play(audioService.getPhase()), 1000);
                }
              }}
              size="sm"
              className="self-start"
            >
              Test Sound
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
