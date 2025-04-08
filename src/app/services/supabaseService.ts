import { createClient } from '@supabase/supabase-js';

// Define the ChatAgent type
export interface ChatAgent {
  id: string;
  agent_name: string;
  chat_url: string;
  created_at: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to fetch all agents
export async function fetchAgents(): Promise<ChatAgent[]> {
  try {
    const { data, error } = await supabase
      .from('chat_agents')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
}

// Function to create a new agent
export async function createAgent(agentName: string, chatUrl: string): Promise<ChatAgent | null> {
  try {
    const { data, error } = await supabase
      .from('chat_agents')
      .insert([
        { agent_name: agentName.trim(), chat_url: chatUrl.trim() }
      ])
      .select();
      
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating agent:', error);
    return null;
  }
}

// Function to delete an agent
export async function deleteAgent(agentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('chat_agents')
      .delete()
      .eq('id', agentId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting agent:', error);
    return false;
  }
}

// Function to update an agent
export async function updateAgent(agentId: string, updates: Partial<Omit<ChatAgent, 'id' | 'created_at'>>): Promise<ChatAgent | null> {
  try {
    const { data, error } = await supabase
      .from('chat_agents')
      .update(updates)
      .eq('id', agentId)
      .select();
      
    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error updating agent:', error);
    return null;
  }
} 