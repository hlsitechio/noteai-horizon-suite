import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowRight, User } from 'lucide-react';

interface UserInfoStepProps {
  onComplete: (userInfo: { name: string; nickname: string; bio?: string }) => void;
  className?: string;
}

export const UserInfoStep: React.FC<UserInfoStepProps> = ({ onComplete, className }) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && nickname.trim()) {
      onComplete({ name: name.trim(), nickname: nickname.trim(), bio: bio.trim() || undefined });
    }
  };

  const isValid = name.trim().length > 0 && nickname.trim().length > 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md mx-auto border-2 border-primary/10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Tell Us About You
          </CardTitle>
          <CardDescription className="text-base">
            Let's personalize your Online Note AI experience with some basic information.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="h-11 border-2 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-sm font-medium">
                Preferred Name *
              </Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="What should we call you?"
                className="h-11 border-2 focus:border-primary"
                required
              />
              <p className="text-xs text-muted-foreground">
                This is how we'll address you in the app
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="bio"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself"
                className="h-11 border-2 focus:border-primary"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium"
              disabled={!isValid}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};