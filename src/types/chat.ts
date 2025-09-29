export interface Citation {
  name: string;
  content: string;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: Citation[];
  followUpQuestions?: string[];
}

export interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}

export interface ConversationHistoryItem {
  prompt: string;
  answer: string;
  created_at: string;
}

export interface ChatRequest {
  query: string;
  session_id: string;
  timestamp: string;
  hub_id?: string;
  agent_id?: string;
  conversation_history?: ConversationHistoryItem[];
}

export interface ChatResponse {
  id: string;
  message: string;
  sources?: Citation[];
  followUpQuestions?: string[];
  error?: string;
}

// DoozerAI specific types
export interface DoozerRequest {
  workerid: string;
  doozer_name: string;
  query: string;
}

export interface DoozerResponse {
  response?: string;
  answer?: string;
  sources?: string[];
  followUpQuestions?: string[];
  error?: string;
}
