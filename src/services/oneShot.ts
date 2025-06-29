// One-Shot Prompt Service
export interface OneShotRequest {
  prompt: string;
  context?: string;
  userId?: string;
  includeVoice?: boolean;
  includeVideo?: boolean;
}

export interface OneShotResponse {
  id: string;
  response: string;
  audioUrl?: string;
  videoUrl?: string;
  timestamp: Date;
  processingTime: number;
}

export class OneShotService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async processOneShot(request: OneShotRequest): Promise<OneShotResponse> {
    const startTime = Date.now();
    
    try {
      // Generate AI response
      const aiResponse = await this.generateAIResponse(request.prompt, request.context);
      
      const response: OneShotResponse = {
        id: `oneshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        response: aiResponse,
        timestamp: new Date(),
        processingTime: Date.now() - startTime,
      };

      // Generate voice if requested
      if (request.includeVoice) {
        response.audioUrl = await this.generateVoiceResponse(aiResponse);
      }

      // Generate video if requested
      if (request.includeVideo) {
        response.videoUrl = await this.generateVideoResponse(aiResponse);
      }

      response.processingTime = Date.now() - startTime;
      
      // Store response for analytics
      this.storeOneShotResponse(response);
      
      return response;
    } catch (error) {
      console.error('One-shot processing failed:', error);
      throw error;
    }
  }

  private async generateAIResponse(prompt: string, context?: string): Promise<string> {
    // Mock AI response generation
    const responses = [
      `🧞 **One-Shot Wisdom Activated!**\n\n${prompt}\n\nBased on my instant analysis, here's what I see: This situation calls for a balanced approach that considers both your immediate needs and long-term goals. The key is to trust your instincts while gathering the right information to make an informed decision.\n\n**My recommendation:** Take one small step forward today, even if it's just research or a conversation. Progress beats perfection every time.\n\n*Generated in one shot by AI Genie*`,
      
      `🎯 **Instant Life Guidance**\n\n${prompt}\n\nI've processed your request through my advanced decision-making framework. The pattern I see suggests this is a pivotal moment that requires both courage and wisdom.\n\n**Core insight:** The fear you're feeling is actually excitement in disguise. Your subconscious already knows the answer - you just need permission to act on it.\n\n**Action plan:** Start with the smallest possible step that moves you toward your desired outcome. Momentum creates clarity.\n\n*One-shot analysis complete*`,
      
      `✨ **Rapid Response Mode**\n\n${prompt}\n\nAfter analyzing thousands of similar situations, here's what the data tells us: Most people regret the chances they didn't take more than the ones they did.\n\n**The truth:** You're more prepared than you think. The perfect moment is a myth - the right moment is now.\n\n**Next steps:** \n1. Define your minimum viable action\n2. Set a deadline (within 48 hours)\n3. Tell someone about your plan for accountability\n\n*Delivered by AI Genie in one shot*`,
    ];

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private async generateVoiceResponse(text: string): Promise<string> {
    // Mock voice generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `data:audio/mpeg;base64,mock_audio_data_${Date.now()}`;
  }

  private async generateVideoResponse(text: string): Promise<string> {
    // Mock video generation
    await new Promise(resolve => setTimeout(resolve, 5000));
    return `https://mock-video-url.com/oneshot_${Date.now()}.mp4`;
  }

  private storeOneShotResponse(response: OneShotResponse) {
    try {
      const existing = JSON.parse(localStorage.getItem('oneshot_responses') || '[]');
      existing.push(response);
      
      // Keep only last 50 responses
      if (existing.length > 50) {
        existing.splice(0, existing.length - 50);
      }
      
      localStorage.setItem('oneshot_responses', JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to store one-shot response:', error);
    }
  }

  async getOneShotHistory(): Promise<OneShotResponse[]> {
    try {
      const stored = localStorage.getItem('oneshot_responses');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get one-shot history:', error);
      return [];
    }
  }

  async getOneShotStats() {
    const history = await this.getOneShotHistory();
    
    return {
      totalRequests: history.length,
      averageProcessingTime: history.reduce((sum, r) => sum + r.processingTime, 0) / history.length || 0,
      voiceRequests: history.filter(r => r.audioUrl).length,
      videoRequests: history.filter(r => r.videoUrl).length,
      lastUsed: history.length > 0 ? history[history.length - 1].timestamp : null,
    };
  }
}