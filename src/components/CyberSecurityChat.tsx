'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function CyberSecurityChat({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, badges, scanHistory } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello ${user?.displayName || 'Cyber Warrior'}! 🔥 I'm your AI cybersecurity companion. I can help you with:\n\n• Cybersecurity questions and advice\n• Analyzing your app progress and challenges\n• Explaining security concepts\n• Providing personalized tips based on your data\n\nWhat would you like to know about cybersecurity?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user?.displayName]);

  const generateContext = () => {
    const userData = {
      name: user?.displayName || 'User',
      level: user?.level || 1,
      xp: user?.xp || 0,
      streak: user?.streak || 0,
      badges: badges.filter(b => b.unlocked).map(b => b.name),
      totalBadges: badges.length,
      unlockedBadges: badges.filter(b => b.unlocked).length,
      recentScans: scanHistory.slice(-5).map(scan => ({
        url: scan.url,
        result: scan.results,
        timestamp: scan.timestamp
      }))
    };

    return `You are a cybersecurity AI assistant for the CyberQR app. Here's the user's current data:

User Profile:
- Name: ${userData.name}
- Level: ${userData.level}
- XP: ${userData.xp}
- Current Streak: ${userData.streak} days
- Unlocked Badges: ${userData.unlockedBadges}/${userData.totalBadges}
- Badge Names: ${userData.badges.join(', ')}

Recent Activity:
- Recent QR Scans: ${userData.recentScans.length} scans
- Latest scan results: ${userData.recentScans.map(s => `${s.result}: ${s.url}`).join(', ')}

Provide personalized cybersecurity advice based on this data. Be encouraging about their progress and suggest relevant security practices. Keep responses concise but informative.`;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          context: generateContext(),
          userData: {
            name: user?.displayName,
            level: user?.level,
            xp: user?.xp,
            streak: user?.streak,
            badges: badges.filter(b => b.unlocked).map(b => b.name)
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '500px',
      height: '70%',
      maxHeight: '600px',
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
      zIndex: 10001,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot className="w-4 h-4" style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ 
              fontSize: '16px', 
              margin: 0, 
              color: 'white',
              fontWeight: '600'
            }}>
              Shieldo
            </h3>
            <p style={{ 
              fontSize: '12px', 
              margin: 0, 
              color: 'rgba(255,255,255,0.8)'
            }}>
              Your Cute Streak pet and Cyber Security AI Advisor            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          style={{
            padding: '8px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.3)'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {message.role === 'assistant' && (
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bot className="w-4 h-4" style={{ color: 'white' }} />
              </div>
            )}
            
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '16px',
              background: message.role === 'user' 
                ? 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)'
                : 'rgba(30, 41, 59, 0.8)',
              backdropFilter: message.role === 'assistant' ? 'blur(10px)' : 'none',
              border: message.role === 'assistant' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              color: message.role === 'user' ? 'white' : 'rgba(255,255,255,0.9)',
              fontSize: '14px',
              lineHeight: '1.4',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {message.content}
            </div>
            
            {message.role === 'user' && (
              <div style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User className="w-4 h-4" style={{ color: 'white' }} />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bot className="w-4 h-4" style={{ color: 'white' }} />
            </div>
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px',
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px'
            }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: 'var(--accent-2)',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite both'
                }} />
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: 'var(--accent-2)',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite both',
                  animationDelay: '0.2s'
                }} />
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: 'var(--accent-2)',
                  borderRadius: '50%',
                  animation: 'bounce 1.4s ease-in-out infinite both',
                  animationDelay: '0.4s'
                }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about cybersecurity..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px',
            color: 'var(--text)',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          style={{
            padding: '12px',
            background: 'linear-gradient(135deg, var(--accent-2) 0%, var(--accent) 100%)',
            border: 'none',
            borderRadius: '50%',
            color: 'white',
            cursor: !inputMessage.trim() || isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !inputMessage.trim() || isLoading ? 0.5 : 1,
            transition: 'opacity 0.2s ease'
          }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
