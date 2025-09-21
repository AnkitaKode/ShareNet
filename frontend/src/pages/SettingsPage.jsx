import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// --- Default settings structure ---
const defaultSettings = {
  theme: 'system',
  emailNotifications: {
    newRequests: false,
    requestUpdates: false,
  },
};

// --- Main Settings Page Component ---
export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users/me/settings');
        if (!response.ok) throw new Error('Could not fetch settings.');
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/me/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error('Failed to save settings.');
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Assuming Sidebar and Header are part of your main layout */}
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500">Manage your account and application preferences.</p>
          </div>

          {/* --- APPEARANCE CARD --- */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={settings.theme}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}
                >
                  <SelectTrigger id="theme" className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Select the theme for the application dashboard.</p>
              </div>
            </CardContent>
          </Card>

          {/* --- NOTIFICATIONS CARD --- */}
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose which emails you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newRequests">New Borrow Requests</Label>
                  <p className="text-sm text-gray-500">Receive an email when someone requests to borrow one of your items.</p>
                </div>
                <Switch
                  id="newRequests"
                  checked={settings.emailNotifications.newRequests}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      emailNotifications: { ...prev.emailNotifications, newRequests: checked }
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requestUpdates">Transaction Updates</Label>
                  <p className="text-sm text-gray-500">Get notified when a borrow request is approved or declined.</p>
                </div>
                <Switch
                  id="requestUpdates"
                  checked={settings.emailNotifications.requestUpdates}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({
                      ...prev,
                      emailNotifications: { ...prev.emailNotifications, requestUpdates: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* --- SAVE CHANGES BUTTON --- */}
          <div className="flex justify-end">
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
