// src/controllers/openAIController.ts

import {Request, Response} from 'express';
import OpenAIService from "../services/openAIService";
import {ChatRequestPayload, ChatResponsePayload} from "../types/payloads/Chat";
import {Message} from "../types/chat/Message";
import {Role} from "../types/chat/Role";

// Controller to handle OpenAI API requests for text completion
export const getLLMCompletion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get the unique ID from the URL parameter

        // Cast the incoming JSON body to the ChatRequestPayload type
        const chatRequestPayload: ChatRequestPayload = req.body;

        const userMessage = chatRequestPayload.message != null ?
            chatRequestPayload.message! : "Open the chat with a ice breaker";

        const llmCompletion = await OpenAIService.getInstance().chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: Role.system,
                    content: "You are a friendly companion named Seraphina. You are a cuddly cute fox. Be an empathetic companion and write next response based on user's latest message.",
                },
                {
                    role: Role.user,
                    content: userMessage,
                },
            ],
        });

        const completion = llmCompletion.choices[0].message.content;
        const responseMessage: Message = {
            role: Role.assistant,
            content: completion != null ? completion : ""
        };

        // Build the ChatResponsePayload
        const chatResponsePayload: ChatResponsePayload = {
            message: responseMessage,
        };

        // Send back the response payload as a JSON
        return res.status(200).json(chatResponsePayload);

    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({
            error: 'Failed to get a response from OpenAI.',
        });
    }
};
