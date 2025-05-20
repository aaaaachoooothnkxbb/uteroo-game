// Sound service for managing sound effects in the game with phase-awareness and accessibility

type SoundCategory = 'ui' | 'voice' | 'ambient';

interface Sound {
  url: string;
  volume: number;
  category: SoundCategory;
  description?: string;
  phase?: string; // Associate sounds with specific cycle phases
  emotion?: string; // Associate sounds with specific emotions
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
  private audioElements: Map<string, HTMLAudioElement> = new Map();

  // Initialize with default game sounds
  constructor() {
    // Define game sounds by category
    const defaultSounds: Record<string, Sound> = {
      // UI Sounds
      click: { url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", volume: 0.4, category: 'ui' },
      boost: { url: "https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3", volume: 0.5, category: 'ui' },
      heart: { url: "https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3", volume: 0.5, category: 'ui' },
      bubble: { url: "https://assets.mixkit.co/active_storage/sfx/2199/2199-preview.mp3", volume: 0.5, category: 'ui', description: 'Cute bubble pop sound' },
      bonus: { url: "https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3", volume: 0.6, category: 'ui' },
      
      // Phase transition sounds - more emotionally matched to each phase
      levelup: { url: "https://assets.mixkit.co/active_storage/sfx/1993/1993-preview.mp3", volume: 0.5, category: 'ambient' },
      menstruation: { url: "https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3", volume: 0.4, category: 'ambient', phase: 'menstruation', description: 'Deep gong for menstruation phase' },
      follicular: { url: "https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3", volume: 0.4, category: 'ambient', phase: 'follicular', description: 'Rising, energetic tone for follicular phase' },
      ovulatory: { url: "https://assets.mixkit.co/active_storage/sfx/220/220-preview.mp3", volume: 0.4, category: 'ambient', phase: 'ovulatory', description: 'Wind chimes for ovulatory phase' },
      luteal: { url: "https://assets.mixkit.co/active_storage/sfx/211/211-preview.mp3", volume: 0.4, category: 'ambient', phase: 'luteal', description: 'Gentle decrease for luteal phase' },
      
      // Healing/Self-care sounds
      water: { url: "https://assets.mixkit.co/active_storage/sfx/1349/1349-preview.mp3", volume: 0.5, category: 'ui', description: 'Water droplet sound for hydration' },
      fire: { url: "https://assets.mixkit.co/active_storage/sfx/239/239-preview.mp3", volume: 0.3, category: 'ambient', description: 'Crackling fire for heating pad', phase: 'menstruation' },
      yoga: { url: "https://assets.mixkit.co/active_storage/sfx/2448/2448-preview.mp3", volume: 0.3, category: 'ambient' },
      
      // Room-specific sounds
      bedroom: { url: "https://assets.mixkit.co/active_storage/sfx/2301/2301-preview.mp3", volume: 0.3, category: 'ui', description: 'Soft bedroom sound' },
      bathroom: { url: "https://assets.mixkit.co/active_storage/sfx/177/177-preview.mp3", volume: 0.3, category: 'ui', description: 'Bathroom ambience' },
      kitchen: { url: "https://assets.mixkit.co/active_storage/sfx/156/156-preview.mp3", volume: 0.3, category: 'ui', description: 'Kitchen sounds' },
      lab: { url: "https://assets.mixkit.co/active_storage/sfx/3200/3200-preview.mp3", volume: 0.4, category: 'ui', description: 'Laboratory beep sound' },
      
      // Mood sounds - emotional sounds for mood selection
      mood_happy: { url: "https://assets.mixkit.co/active_storage/sfx/1647/1647-preview.mp3", volume: 0.4, category: 'ui', emotion: 'happy', description: 'Bright chime for happy mood' },
      mood_calm: { url: "https://assets.mixkit.co/active_storage/sfx/2448/2448-preview.mp3", volume: 0.4, category: 'ui', emotion: 'calm', description: 'Calm tone for relaxed mood' },
      mood_sad: { url: "https://assets.mixkit.co/active_storage/sfx/131/131-preview.mp3", volume: 0.4, category: 'ui', emotion: 'sad', description: 'Gentle hum for sad mood' },
      mood_angry: { url: "https://assets.mixkit.co/active_storage/sfx/166/166-preview.mp3", volume: 0.4, category: 'ui', emotion: 'angry', description: 'Low tone for angry mood' },
      
      // Symptom tracking sounds
      symptom_cramps: { url: "https://assets.mixkit.co/active_storage/sfx/149/149-preview.mp3", volume: 0.4, category: 'ui', description: 'Low throb for cramp tracking' },
      symptom_headache: { url: "https://assets.mixkit.co/active_storage/sfx/146/146-preview.mp3", volume: 0.4, category: 'ui', description: 'Pulse sound for headache tracking' },
      
      // Voice feedback samples (placeholders - would use 11Labs in production)
      voice_welcome: { url: "https://assets.mixkit.co/active_storage/sfx/2203/2203-preview.mp3", volume: 0.7, category: 'voice', description: 'Welcome back message' },
      voice_goodjob: { url: "https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3", volume: 0.7, category: 'voice', description: 'Positive reinforcement' },
      voice_streak: { url: "https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3", volume: 0.7, category: 'voice', description: 'Streak milestone celebration' },
      voice_booster: { url: "https://assets.mixkit.co/active_storage/sfx/1993/1993-preview.mp3", volume: 0.7, category: 'voice', description: 'Booster recommendation' },
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
    
    // Preload audio element to reduce latency on first play
    const audio = new Audio(sound.url);
    audio.load();
    this.audioElements.set(name, audio);
  }

  // Add a new sound to the library
  addSound(name: string, url: string, category: SoundCategory = 'ui', volume: number = 0.5, options?: Partial<Sound>): void {
    this.loadSound(name, { 
      url, 
      volume, 
      category,
      ...options
    });
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
    
    // Check if we have a preloaded audio element
    let audio = this.audioElements.get(name);
    
    // If the audio is currently playing, create a new instance
    if (audio && !audio.paused) {
      audio = new Audio(sound.url);
    } else if (!audio) {
      // If no audio element exists, create one
      audio = new Audio(sound.url);
      this.audioElements.set(name, audio);
    }
    
    // Apply both sound-specific and category volume
    audio.volume = sound.volume * this.volumes[sound.category]; 
    
    // Play the sound
    audio.play().catch(e => console.log("Error playing sound:", e));
  }

  // Play a phase-specific sound
  playPhaseSound(phase: string): void {
    this.currentPhase = phase;
    this.play(phase);
  }

  // Play a room-specific sound
  playRoomSound(room: string): void {
    // If the sound exists for this room, play it
    if (this.sounds.has(room)) {
      this.play(room);
    } else {
      // Fallback to click sound
      this.play('click');
    }
  }

  // Play a mood-specific sound
  playMoodSound(mood: string): void {
    const moodSound = `mood_${mood.toLowerCase()}`;
    if (this.sounds.has(moodSound)) {
      this.play(moodSound);
    }
  }

  // Play a symptom-specific sound
  playSymptomSound(symptom: string): void {
    const symptomSound = `symptom_${symptom.toLowerCase()}`;
    if (this.sounds.has(symptomSound)) {
      this.play(symptomSound);
    }
  }

  // Set the current cycle phase
  setPhase(phase: string): void {
    this.currentPhase = phase;
  }

  // Get the current cycle phase
  getPhase(): string {
    return this.currentPhase;
  }

  // Get sounds specific to a phase
  getPhaseSounds(phase: string): Sound[] {
    return Array.from(this.sounds.values()).filter(sound => sound.phase === phase);
  }

  // Get sounds for an emotion
  getEmotionSounds(emotion: string): Sound[] {
    return Array.from(this.sounds.values()).filter(sound => sound.emotion === emotion);
  }

  // Play welcome message specific to the current phase
  playWelcomeMessage(): void {
    this.play('voice_welcome');
    // After a delay, play the current phase sound
    setTimeout(() => {
      this.play(this.currentPhase);
    }, 1000);
  }

  // Play streak milestone celebration
  playStreakMilestone(streakCount: number): void {
    this.play('voice_streak');
    this.play('bonus');
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
