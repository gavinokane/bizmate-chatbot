export class ErrorHandler {
  static handleChatError(error: any): string {
    if (error.response?.status === 429) {
      return 'Too many requests. Please wait a moment before trying again.';
    }
    
    if (error.response?.status === 401) {
      return 'Authentication failed. Please check your API credentials.';
    }
    
    if (error.response?.status >= 500) {
      return 'Our support system is temporarily unavailable. Please try again later.';
    }
    
    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please check your connection and try again.';
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Something went wrong. Please try again.';
  }

  static logError(error: any, context: string): void {
    console.error(`[${context}] Error:`, {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // In production, send to monitoring service
    // this.sendToMonitoring(error, context);
  }
}
