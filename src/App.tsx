import React from 'react';
import { Global, css } from '@emotion/react';
import { ChatWidget } from './components/Chat/ChatWidget';

const globalStyles = css`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    min-height: 100vh;
  }

  .app-container {
    text-align: center;
    padding: 40px 20px;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .app-header {
    margin-bottom: 40px;
  }

  .demo-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .demo-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .demo-content p {
    font-size: 1.2rem;
    line-height: 1.6;
    opacity: 0.9;
  }
`;

function App() {
  return (
    <>
      <Global styles={globalStyles} />
      <div className="app-container">
        <header className="app-header">
          <div className="demo-content">
            <h1>Box AI Chatbot Demo</h1>
            {/* <p>
              This is a demo page showing the Box AI chatbot integration.
              Click the chat button in the bottom right to start a conversation
              with our AI assistant powered by Box AI and DoozerAI.
            </p>
            <p>
              The chatbot can help you with support questions, troubleshooting,
              and accessing documentation from our knowledge base.
            </p> */}
          </div>
        </header>
        
        <main>
          <div className="demo-content">
            {/* <h2>Features</h2>
            <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
              <li>Real-time conversation with Box AI integration</li>
              <li>Session management for anonymous users</li>
              <li>Rate limiting and security features</li>
              <li>Mobile-responsive design</li>
              <li>Error handling and graceful degradation</li>
              <li>Conversation persistence across sessions</li>
            </ul> */}
          </div>
        </main>
      </div>
      
      <ChatWidget />
    </>
  );
}

export default App;
