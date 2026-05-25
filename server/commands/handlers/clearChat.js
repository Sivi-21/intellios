import sessionService from '../../services/sessionService.js';

export async function clearChat({ sessionId }) {
  await sessionService.clearConversation(sessionId);

  return {
    summary: 'Conversation reset',
    message: {
      content:
        'Thread reset complete. **IntelliOS Core** is online with fresh context windows. What shall we build?',
    },
    clearChat: true,
  };
}
