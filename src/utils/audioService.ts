
// Simple audio service for managing sound effects in the game

class AudioService {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;

  // Initialize with default game sounds
  constructor() {
    // Define game sounds
    const defaultSounds = {
      click: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
      boost: "https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3",
      heart: "https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3",
      bonus: "https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3",
      levelup: "https://assets.mixkit.co/active_storage/sfx/1993/1993-preview.mp3"
    };

    // Preload all sounds
    Object.entries(defaultSounds).forEach(([key, url]) => {
      this.loadSound(key, url);
    });
  }

  // Load a sound into memory
  loadSound(name: string, url: string): void {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
  }

  // Play a sound by name
  play(name: string): void {
    if (this.isMuted) return;
    
    const sound = this.sounds.get(name);
    if (sound) {
      // Create a clone to allow overlapping sounds
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.5; // Set to 50% volume by default
      soundClone.play().catch(e => console.log("Error playing sound:", e));
    }
  }

  // Mute/unmute all sounds
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Set mute state explicitly
  setMute(muted: boolean): void {
    this.isMuted = muted;
  }

  // Check if audio is muted
  getMuted(): boolean {
    return this.isMuted;
  }
}

// Export a singleton instance
export const audioService = new AudioService();
