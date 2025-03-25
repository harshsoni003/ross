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
      } catch (e) {
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
    
    // Clean up the result content
    resultContent = cleanupContent(resultContent);

    return NextResponse.json({ response: resultContent });
  } catch (error) {
    console.error('Error processing n8n chat request:', error);
    return NextResponse.json({ error: 'Failed to process n8n chat request' }, { status: 500 });
  }
}

/**
 * Extract content from various object structures
 */
function extractContentFromObject(data: any): string {
  if (Array.isArray(data)) {
    if (data.length > 0) {
      if (typeof data[0] === 'object' && data[0] !== null) {
        // Check for common properties in the first item
        if (data[0].output) return data[0].output;
        if (data[0].result) return data[0].result;
        if (data[0].content) return data[0].content;
        if (data[0].message) return data[0].message;
      }
      // If it's an array of strings or primitives, join them
      return data.map(item => String(item)).join('\n');
    }
    return '';
  }
  
  // Check for common properties in objects
  if (data.output) return data.output;
  if (data.result) return data.result;
  if (data.content) return data.content;
  if (data.message) return data.message;
  if (data.response) return data.response;
  
  // If no known property is found, stringify the object
  return JSON.stringify(data, null, 2);
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