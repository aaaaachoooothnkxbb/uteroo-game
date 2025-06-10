
export interface AvatarOptions {
  animal: string;
  color: string;
  accessory: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  companion_name?: string;
  avatar_animal?: string;
  avatar_color?: string;
  avatar_accessory?: string;
  questionnaire_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}
