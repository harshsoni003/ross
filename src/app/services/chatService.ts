export async function sendMessage(message: string, webhookUrl?: string): Promise<string> {
  try {
    // Validate webhook URL is provided and properly formatted
    if (!webhookUrl || webhookUrl.trim() === '') {
      throw new Error('Webhook URL is not configured. Please enter a valid webhook URL in the sidebar.');
    }

    // Trim the webhook URL to handle any whitespace
    const trimmedWebhookUrl = webhookUrl.trim();
    
    console.log('Sending message to API with webhook:', trimmedWebhookUrl.substring(0, 10) + '...');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, webhookUrl: trimmedWebhookUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API response error:', errorData);
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
} 