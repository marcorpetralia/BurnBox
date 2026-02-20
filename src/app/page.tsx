'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    // Add empty assistant message that will be populated by streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen3:latest',
          messages: newMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (!reader) {
        throw new Error('Response body is null');
      }

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;
          
          try {
            const jsonChunk = JSON.parse(line);
            const content = jsonChunk.message?.content || '';
            
            if (content) {
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'assistant') {
                  lastMessage.content += content;
                }
                return newMessages;
              });
            }

            if (jsonChunk.done) {
              break;
            }
          } catch (parseError) {
            console.error('Error parsing JSON chunk:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'assistant' && lastMessage.content === '') {
          lastMessage.content = 'Sorry, there was an error connecting to the AI service. Please try again.';
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBurn = () => {
    if (confirm('Are you sure you want to burn this session? All messages will be permanently deleted.')) {
      setIsBurning(true);
      setBurnProgress(0);
      
      // Simulate environment destruction with progress bar
      const duration = 2500; // 2.5 seconds
      const steps = 50;
      const increment = 100 / steps;
      const interval = duration / steps;
      
      let currentStep = 0;
      const progressInterval = setInterval(() => {
        currentStep++;
        setBurnProgress((currentStep / steps) * 100);
        
        if (currentStep >= steps) {
          clearInterval(progressInterval);
          // Clear messages and reset
          setTimeout(() => {
            setMessages([]);
            setInput('');
            setIsBurning(false);
            setBurnProgress(0);
          }, 300);
        }
      }, interval);
    }
  };

  return (
    <main className="main">
      {isBurning && (
        <div className="burn-overlay">
          <div className="burn-modal">
            <div className="burn-icon">🔥</div>
            <h2 className="burn-title">Destroying Environment...</h2>
            <p className="burn-description">All data is being securely erased</p>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${burnProgress}%` }}
              />
            </div>
            <p className="burn-percentage">{Math.round(burnProgress)}%</p>
          </div>
        </div>
      )}
      
      <div className="header">
        <h1 className="title">
          <span className="highlight">BurnBox.ai</span> - Demo
        </h1>
        <button className="burn-button" onClick={handleBurn}>
          🔥 Burn Session
        </button>
      </div>

      <div className="info-section">
        <p className="info-text">
          BurnBox is a system that creates private environments for users to interact with chat AIs 
          that are then destroyed at the end of a session or whenever the user presses the Burn button. 
          This allows users to use sensitive data within an AI with no worries about data being 
          collected, lost, or stolen.
        </p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>Start a secure, private conversation. Your data will be destroyed when you burn the session.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-content">
                  <strong>{message.role === 'user' ? 'You' : 'AI'}:</strong> {message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <strong>AI:</strong> <span className="loading">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message... (this data is secure and ephemeral)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
