"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage } from '../../services/chatService';

interface ChatLayoutProps {
  webhookUrl: string;
  userName: string;
  resetKey: number;
}

export default function ChatLayout({ webhookUrl, userName, resetKey }: ChatLayoutProps) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{ text: string; sender: 'user' | 'assistant' }[]>([
    {
      text: `Welcome ${userName}! How can I help you?`,
      sender: 'assistant'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWebhookUpdated, setIsWebhookUpdated] = useState(false);
  const prevWebhookUrl = React.useRef(webhookUrl);
  const conversationStarted = React.useRef(false);
  
  // Update conversation started flag
  useEffect(() => {
    if (conversation.length > 1) {
      conversationStarted.current = true;
    }
  }, [conversation.length]);
  
  // Track webhook URL changes
  useEffect(() => {
    // Skip if URL hasn't changed
    if (webhookUrl === prevWebhookUrl.current) {
      return;
    }
    
    // Update the ref with the new URL
    prevWebhookUrl.current = webhookUrl;
    
    // Show notification only if conversation has started
    if (conversationStarted.current && webhookUrl && webhookUrl.trim() !== '') {
      setIsWebhookUpdated(true);
      
      // Clear the notification after 3 seconds
      const timer = setTimeout(() => {
        setIsWebhookUpdated(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [webhookUrl]);

  // Update welcome message when userName changes
  useEffect(() => {
    if (conversation.length === 1 && conversation[0].sender === 'assistant') {
      setConversation([
        {
          text: `Welcome! How can I help you?`,
          sender: 'assistant'
        }
      ]);
    }
  }, [userName]);

  // Reset conversation when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      setConversation([
        {
          text: `Welcome! How can I help you?`,
          sender: 'assistant'
        }
      ]);
      setIsTyping(false);
      setIsError(false);
    }
  }, [resetKey, conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if webhook URL is missing
    if (!webhookUrl) {
      setConversation(prev => [
        ...prev, 
        { text: message, sender: 'user' as const },
        { 
          text: 'Error: Webhook URL is not configured. Please set the NEXT_PUBLIC_N8N_WEBHOOK_URL in your .env file or enter a URL manually in the sidebar.',
          sender: 'assistant' as const 
        }
      ]);
      setMessage('');
      return;
    }
    
    if (message.trim()) {
      // Add user message
      const userMessage = { text: message, sender: 'user' as const };
      setConversation(prev => [...prev, userMessage]);
      const userQuery = message;
      setMessage('');
      setIsError(false);
      
      // Show typing indicator
      setIsTyping(true);
      
      try {
        // Send message to the n8n webhook
        const response = await sendMessage(userQuery, webhookUrl);
        
        // Add assistant response
        setIsTyping(false);
        const assistantMessage = { 
          text: response, 
          sender: 'assistant' as const 
        };
        setConversation(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Error fetching response:', error);
        setIsTyping(false);
        setIsError(true);
        
        // Add error message
        const errorMessage = { 
          text: 'Sorry, there was an error processing your request. Please check your webhook URL configuration.',
          sender: 'assistant' as const 
        };
        setConversation(prev => [...prev, errorMessage]);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 w-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <motion.span 
            style={{ color: '#60a5fa', fontSize: '1.5rem', marginRight: '0.75rem' }}
            animate={{ rotate: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.span>
          <h1 className="text-2xl font-bold text-white">Agents</h1>
<<<<<<< HEAD
        </div>
      </motion.header>
=======
        </motion.div>
      </div>
>>>>>>> c10c0025080ed35600f0c59271e3b9f33476a123

      <div className="flex-grow overflow-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 relative z-0">
        {/* Webhook update notification */}
        <AnimatePresence>
          {isWebhookUpdated && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                backgroundColor: '#059669',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                zIndex: 10
              }}
            >
              Webhook URL updated successfully!
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2rem' }}
        >
          <p className="text-gray-400 italic text-center font-medium">
            Ask me about anything!
          </p>
        </motion.div>
        
        <AnimatePresence>
          {conversation.map((msg, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div 
                className={`p-3 rounded-lg max-w-3xl shadow-md ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : isError && index === conversation.length - 1
                    ? 'bg-red-700 text-white rounded-tl-none'
                    : 'bg-gray-800 text-white rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '1rem'
              }}
            >
              <div className="bg-gray-800 text-white p-3 rounded-lg rounded-tl-none flex space-x-1 shadow-md">
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", times: [0, 0.5, 1] }}
                >•</motion.span>
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", times: [0, 0.5, 1], delay: 0.1 }}
                >•</motion.span>
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "loop", times: [0, 0.5, 1], delay: 0.2 }}
                >•</motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          borderTop: '1px solid #374151',
          padding: '1rem',
          backgroundColor: '#1f2937'
        }}
      >
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Ask about anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow bg-gray-700 rounded-l-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            disabled={isTyping}
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              type="submit"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                if (isTyping) {
                  e.preventDefault();
                }
              }}
              style={{
                padding: '0.75rem',
                borderTopRightRadius: '0.375rem',
                borderBottomRightRadius: '0.375rem',
                color: 'white',
                backgroundColor: isTyping ? '#4b5563' : '#2563eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                cursor: isTyping ? 'not-allowed' : 'pointer',
                opacity: isTyping ? 0.7 : 1,
                border: 'none',
                outline: 'none'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
} 