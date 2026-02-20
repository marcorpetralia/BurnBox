'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'This is a demo response. In the full version, your data is processed in a secure, isolated environment that can be destroyed at any time.' 
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleBurn = () => {
    if (confirm('Are you sure you want to burn this session? All messages will be permanently deleted.')) {
      setMessages([]);
      setInput('');
    }
  };

  return (
    <main className="main">
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
