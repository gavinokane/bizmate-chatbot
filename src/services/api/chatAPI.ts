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
      const hubId = request.hub_id || '564855680';
      const agentId = request.agent_id || '42916004';
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

      // Normalize Doozer 'output' which may be:
      // - a proper JSON string, or
      // - a Python-style dict string using single quotes.
      let answer = 'No response received';
      let sources: { name: string; content: string }[] = [];
      let followUpQuestions: string[] = [];

      const parseSingleQuotedDict = (s: string): any | null => {
        try {
          // Targeted replacements to convert Python-style dicts to valid JSON:
          let normalized = s.trim();

          // Replace Python booleans and None
          normalized = normalized
            .replace(/\bNone\b/g, 'null')
            .replace(/\bTrue\b/g, 'true')
            .replace(/\bFalse\b/g, 'false');

          // Replace quoted keys: 'key': -> "key":
          normalized = normalized.replace(/'([A-Za-z0-9_]+)'\s*:/g, '"$1":');

          // Replace simple quoted string values: : 'value' -> : "value"
          normalized = normalized.replace(/:\s*'([^']*)'/g, ': "$1"');

          // Final pass: convert any remaining single-quoted strings to double-quoted
          normalized = normalized.replace(/'([^']*)'/g, '"$1"');

          return JSON.parse(normalized);
        } catch {
          return null;
        }
      };

      if (data && typeof data.output !== 'undefined') {
        const raw = data.output;

        let outputObj: any = null;
        if (typeof raw === 'string') {
          // First attempt normal JSON.parse
          try {
            outputObj = JSON.parse(raw);
          } catch {
            // Attempt to parse single-quoted dict
            outputObj = parseSingleQuotedDict(raw);
          }
        } else if (typeof raw === 'object' && raw !== null) {
          outputObj = raw;
        }

        if (outputObj) {
          answer = outputObj.answer || (outputObj.text && outputObj.text.answer) || answer;

          const citations = outputObj.citations || outputObj.sources;
          if (Array.isArray(citations)) {
            sources = citations
              .map((c: any) => ({
                name: c.name || c.title || c.id || 'Source',
                content: c.content || c.text || ''
              }))
              .filter((x: any) => x.name || x.content);
          }

          const followUps = outputObj.followUpQuestions || outputObj.follow_up_questions;
          if (Array.isArray(followUps)) {
            followUpQuestions = followUps.filter((q: any) => typeof q === 'string');
          }

          // Fallback: if answer still looks like a dict string, try to extract text part via regex
          if (typeof answer === 'string') {
            const t = answer.trim();
            if ((t.startsWith('{') || t.startsWith('{\'')) && (t.endsWith('}') || t.endsWith('}\n'))) {
              const m =
                t.match(/"answer"\s*:\s*"([^"]*)"/) ||
                t.match(/'answer'\s*:\s*'([^']*)'/) ||
                t.match(/'answer'\s*:\s*"([^"]*)"/) ||
                t.match(/"answer"\s*:\s*'([^']*)'/);
              if (m) answer = m[1];
            }
          }
        } else if (typeof raw === 'string') {
          // Best-effort extraction of the 'answer' field from a raw string (handles both key/value quote combos)
          const patterns = [
            /"answer"\s*:\s*"([^"]*)"/,
            /'answer'\s*:\s*'([^']*)'/,
            /'answer'\s*:\s*"([^"]*)"/,
            /"answer"\s*:\s*'([^']*)'/
          ];
          let extracted: string | null = null;
          for (const p of patterns) {
            const m = raw.match(p);
            if (m) { extracted = m[1]; break; }
          }
          answer = extracted ?? raw;
        }
      }

      // Unescape common sequences for cleaner display
      if (typeof answer === 'string') {
        answer = answer.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
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
