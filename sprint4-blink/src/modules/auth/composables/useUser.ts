import { ref, computed } from 'vue';
import type { User } from '../types/auth.types';
import { authService } from '../services/auth.service';

const user = ref<User | null>(null);
const avatarUrl = ref<string | null>(null);
const AVATAR_KEY = 'user_avatar';

const loadStoredAvatar = () => {
  const stored = localStorage.getItem(AVATAR_KEY);
  if (stored) {
    avatarUrl.value = stored;
  }
};

loadStoredAvatar();

export function useUser() {
  const loadUser = async () => {
    try {
      const me = await authService.getCurrentUser();
      user.value = me;
      authService.setUser(me);
      return me;
    } catch (error) {
      throw error;
    }
  };

  const updateAvatar = (newAvatarUrl: string) => {
    avatarUrl.value = newAvatarUrl;
    localStorage.setItem(AVATAR_KEY, newAvatarUrl);
  };

  const updateUser = (updatedUser: User) => {
    user.value = updatedUser;
    authService.setUser(updatedUser);
  };

  const getCurrentUser = () => user.value;

  const clearAvatar = () => {
    avatarUrl.value = null;
    localStorage.removeItem(AVATAR_KEY);
  };

  return {
    user: computed(() => user.value),
    avatarUrl: computed(() => avatarUrl.value),
    loadUser,
    updateAvatar,
    updateUser,
    getCurrentUser,
    clearAvatar,
  };
}
