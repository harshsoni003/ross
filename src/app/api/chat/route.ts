import { NextResponse } from 'next/server';

// Get the default webhook URL from environment variables only
const DEFAULT_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';

export async function POST(request: Request) {
  try {
    const { message, webhookUrl } = await request.json();
    
    // Use provided webhook URL or fallback to default
    const finalWebhookUrl = (webhookUrl && webhookUrl.trim()) || DEFAULT_WEBHOOK_URL;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Validate webhook URL is provided
    if (!finalWebhookUrl) {
      return NextResponse.json({ error: 'Webhook URL is not configured. Please set the NEXT_PUBLIC_N8N_WEBHOOK_URL in your .env file or enter a URL manually in the sidebar.' }, { status: 400 });
    }

    // Call the n8n webhook
    const response = await fetch(finalWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: message }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get response from n8n: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the result from the response
    let resultContent = '';
    
    // Improved response handling logic
    if (typeof data === 'string') {
      try {
        // Try to parse if it's a JSON string
        const parsedData = JSON.parse(data);
        resultContent = extractContentFromObject(parsedData);
      } catch (_) {
        // If it's not valid JSON, check for the ["output":"..."] pattern
        const outputMatch = data.match(/\["output":"(.+?)"\]/);
        if (outputMatch && outputMatch[1]) {
          resultContent = outputMatch[1];
        } else {
          resultContent = data;
        }
      }
    } else if (typeof data === 'object') {
      resultContent = extractContentFromObject(data);
    } else {
      resultContent = String(data);
    }

    // Clean up and format the content
    resultContent = cleanupContent(resultContent);
    
    // Apply markdown-like formatting for better display
    resultContent = formatContent(resultContent);

    return NextResponse.json({ response: resultContent });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json({ error: `Failed to process message: ${(error as Error).message}` }, { status: 500 });
  }
}

// Helper function to extract content from response object
function extractContentFromObject(obj: Record<string, unknown>): string {
  if (obj.output) return String(obj.output);
  if (obj.response) return String(obj.response);
  if (obj.result) return String(obj.result);
  if (obj.message) return String(obj.message);
  if (obj.data) return typeof obj.data === 'string' ? obj.data : JSON.stringify(obj.data);
  
  // Return stringified object if no known properties found
  return JSON.stringify(obj);
}

/**
 * Clean up content by removing escape characters and extra quotes
 */
function cleanupContent(content: string): string {
  return content
    .replace(/\\n/g, '\n')       // Replace escaped newlines
    .replace(/\\"/g, '"')        // Replace escaped quotes
    .replace(/\\t/g, '\t')       // Replace escaped tabs
    .replace(/\\r/g, '')         // Remove carriage returns
    .replace(/^"|"$/g, '')       // Remove surrounding quotes
    .replace(/\\\\([^\\])/g, '\\$1'); // Fix double escaped characters
}

/**
 * Format content with basic markdown-like styling
 */
function formatContent(content: string): string {
  // Format event details with better structure
  if (content.includes('has been successfully')) {
    // Add bold formatting to key parts
    content = content
      .replace(/(The event ".*?" has been successfully)/, '**$1**')
      .replace(/(\*\*Summary\*\*:)/, '\n\n**Summary**:')
      .replace(/(\*\*Description\*\*:)/, '\n**Description**:')
      .replace(/(\*\*Date and Time\*\*:)/, '\n**Date and Time**:')
      .replace(/(\*\*Attendees\*\*:)/, '\n**Attendees**:')
      .replace(/(\*\*Google Meet Link\*\*:)/, '\n**Google Meet Link**:')
      .replace(/(\*\*Phone Access\*\*:)/, '\n**Phone Access**:')
      .replace(/(You can view or edit the event)/, '\n\n$1');
  }
  
  // Add more formatting rules for other types of responses
  
  return content;
} 