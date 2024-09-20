// src/repositories/agentRepository.ts
import RedisService from '../services/redis-service';
import { Agent } from '../models/cache/agent';
import { v4 as uuidv4 } from 'uuid';

const redis = RedisService.getInstance();

export const createAgent = async (prompt: string): Promise<Agent> => {
    const agent: Agent = {
        id: uuidv4(),
        prompt,
    };

    await redis.set(`agent:${agent.id}`, JSON.stringify(agent));

    return agent;
};

export const getAgent = async (id: string): Promise<Agent | null> => {
    const agentData = await redis.get(`agent:${id}`);
    if (agentData) {
        return JSON.parse(agentData);
    }
    return null;
};
