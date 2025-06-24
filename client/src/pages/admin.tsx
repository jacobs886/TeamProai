import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AiPromptHeader from "@/components/layout/ai-prompt-header";
import IntelligentFormBuilder from "@/components/admin/intelligent-form-builder";
import PlayerRosterManager from "@/components/admin/player-roster-manager";
import { 
  Users, 
  Shield, 
  Settings, 
  UserCheck, 
  Crown,
  Building,
  Calendar,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  UserPlus
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

const roleColors = {
  super_admin: "bg-red-100 text-red-800",
  admin_operations: "bg-blue-100 text-blue-800", 
  team_admin: "bg-green-100 text-green-800",
  team_user: "bg-gray-100 text-gray-800",
  view_only: "bg-yellow-100 text-yellow-800"
};

const roleDescriptions = {
  super_admin: "Full system access and user management",
  admin_operations: "Operations management and facility oversight",
  team_admin: "Team management and player coordination", 
  team_user: "Standard user access to teams and events",
  view_only: "Read-only access to assigned content"
};

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("");
  const [setupEmail, setSetupEmail] = useState("");

  // Check if user has admin access
  const hasAdminAccess = user?.role === 'super_admin' || user?.role === 'admin_operations';
  const isSuperAdmin = user?.role === 'super_admin';

  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: hasAdminAccess,
    retry: (failureCount, error) => {
      if (isUnauthorizedError(error as Error)) return false;
      return failureCount < 3;
    }
  });

  const { data: systemStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: hasAdminAccess,
    retry: false
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ targetUserId, role }: { targetUserId: string; role: string }) => {
      await apiRequest("POST", "/api/admin/assign-role", { targetUserId, role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSelectedUser(null);
      setNewRole("");
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You don't have permission to assign roles",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  });

  const setupAdminMutation = useMutation({
    mutationFn: async (email: string) => {
      await apiRequest("POST", "/api/setup/super-admin", { email });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSetupEmail("");
      toast({
        title: "Success",
        description: "Super admin setup successful",
      });
    },
    onError: (error) => {
      toast({
        title: "Setup Failed", 
        description: (error as Error).message || "Failed to setup super admin",
        variant: "destructive",
      });
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
              <p className="text-sm text-gray-500 mb-4">
                You need administrator privileges to access this dashboard.
              </p>
              <Badge variant="outline" className={roleColors[user?.role as keyof typeof roleColors] || "bg-gray-100"}>
                Current Role: {user?.role || 'Unknown'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRoleAssignment = () => {
    if (!selectedUser || !newRole) return;
    assignRoleMutation.mutate({ targetUserId: selectedUser.id, role: newRole });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Crown className="h-8 w-8 text-primary mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">TeamPro.ai System Administration</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className={roleColors[user?.role as keyof typeof roleColors]}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role}
                </Badge>
                <span className="text-sm text-gray-600">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Overview</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      System Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usersLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    ) : allUsers && allUsers.length > 0 ? (
                      <div className="space-y-4">
                        {allUsers.map((userItem: any) => (
                          <div key={userItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium">{userItem.firstName} {userItem.lastName}</p>
                                <p className="text-sm text-gray-500">{userItem.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={roleColors[userItem.role as keyof typeof roleColors]}>
                                {userItem.role}
                              </Badge>
                              {isSuperAdmin && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedUser(userItem)}
                                >
                                  Manage
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No users found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Role Management Panel */}
              <div className="space-y-6">
                {/* Quick Setup */}
                {isSuperAdmin && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Setup Super Admin</label>
                        <div className="flex space-x-2 mt-1">
                          <Input
                            placeholder="Email address"
                            value={setupEmail}
                            onChange={(e) => setSetupEmail(e.target.value)}
                            className="text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => setupAdminMutation.mutate(setupEmail)}
                            disabled={!setupEmail || setupAdminMutation.isPending}
                          >
                            Setup
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Role Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Role Descriptions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(roleDescriptions).map(([role, description]) => (
                      <div key={role} className="space-y-1">
                        <Badge className={roleColors[role as keyof typeof roleColors]} variant="outline">
                          {role.replace('_', ' ')}
                        </Badge>
                        <p className="text-xs text-gray-600">{description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* System Overview Tab */}
          <TabsContent value="system" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold">{allUsers?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Teams</p>
                      <p className="text-2xl font-bold">{systemStats?.activeTeams || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Building className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Facilities</p>
                      <p className="text-2xl font-bold">{systemStats?.facilities || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Events</p>
                      <p className="text-2xl font-bold">{systemStats?.upcomingEvents || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Connection</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Authentication Service</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notification System</span>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-500">
                      No recent admin activities to display
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Permission Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Feature</th>
                        <th className="text-center py-2">Super Admin</th>
                        <th className="text-center py-2">Admin Ops</th>
                        <th className="text-center py-2">Team Admin</th>
                        <th className="text-center py-2">Team User</th>
                        <th className="text-center py-2">View Only</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {[
                        { feature: "User Management", perms: [true, false, false, false, false] },
                        { feature: "Facility Management", perms: [true, true, false, false, false] },
                        { feature: "Team Creation", perms: [true, true, true, false, false] },
                        { feature: "Event Scheduling", perms: [true, true, true, true, false] },
                        { feature: "View Statistics", perms: [true, true, true, true, true] },
                        { feature: "Team Chat", perms: [true, true, true, true, false] },
                        { feature: "Payment Management", perms: [true, true, true, false, false] },
                      ].map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2 font-medium">{row.feature}</td>
                          {row.perms.map((allowed, permIdx) => (
                            <td key={permIdx} className="text-center py-2">
                              {allowed ? (
                                <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Settings className="h-4 w-4" />
                    <AlertDescription>
                      System settings are managed through environment variables and database configuration.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Authentication is managed through Replit Auth. Session management is handled securely.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Role Assignment Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent aria-describedby="manage-role-description">
            <DialogHeader>
              <DialogTitle>Manage User Role</DialogTitle>
              <div id="manage-role-description" className="sr-only">
                Assign or modify user roles and permissions for team management access control.
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                <Badge className={roleColors[selectedUser.role as keyof typeof roleColors]} variant="outline">
                  Current: {selectedUser.role}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Assign New Role</label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin_operations">Admin Operations</SelectItem>
                    <SelectItem value="team_admin">Team Admin</SelectItem>
                    <SelectItem value="team_user">Team User</SelectItem>
                    <SelectItem value="view_only">View Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleRoleAssignment}
                  disabled={!newRole || assignRoleMutation.isPending}
                >
                  Update Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}