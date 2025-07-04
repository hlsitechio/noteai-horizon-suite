import React, { useState } from 'react';
import { Bell, Clock, AlarmClock, X, Plus, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useReminderManager } from '@/hooks/useReminderManager';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import ReminderDialog from '../Editor/ReminderDialog';

interface ReminderManagementProps {
  notes: any[];
  onEditNote: (note: any) => void;
}

const ReminderManagement: React.FC<ReminderManagementProps> = ({ 
  notes,
  onEditNote 
}) => {
  const { 
    pendingReminders, 
    isChecking, 
    snoozeReminder, 
    dismissReminder 
  } = useReminderManager();
  
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const handleSnooze = async (reminderId: string, minutes: number = 15) => {
    await snoozeReminder(reminderId, minutes);
    toast.success(`Reminder snoozed for ${minutes} minutes`);
  };

  const handleDismiss = async (reminderId: string) => {
    await dismissReminder(reminderId);
    toast.success('Reminder dismissed');
  };

  const handleCreateReminder = () => {
    if (notes.length === 0) {
      toast.error('Create a note first to set reminders');
      return;
    }
    setSelectedNote(notes[0]); // Default to first note
    setIsReminderDialogOpen(true);
  };

  const handleReminderClick = (reminder: any) => {
    const note = notes.find(n => n.id === reminder.note_id);
    if (note) {
      onEditNote(note);
    }
  };

  // Calculate stats
  const totalReminders = pendingReminders.length;
  const overdueReminders = pendingReminders.filter(r => 
    new Date(r.reminder_date) < new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  return (
    <>
      <Card className="w-full h-full border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl flex flex-col min-h-0">
        <CardHeader className="p-4 pb-3 border-b border-border/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/10">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-foreground">
                  Reminders
                </CardTitle>
                {totalReminders > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {totalReminders} pending
                    {overdueReminders > 0 && ` • ${overdueReminders} overdue`}
                  </p>
                )}
              </div>
            </div>
            {isChecking && (
              <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 flex-1 flex flex-col min-h-0 space-y-4 overflow-y-auto">
          {/* Quick Create Reminder */}
          <Button 
            onClick={handleCreateReminder}
            className="flex items-center gap-3 justify-start bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-premium hover:shadow-large transition-all duration-300 hover:-translate-y-1 hover:scale-105 w-full rounded-xl h-12 text-sm px-4 font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Reminder</span>
          </Button>

          {/* Pending Reminders */}
          {pendingReminders.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold text-foreground">Pending</h4>
              </div>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {pendingReminders.map((reminder) => {
                  const isOverdue = new Date(reminder.reminder_date) < new Date();
                  
                  return (
                    <div
                      key={reminder.reminder_id}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        isOverdue 
                          ? 'bg-destructive/5 border-destructive/20 hover:bg-destructive/10' 
                          : 'bg-card/50 border-border/20 hover:bg-card/80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => handleReminderClick(reminder)}
                            className="text-left w-full"
                          >
                            <h5 className="text-sm font-medium text-foreground truncate hover:text-primary transition-colors">
                              {reminder.note_title}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span className={`text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                                {formatDistanceToNow(new Date(reminder.reminder_date), { addSuffix: true })}
                              </span>
                              {isOverdue && (
                                <Badge variant="destructive" className="text-xs px-2 py-0">
                                  Overdue
                                </Badge>
                              )}
                            </div>
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSnooze(reminder.reminder_id, 15)}
                            className="h-8 w-8 p-0 hover:bg-accent/10 hover:text-accent"
                          >
                            <AlarmClock className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismiss(reminder.reminder_id)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1">
                All caught up!
              </h4>
              <p className="text-xs text-muted-foreground">
                No pending reminders right now
              </p>
            </div>
          )}

          {/* Statistics */}
          {notes.length > 0 && (
            <div className="mt-auto pt-4 border-t border-border/10">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 rounded-lg bg-muted/20">
                  <div className="text-lg font-bold text-foreground">
                    {notes.filter(n => n.reminder_enabled).length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    With Reminders
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-muted/20">
                  <div className="text-lg font-bold text-foreground">
                    {totalReminders}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Active
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Dialog */}
      {selectedNote && (
        <ReminderDialog
          isOpen={isReminderDialogOpen}
          onClose={() => {
            setIsReminderDialogOpen(false);
            setSelectedNote(null);
          }}
          noteId={selectedNote.id}
          noteTitle={selectedNote.title}
        />
      )}
    </>
  );
};

export default ReminderManagement;