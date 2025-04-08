/** @jsxImportSource react */
"use client";

import React, { useState } from 'react';
import Sidebar from '../sidebarpage/Sidebar';
import ChatLayout from './chatlayout';

export default function MainLayout() {
  // Use environment variable without exposing the actual URL in code
  const defaultWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
  const [webhookUrl, setWebhookUrl] = useState(defaultWebhookUrl);
  
  // Add state for user's name
  const [userName, setUserName] = useState('Traveler');
  
  // Add state for resetting conversation
  const [resetConversation, setResetConversation] = useState(0);
  
  const handleResetConversation = () => {
    setResetConversation(prev => prev + 1);
  };

  return (
    <React.Fragment>
      <div className="flex w-full h-screen bg-gray-900">
        <Sidebar 
          webhookUrl={webhookUrl} 
          setWebhookUrl={setWebhookUrl}
          userName={userName}
          setUserName={setUserName}
          onResetConversation={handleResetConversation}
        />
        <div className="flex-1">
          <ChatLayout 
            webhookUrl={webhookUrl} 
            userName={userName}
            resetKey={resetConversation}
          />
        </div>
      </div>
    </React.Fragment>
  );
} 