
import React from 'react';
import { useNotes } from '../contexts/NotesContext';
import { useNavigate } from 'react-router-dom';
import EditorContent from '../components/Editor/EditorContent';
import { useEditorState } from '../components/Editor/EditorState';
import { useEditorHandlers } from '../components/Editor/EditorHandlers';

const Editor: React.FC = () => {
  const { currentNote, createNote, updateNote, setCurrentNote } = useNotes();
  const navigate = useNavigate();

  // Initialize editor state
  const editorState = useEditorState(currentNote);
  const editorHandlers = useEditorHandlers({
    currentNote,
    createNote,
    updateNote,
    setCurrentNote,
    navigate,
    ...editorState
  });

  return (
    <div className="h-full w-full">
      <EditorContent
        currentNote={currentNote}
        {...editorState}
        {...editorHandlers}
        isAssistantCollapsed={false}
      />
    </div>
  );
};

export default Editor;
