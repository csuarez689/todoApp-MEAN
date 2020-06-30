import { AuthService } from '../services/auth.service';

export function appInitializer(authService: AuthService) {
  return () =>
    new Promise((resolve) => {
      if (authService.getToken())
        // attempt to refresh token on app start up to auto authenticate
        authService.getNewAccessToken().subscribe().add(resolve);
      resolve();
    });
}
