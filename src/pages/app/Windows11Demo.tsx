import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, Smartphone, Tablet } from 'lucide-react';

const Windows11Demo: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/app/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Windows 11 Sidebar Demo</h1>
          <p className="text-muted-foreground">Experience different taskbar layouts inspired by Windows 11</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-blue-500" />
              <CardTitle>Top Taskbar</CardTitle>
            </div>
            <CardDescription>
              Icons positioned at the top of the screen, below the clock area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Features:</div>
                <ul className="text-sm space-y-1">
                  <li>• Compact icon-only layout</li>
                  <li>• Fixed at top of screen</li>
                  <li>• Minimal space usage</li>
                  <li>• Quick access to all apps</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Perfect for users who want quick access without taking up main screen real estate.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-500" />
              <CardTitle>Bottom Taskbar</CardTitle>
            </div>
            <CardDescription>
              Classic Windows 11 style taskbar at the bottom of the screen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Features:</div>
                <ul className="text-sm space-y-1">
                  <li>• Traditional Windows layout</li>
                  <li>• Icon indicators for active apps</li>
                  <li>• Familiar user experience</li>
                  <li>• Start button included</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                The most familiar layout for Windows users, providing a comfortable navigation experience.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tablet className="w-5 h-5 text-purple-500" />
              <CardTitle>Right Sidebar</CardTitle>
            </div>
            <CardDescription>
              Vertical taskbar positioned on the right side of the screen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Features:</div>
                <ul className="text-sm space-y-1">
                  <li>• Vertical icon layout</li>
                  <li>• Full sidebar alternative</li>
                  <li>• Maximizes horizontal space</li>
                  <li>• Clean, modern design</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                Great for widescreen displays, keeping the main content area unobstructed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-6 bg-card border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Use</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Current Layout Controls:</h3>
            <p className="text-sm text-muted-foreground">
              Use the floating controls in the top-right corner to switch between different taskbar positions in real-time.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Integration:</h3>
            <p className="text-sm text-muted-foreground">
              This demo shows how your existing navigation can be transformed into a Windows 11 style interface while maintaining all functionality.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Navigate around to see how the taskbar works with different pages and maintains state across your application.
        </p>
      </div>
    </div>
  );
};

export default Windows11Demo;