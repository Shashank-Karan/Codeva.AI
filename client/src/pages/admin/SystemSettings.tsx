import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AppNavigation from "@/components/AppNavigation";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  Mail, 
  Shield, 
  Palette,
  Globe,
  Bell,
  Code,
  Upload
} from "lucide-react";

interface SystemSetting {
  id: number;
  key: string;
  value: string;
  type: string;
  description: string;
}

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<SystemSetting[]>({
    queryKey: ["/api/admin/settings"],
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await apiRequest("PUT", "/api/admin/settings", { key, value });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Settings updated",
        description: "System settings have been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    }
  });

  const getSetting = (key: string) => {
    return settings?.find(s => s.key === key)?.value || "";
  };

  const handleSettingChange = (key: string, value: string) => {
    updateSettingMutation.mutate({ key, value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <AppNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-10 h-10 text-blue-400" />
            System Settings
          </h1>
          <p className="text-gray-300">Configure application settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/40 border-slate-700/50">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Backup
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="app-name" className="text-white">Application Name</Label>
                    <Input
                      id="app-name"
                      value={getSetting("app_name") || "Codeva.AI"}
                      onChange={(e) => handleSettingChange("app_name", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="app-url" className="text-white">Application URL</Label>
                    <Input
                      id="app-url"
                      value={getSetting("app_url") || "https://codeva.ai"}
                      onChange={(e) => handleSettingChange("app_url", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="app-description" className="text-white">Application Description</Label>
                  <Textarea
                    id="app-description"
                    value={getSetting("app_description") || "AI-powered code development and analysis platform"}
                    onChange={(e) => handleSettingChange("app_description", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contact-email" className="text-white">Contact Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={getSetting("contact_email") || "admin@codeva.ai"}
                      onChange={(e) => handleSettingChange("contact_email", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="support-email" className="text-white">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={getSetting("support_email") || "support@codeva.ai"}
                      onChange={(e) => handleSettingChange("support_email", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">User Registration</h4>
                    <p className="text-gray-400 text-sm">Allow new users to register accounts</p>
                  </div>
                  <Switch
                    checked={getSetting("allow_registration") === "true"}
                    onCheckedChange={(checked) => handleSettingChange("allow_registration", checked.toString())}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Email Verification</h4>
                    <p className="text-gray-400 text-sm">Require email verification for new accounts</p>
                  </div>
                  <Switch
                    checked={getSetting("require_email_verification") === "true"}
                    onCheckedChange={(checked) => handleSettingChange("require_email_verification", checked.toString())}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="session-timeout" className="text-white">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={getSetting("session_timeout") || "60"}
                      onChange={(e) => handleSettingChange("session_timeout", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-login-attempts" className="text-white">Max Login Attempts</Label>
                    <Input
                      id="max-login-attempts"
                      type="number"
                      value={getSetting("max_login_attempts") || "5"}
                      onChange={(e) => handleSettingChange("max_login_attempts", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password-policy" className="text-white">Password Policy</Label>
                  <Select
                    value={getSetting("password_policy") || "medium"}
                    onValueChange={(value) => handleSettingChange("password_policy", value)}
                  >
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (6+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, numbers)</SelectItem>
                      <SelectItem value="high">High (12+ chars, mixed case, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                    <p className="text-gray-400 text-sm">Enable 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={getSetting("enable_2fa") === "true"}
                    onCheckedChange={(checked) => handleSettingChange("enable_2fa", checked.toString())}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">IP Restrictions</h4>
                    <p className="text-gray-400 text-sm">Restrict admin access to specific IP addresses</p>
                  </div>
                  <Switch
                    checked={getSetting("enable_ip_restrictions") === "true"}
                    onCheckedChange={(checked) => handleSettingChange("enable_ip_restrictions", checked.toString())}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="smtp-host" className="text-white">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      value={getSetting("smtp_host") || "smtp.gmail.com"}
                      onChange={(e) => handleSettingChange("smtp_host", e.target.value)}
                      placeholder="smtp.gmail.com"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp-port" className="text-white">SMTP Port</Label>
                    <Input
                      id="smtp-port"
                      type="number"
                      value={getSetting("smtp_port") || "587"}
                      onChange={(e) => handleSettingChange("smtp_port", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="smtp-username" className="text-white">SMTP Username</Label>
                    <Input
                      id="smtp-username"
                      value={getSetting("smtp_username") || ""}
                      onChange={(e) => handleSettingChange("smtp_username", e.target.value)}
                      placeholder="your-email@gmail.com"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp-password" className="text-white">SMTP Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      value={getSetting("smtp_password") || ""}
                      onChange={(e) => handleSettingChange("smtp_password", e.target.value)}
                      placeholder="App password"
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="from-email" className="text-white">From Email Address</Label>
                  <Input
                    id="from-email"
                    type="email"
                    value={getSetting("from_email") || "noreply@codeva.ai"}
                    onChange={(e) => handleSettingChange("from_email", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="from-name" className="text-white">From Name</Label>
                  <Input
                    id="from-name"
                    value={getSetting("from_name") || "Codeva.AI"}
                    onChange={(e) => handleSettingChange("from_name", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Enable SSL/TLS</h4>
                    <p className="text-gray-400 text-sm">Use secure connection for email sending</p>
                  </div>
                  <Switch
                    checked={getSetting("smtp_ssl") === "true"}
                    onCheckedChange={(checked) => handleSettingChange("smtp_ssl", checked.toString())}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Email Notifications</h4>
                    <p className="text-gray-400 text-sm">Send email notifications for important events</p>
                  </div>
                  <Switch
                    checked={getSetting("email_notifications") === "true"}
                    onCheckedChange={(checked) => handleSettingChange("email_notifications", checked.toString())}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      // Test email functionality
                      toast({
                        title: "Test Email",
                        description: "Test email functionality would be implemented here",
                      });
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Test Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api" className="space-y-6">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="gemini-api-key" className="text-white">Gemini API Key</Label>
                  <Input
                    id="gemini-api-key"
                    type="password"
                    value={getSetting("gemini_api_key") || ""}
                    onChange={(e) => handleSettingChange("gemini_api_key", e.target.value)}
                    placeholder="Enter your Gemini API key"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="api-rate-limit" className="text-white">API Rate Limit (requests/hour)</Label>
                    <Input
                      id="api-rate-limit"
                      type="number"
                      value={getSetting("api_rate_limit") || "1000"}
                      onChange={(e) => handleSettingChange("api_rate_limit", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-timeout" className="text-white">API Timeout (seconds)</Label>
                    <Input
                      id="api-timeout"
                      type="number"
                      value={getSetting("api_timeout") || "30"}
                      onChange={(e) => handleSettingChange("api_timeout", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">API Logging</h4>
                    <p className="text-gray-400 text-sm">Log all API requests and responses</p>
                  </div>
                  <Switch
                    checked={getSetting("enable_api_logging") === "true"}
                    onCheckedChange={(checked) => handleSettingChange("enable_api_logging", checked.toString())}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Settings */}
          <TabsContent value="backup" className="space-y-6">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-400" />
                  Backup & Restore
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="backup-frequency" className="text-white">Backup Frequency</Label>
                    <Select
                      value={getSetting("backup_frequency") || "daily"}
                      onValueChange={(value) => handleSettingChange("backup_frequency", value)}
                    >
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="backup-retention" className="text-white">Retention Period (days)</Label>
                    <Input
                      id="backup-retention"
                      type="number"
                      value={getSetting("backup_retention") || "30"}
                      onChange={(e) => handleSettingChange("backup_retention", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Automatic Backups</h4>
                    <p className="text-gray-400 text-sm">Enable automatic database backups</p>
                  </div>
                  <Switch
                    checked={getSetting("enable_auto_backup") === "true"}
                    onCheckedChange={(checked) => handleSettingChange("enable_auto_backup", checked.toString())}
                  />
                </div>

                <div className="flex gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Database className="w-4 h-4 mr-2" />
                    Create Backup Now
                  </Button>
                  <Button variant="outline" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600">
                    <Upload className="w-4 h-4 mr-2" />
                    Restore from Backup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}