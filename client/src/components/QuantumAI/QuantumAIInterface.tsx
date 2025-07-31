import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const QuantumAIInterface: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const handleSendPrompt = async () => {
    try {
      const res = await fetch('/api/quantum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.error) {
        setResponse(`Error: ${data.error}`);
      } else {
        setResponse(data.message);
      }
    } catch (error) {
      setResponse(`Error: ${error}`);
    }
  };

  return (
    <div className="flex flex-col p-4">
      <Label htmlFor="prompt">Enter Prompt:</Label>
      <Input
        type="text"
        id="prompt"
        value={prompt}
        onChange={handlePromptChange}
        className="mb-4"
      />
      <Button onClick={handleSendPrompt} className="mb-4">Send Prompt</Button>
      {response && (
        <div className="rounded-md bg-secondary p-4">
          <Label htmlFor="response">Response:</Label>
          <p id="response">{response}</p>
        </div>
      )}
    </div>
  );
};

export default QuantumAIInterface;
