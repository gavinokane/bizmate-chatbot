import { DOOZER_CONFIG } from '../../config/api';
import { ChatRequest, ChatResponse } from '../../types/chat';

export class ChatAPI {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseURL = DOOZER_CONFIG.BASE_URL;
    this.headers = {
      'ocp-apim-subscription-key': DOOZER_CONFIG.SUBSCRIPTION_KEY,
      'api_key': DOOZER_CONFIG.API_KEY,
      'content-type': 'application/json',
      'accept': '*/*'
    };
  }

  /**
   * Send a chat message to DoozerAI using the new Tool/execute API.
   * @param request ChatRequest containing the user's question and optional params.
   */
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Extract hub_id and agent_id from request if present, else use defaults
      const hubId = request.hub_id || '581898583';
      const agentId = request.agent_id || '42910897';
      const question = request.query;

      // Build params string as per API sample
      let params = `question=${question}~hub_id=${hubId}~agent_id=${agentId}`;
      const history = Array.isArray(request.conversation_history) ? request.conversation_history : [];
      console.log('sendMessage: request.conversation_history:', request.conversation_history);
      console.log('sendMessage: history used in params:', history);
      params += `~conversation_history=${JSON.stringify(history)}`;
      console.log('sendMessage: final params string:', params);

      const payload: any = {
        doozer_name: DOOZER_CONFIG.DOOZER_NAME,
        variables: [
          {
            ability_name: "Box - Ask Agent Hub Question",
            return_result: true,
            params
          }
        ]
      };

      const response = await fetch(`${this.baseURL}/Tool/execute`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // The response body contains a stringified JSON in 'output'
      let answer = 'No response received';
      let sources: { name: string; content: string }[] = [];
      let followUpQuestions: any[] = [];

      if (data && data.output) {
        try {
          const output = JSON.parse(data.output);
          answer = output.answer || answer;
          // Map citations to { name, content }
          if (Array.isArray(output.citations)) {
            sources = output.citations.map((c: any) => ({
              name: c.name,
              content: c.content
            }));
          }
        } catch (e) {
          answer = data.output;
        }
      }

      return {
        id: `doozer_${Date.now()}`,
        message: answer,
        sources,
        followUpQuestions
      };

    } catch (error) {
      console.error('DoozerAI API Error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to connect to DoozerAI service'
      );
    }
  }

  async validateSession(_sessionId: string): Promise<boolean> {
    // DoozerAI doesn't have session validation, so we'll return true
    // Session management is handled client-side
    return true;
  }
}

export const chatAPI = new ChatAPI();
