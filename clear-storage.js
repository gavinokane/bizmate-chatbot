// Run this in your browser console to clear any corrupted chat data
localStorage.removeItem('chat_conversation');
localStorage.removeItem('chat_session_id');
localStorage.removeItem('chat_session_timestamp');
console.log('Chat storage cleared!');
