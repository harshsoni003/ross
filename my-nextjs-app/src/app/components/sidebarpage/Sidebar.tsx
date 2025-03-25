"use client";

import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';

interface SidebarProps {
  webhookUrl: string;
  setWebhookUrl: Dispatch<SetStateAction<string>>;
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  onResetConversation: () => void;
}

export default function Sidebar({ webhookUrl, setWebhookUrl, userName, setUserName, onResetConversation }: SidebarProps) {
  const [urlStatus, setUrlStatus] = useState<'env' | 'custom' | 'missing'>(
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ? 'env' : 
    webhookUrl ? 'custom' : 'missing'
  );
  
  // Update URL status when webhook URL changes
  useEffect(() => {
    if (!webhookUrl) {
      setUrlStatus('missing');
    } else if (webhookUrl === process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
      setUrlStatus('env');
    } else {
      setUrlStatus('custom');
    }
  }, [webhookUrl]);

  // Validate webhook URL
  const validateAndUpdateUrl = (url: string) => {
    setWebhookUrl(url.trim());
    // Update status immediately after setting the URL
    if (!url.trim()) {
      setUrlStatus('missing');
    } else if (url.trim() === process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL) {
      setUrlStatus('env');
    } else {
      setUrlStatus('custom');
    }
  };

  // Check if the webhook URL is secure (starts with https:)
  const isSecureUrl = webhookUrl && webhookUrl.toLowerCase().startsWith('https:');

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700 h-screen flex flex-col">
      <div className="p-6 overflow-y-auto flex-grow">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          API Settings
        </h2>
        
        {/* User Information Section */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-blue-400 mb-3 uppercase tracking-wider">Agent Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Agent Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Webhook Section */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-400 uppercase tracking-wider flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              API CONFIGURATION
            </h3>
            {isSecureUrl && (
              <div className="bg-green-700 text-white text-xs px-2 py-1 rounded flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
                CONNECTED
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-gray-300">Webhook Endpoint</label>
                <span className="text-xs text-blue-400 font-medium">n8n API</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => validateAndUpdateUrl(e.target.value)}
                  onBlur={(e) => validateAndUpdateUrl(e.target.value)}
                  placeholder="Enter n8n webhook URL"
                  className={`w-full bg-gray-700 border rounded-md pl-3 pr-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    urlStatus === 'missing' ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {webhookUrl ? (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  ) : urlStatus === 'missing' && (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex items-center">
                {urlStatus === 'env' && (
                  <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full mr-2">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Environment Variable
                  </div>
                )}
                {urlStatus === 'custom' && (
                  <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full mr-2">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                    Custom Endpoint
                  </div>
                )}
                {urlStatus === 'missing' && (
                  <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full mr-2">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    URL Required
                  </div>
                )}
              </div>
              
              {urlStatus === 'missing' && (
                <p className="text-xs text-red-400 mt-1">
                  Please set NEXT_PUBLIC_N8N_WEBHOOK_URL in .env or enter URL manually
                </p>
              )}
              
              <div className="mt-3 text-xs text-gray-400">
                <p className="flex items-center">
                  <svg className="w-3 h-3 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-gray-500">Webhook connects to n8n workflow for API processing</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-gray-700">
        {isSecureUrl && (
          <button
            onClick={onResetConversation}
            className="mt-4 py-2 px-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center transition-colors duration-300 shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start New Conversation
          </button>
        )}
      </div>
    </div>
  );
} 