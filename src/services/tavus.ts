// Tavus Video Avatar Service
export class TavusService {
  private apiKey: string;
  private baseUrl = 'https://tavusapi.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateVideo(text: string, replicaId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          replica_id: replicaId,
          script: text,
          background_url: 'https://tavusapi.com/backgrounds/gradient-purple.jpg',
          video_name: `AI Genie Response - ${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.status}`);
      }

      const data = await response.json();
      return data.video_id;
    } catch (error) {
      console.error('Tavus video generation failed:', error);
      throw error;
    }
  }

  async getVideoStatus(videoId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/videos/${videoId}`, {
        headers: {
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get video status:', error);
      throw error;
    }
  }

  async pollVideoCompletion(videoId: string, maxAttempts: number = 30): Promise<string> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getVideoStatus(videoId);
      
      if (status.status === 'completed') {
        return status.download_url;
      }
      
      if (status.status === 'failed') {
        throw new Error('Video generation failed');
      }
      
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Video generation timeout');
  }
}