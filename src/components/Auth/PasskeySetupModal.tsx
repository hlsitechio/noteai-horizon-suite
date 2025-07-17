import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Smartphone, Fingerprint, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { createPasskey, isPasskeySupported } from '@/services/webauthn/client';
import { Card } from '@/components/ui/card';

interface PasskeySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
}

export const PasskeySetupModal: React.FC<PasskeySetupModalProps> = ({
  isOpen,
  onClose,
  onSkip,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleCreatePasskey = async () => {
    if (!isPasskeySupported()) {
      toast.error('Passkeys are not supported in this browser');
      return;
    }

    try {
      setIsCreating(true);
      await createPasskey();
      setIsComplete(true);
      toast.success('Passkey created successfully! Your account is now more secure.');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          // User cancelled the passkey creation
          return;
        }
        toast.error(error.message || 'Failed to create passkey');
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleComplete = () => {
    setIsComplete(false);
    onClose();
  };

  if (isComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Passkey Created!
            </DialogTitle>
            <DialogDescription>
              Your account is now protected with passkey authentication. You can use biometric authentication for faster, more secure login.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-success" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="font-medium">Enhanced Security Active</h3>
              <p className="text-sm text-muted-foreground">
                Next time you log in, you can use your passkey instead of a password.
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button onClick={handleComplete} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Enhance Your Security
          </DialogTitle>
          <DialogDescription>
            Set up a passkey for faster, more secure authentication using your device's biometrics or security key.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <Card className="p-4 space-y-2">
              <Fingerprint className="h-8 w-8 mx-auto text-primary" />
              <p className="text-xs font-medium">Biometric</p>
              <p className="text-xs text-muted-foreground">Face ID, Touch ID</p>
            </Card>
            
            <Card className="p-4 space-y-2">
              <Smartphone className="h-8 w-8 mx-auto text-primary" />
              <p className="text-xs font-medium">Device</p>
              <p className="text-xs text-muted-foreground">Phone, Tablet</p>
            </Card>
            
            <Card className="p-4 space-y-2">
              <Shield className="h-8 w-8 mx-auto text-primary" />
              <p className="text-xs font-medium">Security Key</p>
              <p className="text-xs text-muted-foreground">YubiKey, etc.</p>
            </Card>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Benefits:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Faster login with biometrics</li>
              <li>• No more password to remember</li>
              <li>• Enhanced account security</li>
              <li>• Phishing protection</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onSkip}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Skip for Now
          </Button>
          <Button
            onClick={handleCreatePasskey}
            disabled={isCreating || !isPasskeySupported()}
            className="flex-1"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Create Passkey
              </>
            )}
          </Button>
        </div>

        {!isPasskeySupported() && (
          <p className="text-xs text-destructive text-center">
            Passkeys are not supported in this browser. Please use a modern browser that supports WebAuthn.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};