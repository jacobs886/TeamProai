import { useAuth } from "@/hooks/useAuth";

export default function AuthDebug() {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  const devAuth = localStorage.getItem('dev_auth');
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-3 rounded-lg text-xs font-mono max-w-xs">
      <div className="font-bold mb-2">Auth Debug</div>
      <div>Loading: {isLoading ? 'true' : 'false'}</div>
      <div>Authenticated: {isAuthenticated ? 'true' : 'false'}</div>
      <div>Dev Session: {devAuth ? 'active' : 'none'}</div>
      <div>User: {user ? user.email || 'unknown' : 'null'}</div>
      <div>Role: {user?.role || 'none'}</div>
    </div>
  );
}