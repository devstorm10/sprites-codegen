// src/services/openAIService.ts
import OpenAI from 'openai';

class OpenAIService {
    private static instance: OpenAI;

    // Private constructor to prevent direct instantiation
    private constructor() {}

    // Static method to provide a shared instance
    public static getInstance(): OpenAI {
        if (!OpenAIService.instance) {
            // If instance doesn't exist, create it
            OpenAIService.instance = new OpenAI();
        }
        // otherwise return it
        return OpenAIService.instance;
    }
}

export default OpenAIService;
