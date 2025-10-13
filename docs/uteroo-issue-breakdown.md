# UTEROO Development Roadmap

This document translates the high-level UTEROO design brief into a GitHub-friendly issue backlog and provides starter C# templates for the key ScriptableObject assets.

## Issue Backlog Overview

Create issues in the order listed below.  Each issue references the relevant section of the design brief.

### Phase & Data Foundations

- [ ] **Define core enums and ScriptableObject schemas**  
  Implement `PhaseId`, `Currency`, `PhaseConfig`, `NeedConfig`, `MiniGameConfig`, `HormoneCurve`, and any helper structs. Include serialization-ready default values and editor tooling (menus) for quick asset creation.
- [ ] **Seed default phase assets**  
  Author ScriptableObjects for Menstruation Flatland, Follicular Uphill, Ovulatory Mountain, and Luteal Hill with placeholder data (colors, durations, needs, mini-game references) so designers can iterate without touching code.
- [ ] **Create hormone curve assets**  
  Produce AnimationCurves for estrogen (E2), progesterone (P4), LH, and FSH per phase. Ensure curves support day-in-phase sampling described in the brief.

### Time & Phase Progression

- [ ] **Implement `CycleClock` service**  
  Compute current phase and day-in-phase using the user’s local time, notify listeners at midnight, and expose overrides for per-user cycle lengths. Persist and restore the cycle start date.
- [ ] **Phase change broadcast & reset hooks**  
  Raise events when phases change so the Health Bar, world skin, NPCs, and mini-games can react. Include integration tests or editor play-mode tests for midnight rollover.

### Player Care Systems

- [ ] **Health Bar singleton + needs validation flow**  
  Build the four-slot Health Bar, the `NeedButton` interaction, and the HP reward logic (including telemetry hooks and the uterus-better video gate).
- [ ] **Moodometer calculation & tooltip**  
  Implement the hormone-weighted mood formula, care bonuses, penalties, and the dynamic tooltip that explains mood changes.

### World & Content Layers

- [ ] **Environment skin swapping**  
  Swap terrain palette, lighting, music, and NPC schedules when the phase changes. Provide ScriptableObject-driven references for designers.
- [ ] **Phase-aware NPC dialogue system**  
  Add dialogue definitions keyed by phase plus at least two variations each, with rewards or tips linked to needs and mini-games.
- [ ] **Needs panel UI polish**  
  Integrate the ¡WHAT UTEROO NEEDS! header, green completion feedback, and +1 HP micro-feedback animation consistent with the neon art direction.

### Mini-Games & Economy

- [ ] **Mini-game launcher & reward plumbing**  
  Create the `MiniGameLauncher` to load scenes, pipe the phase context, and award the correct currency using the `Rewards` static helper.
- [ ] **Implement Pac-Run (Menstruation)**  
  Build the Pac-Man inspired mini-game with Comfort Dot rewards, cramp/chill hazards, and the 90-second fail conditions.
- [ ] **Implement Snake Bud (Follicular)**  
  Build the snake mini-game with Spark Seed pickups, self/wall collision handling, and progressive speed ramps.
- [ ] **Stub Ovulatory & Luteal mini-games**  
  Provide placeholder scenes for Social Shuffle and Declutter Dash with TODO markers so the systems compile while design iterates.
- [ ] **Currency economy balancing tools**  
  Add developer debugging UI to adjust base rewards, streak bonuses, and mini-game multipliers at runtime.

### Education & Accessibility

- [ ] **Cycle education screen**  
  Create the graph UI that labels hormones as “Luteinizing hormone” and “Follicle-stimulating hormone”, ensures the chart is larger than the uterus illustration, and binds to the `HormoneCurve` data.
- [ ] **Accessibility & settings panel**  
  Implement text scaling, dyslexia-friendly font toggle, reduced motion, and adjustable phase duration settings with safe defaults.

### Save, Rewards, & Meta Systems

- [ ] **Encrypted save system with streaks**  
  Serialize the schema outlined in the brief, encrypt the payload on disk, and optionally sync key values to iCloud.
- [ ] **Phase bonus & video unlock flow**  
  Trigger `uterus-better.mp4` playback on 4/4 HP, grant a phase currency bonus, and mark the phase as rewarded to avoid repeats.
- [ ] **Telemetry opt-in**  
  Gate all analytics events behind an opt-in flag and provide a simple privacy settings screen.

### Optional iOS Shell

- [ ] **SwiftUI host app scaffolding**  
  Wrap Unity as a Library in a SwiftUI `UnityView`, pass cycle preferences through `UnitySendMessage`, and stub local notification scheduling.

## ScriptableObject Templates

Use the following starter C# files to accelerate implementation.  Place them inside `Assets/Uteroo/Data/` within the Unity project.

```csharp
using System;
using UnityEngine;

namespace Uteroo.Data
{
    public enum PhaseId { Menstruation, Follicular, Ovulatory, Luteal }

    public enum Currency { Comfort, Spark, Vibe, Soothe }

    [CreateAssetMenu(menuName = "Uteroo/PhaseConfig")]
    public class PhaseConfig : ScriptableObject
    {
        public PhaseId id;
        public string displayName;
        public Color palettePrimary = Color.white;
        public AudioClip music;
        [Min(1)] public int defaultDurationDays = 3;
        public NeedConfig[] needs;
        public MiniGameConfig miniGame;
        public NPCSchedule[] npcSchedules;
        public EnvironmentSkin skin;
        public HormoneCurve hormoneCurve;
    }

    [Serializable]
    public class NeedConfig
    {
        public string id;
        public string title;
        [TextArea] public string description;
        [Min(0)] public int hpValue = 1;
        public string telemetryKey;
    }

    [CreateAssetMenu(menuName = "Uteroo/MiniGame")]
    public class MiniGameConfig : ScriptableObject
    {
        public string sceneName;
        public string displayName;
        public Currency rewardCurrency;
        [Min(0)] public int baseReward = 10;
    }

    [CreateAssetMenu(menuName = "Uteroo/HormoneCurve")]
    public class HormoneCurve : ScriptableObject
    {
        public AnimationCurve estrogen = AnimationCurve.Linear(0, 0, 1, 1);
        public AnimationCurve progesterone = AnimationCurve.Linear(0, 0, 1, 1);
        public AnimationCurve lh = AnimationCurve.Linear(0, 0, 1, 1);
        public AnimationCurve fsh = AnimationCurve.Linear(0, 0, 1, 1);
    }

    [Serializable]
    public class NPCSchedule
    {
        public string npcId;
        public int startDayInclusive;
        public int endDayInclusive;
    }

    [Serializable]
    public class EnvironmentSkin
    {
        public Material terrainMaterial;
        public Color skyTint = Color.white;
        public AudioClip ambientLoop;
        public GameObject[] decorativeProps;
    }
}
```

## Usage Notes

- When adding new needs, keep IDs stable so saved games remain compatible with future updates.
- The `NPCSchedule` struct can be extended with dialogue set references when the narrative team is ready.
- Designers can duplicate the default phase assets to experiment with alternative cycle configurations without touching the core enums.
- Remember to create addressable entries for mini-game scenes referenced by `MiniGameConfig.sceneName` so they load correctly on device.
