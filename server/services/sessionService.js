import Conversation from '../models/Conversation.js';
import CommandHistory from '../models/CommandHistory.js';
import { isDatabaseReady } from '../config/database.js';
import { generateId } from '../utils/id.js';

const memoryConversations = new Map();

export class SessionService {
  async getConversation(sessionId) {
    if (isDatabaseReady()) {
      return Conversation.findOne({ sessionId, isActive: true }).sort({ updatedAt: -1 });
    }
    return memoryConversations.get(sessionId) || null;
  }

  async appendMessage(sessionId, message, model) {
    const msg = {
      id: message.id || generateId('msg'),
      role: message.role,
      content: message.content,
      codeSnippet: message.codeSnippet,
      createdAt: new Date(),
    };

    if (isDatabaseReady()) {
      let conv = await Conversation.findOne({ sessionId, isActive: true });
      if (!conv) {
        conv = await Conversation.create({
          sessionId,
          messages: [msg],
          model,
        });
      } else {
        conv.messages.push(msg);
        conv.model = model || conv.model;
        await conv.save();
      }
      return conv;
    }

    const existing = memoryConversations.get(sessionId) || {
      sessionId,
      messages: [],
      model,
    };
    existing.messages.push(msg);
    memoryConversations.set(sessionId, existing);
    return existing;
  }

  async clearConversation(sessionId) {
    if (isDatabaseReady()) {
      await Conversation.updateMany({ sessionId }, { isActive: false });
      return Conversation.create({ sessionId, messages: [] });
    }
    memoryConversations.delete(sessionId);
    return { sessionId, messages: [] };
  }

  async logCommand(entry) {
    if (!isDatabaseReady()) return entry;
    return CommandHistory.create(entry);
  }

  getMessageHistory(conversation) {
    if (!conversation?.messages) return [];
    return conversation.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
  }
}

export default new SessionService();
