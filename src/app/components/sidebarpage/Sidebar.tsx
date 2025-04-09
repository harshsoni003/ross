"use client";

import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Define the ChatAgent type
interface ChatAgent {
  id: string;
  agent_name: string;
  chat_url: string;
  created_at: string;
}

interface SidebarProps {
  webhookUrl: string;
  setWebhookUrl: Dispatch<SetStateAction<string>>;
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  onResetConversation: () => void;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Sidebar({ webhookUrl, setWebhookUrl, userName, setUserName, onResetConversation }: SidebarProps) {
  const [urlStatus, setUrlStatus] = useState<'env' | 'custom' | 'missing'>(
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ? 'env' : 
    webhookUrl ? 'custom' : 'missing'
  );
  
  // Add state for agent name and chat URL
  const [agentName, setAgentName] = useState('');
  const [chatUrl, setChatUrl] = useState('');
  const [agents, setAgents] = useState<ChatAgent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  // Add this state to track if the agent dropdown is open
  const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);
  
  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
  }, []);
  
  // Function to fetch agents from Supabase
  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_agents')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to save agent to Supabase
  const saveAgent = async () => {
    if (!agentName.trim()) {
      setSaveMessage({ type: 'error', text: 'Agent name is required' });
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_agents')
        .insert([
          { agent_name: agentName.trim(), chat_url: chatUrl.trim() }
        ])
        .select();
        
      if (error) throw error;
      
      // Update local state
      if (data) {
        setAgents([...data, ...agents]);
        setAgentName('');
        setChatUrl('');
        setSaveMessage({ type: 'success', text: 'Agent saved successfully!' });
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error saving agent:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save agent' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to select an agent and apply its chat URL
  const selectAgent = (agent: ChatAgent) => {
    setSelectedAgentId(agent.id);
    validateAndUpdateUrl(agent.chat_url);
    
    // Show a success message
    setSaveMessage({ 
      type: 'success', 
      text: `Agent "${agent.agent_name}" selected!` 
    });
    
    // Clear success message after 3 seconds
    setTimeout(() => setSaveMessage(null), 3000);
  };
  
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

  // Add this function to toggle the agent dropdown
  const toggleAgentDropdown = () => {
    setIsAgentDropdownOpen(!isAgentDropdownOpen);
  };

  // Function to delete an agent from Supabase
  const deleteAgent = async (agentId: string) => {
    try {
      setIsLoading(true);
      
      // Delete the agent from Supabase
      const { error } = await supabase
        .from('chat_agents')
        .delete()
        .eq('id', agentId);
        
      if (error) throw error;
      
      // Update local state by removing the deleted agent
      setAgents(agents.filter(agent => agent.id !== agentId));
      
      // If the deleted agent was selected, clear the selection
      if (selectedAgentId === agentId) {
        setSelectedAgentId(null);
      }
      
      // Show success message
      setSaveMessage({ 
        type: 'success', 
        text: 'Agent deleted successfully!' 
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
      
    } catch (error) {
      console.error('Error deleting agent:', error);
      setSaveMessage({ 
        type: 'error', 
        text: 'Failed to delete agent' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700 h-screen flex flex-col">
      <div className="p-6 overflow-y-auto flex-grow">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          API Settings
        </h2>
        
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
                Active
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm text-gray-300">Webhook Endpoint</label>
                <div className="flex items-center">
                  <span className="text-xs text-blue-400 font-medium mr-2">n8n API</span>
                  {/* Toggle button for saved agents */}
                  <button 
                    onClick={toggleAgentDropdown}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                    title="Show saved agents"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform duration-200 ${isAgentDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
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
              
              {/* Dropdown for saved agents */}
              {isAgentDropdownOpen && agents.length > 0 && (
                <div className="mt-2 bg-gray-700 rounded-md border border-gray-600 shadow-lg overflow-hidden">
                  <div className="p-2 border-b border-gray-600 bg-gray-800">
                    <h4 className="text-xs font-medium text-gray-300">Select an agent endpoint</h4>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {agents.map((agent) => (
                      <div 
                        key={agent.id}
                        className={`p-2 hover:bg-gray-600 cursor-pointer ${
                          selectedAgentId === agent.id ? 'bg-gray-600' : ''
                        }`}
                        onClick={() => {
                          selectAgent(agent);
                          setIsAgentDropdownOpen(false);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white">{agent.agent_name}</span>
                          {selectedAgentId === agent.id && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        {agent.chat_url && (
                          <p className="text-xs text-gray-400 truncate">{agent.chat_url}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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

<<<<<<< HEAD
        {/* New Container for Aigent name & webhook chat url */}
=======
        {/* Agent Configuration Section */}
>>>>>>> 264cfefc2b02737600c8d1c2aa58b57215ed4160
        <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-sm font-medium text-blue-400 mb-3 uppercase tracking-wider flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            AGENT CONFIGURATION
          </h3>
          <div className="space-y-4">
            <div>
<<<<<<< HEAD
              <label className="block text-sm text-gray-300 mb-1">Aigent Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
=======
              <label className="block text-sm text-gray-300 mb-1">Agent Name</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
>>>>>>> 264cfefc2b02737600c8d1c2aa58b57215ed4160
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter agent name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Webhook Chat URL</label>
              <input
                type="text"
<<<<<<< HEAD
=======
                value={chatUrl}
                onChange={(e) => setChatUrl(e.target.value)}
>>>>>>> 264cfefc2b02737600c8d1c2aa58b57215ed4160
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter webhook chat URL"
              />
              <p className="text-xs text-gray-400 mt-1">
                Optional: Separate URL for chat-specific webhook endpoints
              </p>
            </div>
<<<<<<< HEAD
            <div className="pt-2">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 shadow-md w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Configuration
=======
            
            {/* Save message notification */}
            {saveMessage && (
              <div className={`text-sm px-3 py-2 rounded ${
                saveMessage.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
              }`}>
                {saveMessage.text}
              </div>
            )}
            
            <div className="pt-2">
              <button 
                onClick={saveAgent}
                disabled={isLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 shadow-md w-full ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Save Agent
>>>>>>> 264cfefc2b02737600c8d1c2aa58b57215ed4160
              </button>
            </div>
          </div>
        </div>
<<<<<<< HEAD
=======
        
        {/* Saved Agents List */}
        {agents.length > 0 && (
          <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-blue-400 mb-3 uppercase tracking-wider flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              SAVED AGENTS
            </h3>
            <div className="space-y-2 mt-2">
              {agents.map((agent) => (
                <div 
                  key={agent.id} 
                  className={`bg-gray-700 p-3 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-600 ${
                    selectedAgentId === agent.id ? 'border-2 border-blue-500' : ''
                  }`}
                  onClick={() => selectAgent(agent)}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-medium">{agent.agent_name}</h4>
                    <div className="flex items-center">
                      {selectedAgentId === agent.id && (
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full mr-2">Active</span>
                      )}
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Agent</span>
                    </div>
                  </div>
                  {agent.chat_url && (
                    <p className="text-xs text-gray-300 mt-1 truncate">
                      URL: {agent.chat_url}
                    </p>
                  )}
                  <div className="mt-2 flex justify-between">
                    <button 
                      className="text-xs text-red-400 hover:text-red-300 transition-colors duration-200 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAgent(agent.id);
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                    <button 
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAgent(agent);
                      }}
                    >
                      Use this endpoint
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
>>>>>>> 264cfefc2b02737600c8d1c2aa58b57215ed4160
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