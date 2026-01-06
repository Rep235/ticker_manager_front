import { authService } from '../services/authService';

export const useAuth = () => {
  const isAuthenticated = authService.isAuthenticated();
  const token = authService.getToken();

  const logout = () => {
    authService.logout();
  };

  return {
    isAuthenticated,
    token,
    logout,
  };
};
