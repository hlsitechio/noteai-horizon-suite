import React, { useState } from 'react';
import { useKanbanBoards } from '@/hooks/useKanbanBoards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, User } from 'lucide-react';
import { CreateBoardDialog } from './CreateBoardDialog';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function KanbanBoardList() {
  const navigate = useNavigate();
  const { boards, isLoading, createBoard } = useKanbanBoards();
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kanban Boards</h1>
        <Button onClick={() => setShowCreateBoard(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Board
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No boards yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first Kanban board to start organizing your tasks
            </p>
            <Button onClick={() => setShowCreateBoard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Board
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Card 
              key={board.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/app/kanban/${board.id}`)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{board.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {board.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {board.description}
                  </p>
                )}
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Updated {format(new Date(board.updated_at), 'MMM d, yyyy')}</span>
                  </div>
                  
                  {board.project_id && (
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>Project Board</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateBoardDialog
        open={showCreateBoard}
        onOpenChange={setShowCreateBoard}
        onSubmit={async (data) => {
          const success = await createBoard(data);
          if (success) {
            setShowCreateBoard(false);
          }
        }}
      />
    </div>
  );
}