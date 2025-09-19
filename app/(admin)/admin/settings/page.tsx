"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SettingsIcon, Bell, Shield, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure system-wide settings for the SWP392 course management
          platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how and when notifications are sent to teachers and
              students.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email alerts for important updates
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send SMS for urgent notifications
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Browser push notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage security and access control settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="60" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for admin access
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>IP Whitelist</Label>
                <p className="text-sm text-muted-foreground">
                  Restrict access by IP address
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Configuration
            </CardTitle>
            <CardDescription>
              Configure system-wide parameters and limits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-groups">Maximum Groups per Course</Label>
              <Input id="max-groups" type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-size">Students per Group</Label>
              <Input id="group-size" defaultValue="4-5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester-duration">
                Semester Duration (weeks)
              </Label>
              <Input id="semester-duration" type="number" defaultValue="15" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              AI Chatbot Configuration
            </CardTitle>
            <CardDescription>
              Configure the AI chatbot behavior and responses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Response</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic responses to common questions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Learning Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Allow chatbot to learn from interactions
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="response-delay">Response Delay (seconds)</Label>
              <Input id="response-delay" type="number" defaultValue="2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
