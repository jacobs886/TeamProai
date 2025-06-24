import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Check for development authentication
  const devAuth = localStorage.getItem('dev_auth');
  let devUser = null;
  
  if (devAuth) {
    try {
      const parsed = JSON.parse(devAuth);
      // Check if dev session is still valid (24 hours)
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        devUser = {
          email: parsed.email,
          role: parsed.role,
          id: 'dev_user',
          firstName: 'Development',
          lastName: 'User'
        };
      } else {
        localStorage.removeItem('dev_auth');
      }
    } catch (e) {
      localStorage.removeItem('dev_auth');
    }
  }

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !devUser, // Only query if no dev user
  });

  return {
    user: devUser || user,
    isLoading: devUser ? false : isLoading,
    isAuthenticated: !!(devUser || user),
  };
}
