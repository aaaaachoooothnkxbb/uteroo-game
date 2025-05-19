
// Sound service for managing sound effects in the game with phase-awareness and accessibility

type SoundCategory = 'ui' | 'voice' | 'ambient';

interface Sound {
  url: string;
  volume: number;
  category: SoundCategory;
  description?: string;
}

class AudioService {
  private sounds: Map<string, Sound> = new Map();
  private isMuted: boolean = false;
  private categoryMutes: Record<SoundCategory, boolean> = {
    ui: false,
    voice: false,
    ambient: false
  };
  private volumes: Record<SoundCategory, number> = {
    ui: 0.5,
    voice: 0.7,
    ambient: 0.3
  };
  private currentPhase: string = 'menstruation';

  // Initialize with default game sounds
  constructor() {
    // Define game sounds by category
    const defaultSounds: Record<string, Sound> = {
      // UI Sounds
      click: { url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", volume: 0.4, category: 'ui' },
      boost: { url: "https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3", volume: 0.5, category: 'ui' },
      heart: { url: "https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3", volume: 0.5, category: 'ui' },
      bonus: { url: "https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3", volume: 0.6, category: 'ui' },
      
      // Phase transition sounds
      levelup: { url: "https://assets.mixkit.co/active_storage/sfx/1993/1993-preview.mp3", volume: 0.5, category: 'ambient' },
      menstruation: { url: "https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3", volume: 0.4, category: 'ambient' },
      follicular: { url: "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3", volume: 0.4, category: 'ambient' },
      ovulatory: { url: "https://assets.mixkit.co/active_storage/sfx/220/220-preview.mp3", volume: 0.4, category: 'ambient' },
      luteal: { url: "https://assets.mixkit.co/active_storage/sfx/211/211-preview.mp3", volume: 0.4, category: 'ambient' },
      
      // Healing/Self-care sounds
      water: { url: "https://assets.mixkit.co/active_storage/sfx/1349/1349-preview.mp3", volume: 0.5, category: 'ui' },
      fire: { url: "https://assets.mixkit.co/active_storage/sfx/239/239-preview.mp3", volume: 0.3, category: 'ambient', description: 'Crackling fire for heating pad' },
      yoga: { url: "https://assets.mixkit.co/active_storage/sfx/2448/2448-preview.mp3", volume: 0.3, category: 'ambient' },
      
      // Voice feedback samples (placeholders - would use 11Labs in production)
      voice_welcome: { url: "https://assets.mixkit.co/active_storage/sfx/2203/2203-preview.mp3", volume: 0.7, category: 'voice' },
      voice_goodjob: { url: "https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3", volume: 0.7, category: 'voice' },
    };

    // Preload all sounds
    Object.entries(defaultSounds).forEach(([key, sound]) => {
      this.loadSound(key, sound);
    });

    // Try to restore mute settings from localStorage
    try {
      const storedSettings = localStorage.getItem('uteroo_sound_settings');
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        this.isMuted = settings.isMuted ?? false;
        this.categoryMutes = settings.categoryMutes ?? this.categoryMutes;
        this.volumes = settings.volumes ?? this.volumes;
      }
    } catch (e) {
      console.warn('Could not restore sound settings:', e);
    }
  }

  // Load a sound into memory
  loadSound(name: string, sound: Sound): void {
    this.sounds.set(name, sound);
  }

  // Add a new sound to the library
  addSound(name: string, url: string, category: SoundCategory = 'ui', volume: number = 0.5): void {
    this.loadSound(name, { url, volume, category });
  }

  // Play a sound by name
  play(name: string): void {
    if (this.isMuted) return;
    
    const sound = this.sounds.get(name);
    if (!sound) {
      console.warn(`Sound "${name}" not found`);
      return;
    }

    // Check if the sound's category is muted
    if (this.categoryMutes[sound.category]) return;
    
    // Create a clone to allow overlapping sounds
    const audio = new Audio(sound.url);
    audio.volume = sound.volume * this.volumes[sound.category]; // Apply both sound-specific and category volume
    audio.play().catch(e => console.log("Error playing sound:", e));
  }

  // Play a phase-specific sound
  playPhaseSound(phase: string): void {
    this.currentPhase = phase;
    this.play(phase);
  }

  // Set the current cycle phase
  setPhase(phase: string): void {
    this.currentPhase = phase;
  }

  // Get the current cycle phase
  getPhase(): string {
    return this.currentPhase;
  }

  // Mute/unmute all sounds
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.saveSettings();
    return this.isMuted;
  }

  // Set mute state explicitly
  setMute(muted: boolean): void {
    this.isMuted = muted;
    this.saveSettings();
  }

  // Check if audio is muted
  getMuted(): boolean {
    return this.isMuted;
  }

  // Toggle mute for a specific category
  toggleCategoryMute(category: SoundCategory): boolean {
    this.categoryMutes[category] = !this.categoryMutes[category];
    this.saveSettings();
    return this.categoryMutes[category];
  }

  // Set mute state for a specific category
  setCategoryMute(category: SoundCategory, muted: boolean): void {
    this.categoryMutes[category] = muted;
    this.saveSettings();
  }

  // Get mute state for a specific category
  getCategoryMuted(category: SoundCategory): boolean {
    return this.categoryMutes[category];
  }

  // Set volume for a specific category
  setCategoryVolume(category: SoundCategory, volume: number): void {
    this.volumes[category] = Math.max(0, Math.min(1, volume)); // Clamp between 0-1
    this.saveSettings();
  }

  // Get volume for a specific category
  getCategoryVolume(category: SoundCategory): number {
    return this.volumes[category];
  }

  // Save current settings to localStorage
  private saveSettings(): void {
    try {
      localStorage.setItem('uteroo_sound_settings', JSON.stringify({
        isMuted: this.isMuted,
        categoryMutes: this.categoryMutes,
        volumes: this.volumes
      }));
    } catch (e) {
      console.warn('Could not save sound settings:', e);
    }
  }
}

// Export a singleton instance
export const audioService = new AudioService();

