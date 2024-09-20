// src/repositories/conversationRepository.ts
import RedisService from '../services/redis-service';
import { Conversation } from '../models/cache/conversation';
import { v4 as uuidv4 } from 'uuid';

const redis = RedisService.getInstance();
const TTL = 3600;

export const createConversation = async (): Promise<Conversation> => {
    const conversation: Conversation = new Conversation(uuidv4());
    await redis.set(`conversation:${conversation.id}`, JSON.stringify(conversation), 'EX', TTL);
    return conversation;
};

export const getConversation = async (id: string): Promise<Conversation | null> => {
    const conversationData = await redis.get(`conversation:${id}`);
    if (conversationData) {
        return JSON.parse(conversationData);
    }
    return null;
};

export const updateConversation = async (id: string, conversation: Conversation): Promise<void> => {
    conversation.updated_at = new Date();
    await redis.set(`conversation:${id}`, JSON.stringify(conversation), 'EX', TTL);
};
