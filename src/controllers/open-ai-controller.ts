// src/controllers/open-ai-controller.ts

import {Request, Response} from 'express';
import OpenAIService from "../services/open-aI-service";
import {ChatRequestPayload, ChatResponsePayload} from "../types/payloads/Chat";
import {Message} from "../types/chat/Message";
import {Role} from "../types/chat/Role";
import {createConversation, getConversation, updateConversation} from "../repositories/conversation-repository";
import {Conversation} from "../models/cache/conversation";
import OpenAI from "openai";
import ChatCompletionMessage = OpenAI.ChatCompletionMessage;

// Controller to handle OpenAI API requests for text completion
export const getLLMCompletion = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Get the agent ID from the URL parameter

        // Cast the incoming JSON body to the ChatRequestPayload type
        const chatRequestPayload: ChatRequestPayload = req.body;

        let conversation: Conversation | null = null;
        if (chatRequestPayload.conversationId != null) {
            // try to grab existing convo
            conversation = await getConversation(chatRequestPayload.conversationId);
        }
        if (chatRequestPayload.conversationId == null || conversation === null)
        {
            // either no ID was given, or get failed, so create convo
            conversation = await createConversation();
        }

        const userMessageContent = chatRequestPayload.message != null ?
            chatRequestPayload.message! : "Open the chat with a ice breaker";

        const messageList: ChatCompletionMessage[] = [];

        const syspromptMessage = {
                role: Role.system,
                content: "You are a friendly companion named Seraphina. You are a cuddly cute fox. Be an empathetic companion and write next response based on user's latest message.",
            };
        const userMessage = {
                role: Role.user,
                content: userMessageContent,
            };

        // add system message
        messageList.push(syspromptMessage as ChatCompletionMessage);

        // add retrieved convo
        if (conversation.messages != null && conversation.messages!.length  > 0)
        {
            const chatHistoryMessages: ChatCompletionMessage[] = conversation.messages!.map(element => {
                return {
                    role: element.role,
                    content: element.content
                } as ChatCompletionMessage;
            });
            messageList.push(...chatHistoryMessages);
        }
        // add the user message just submitted
        messageList.push(userMessage as ChatCompletionMessage);

        // get completion
        console.log(messageList);
        const llmCompletion = await OpenAIService.getInstance().chat.completions.create({
            model: "gpt-4o-mini",
            messages: messageList
        });

        const completion = llmCompletion.choices[0].message.content;
        const responseMessage: Message = {
            role: Role.assistant,
            content: completion != null ? completion : ""
        };

        // Update the conversation cache in Redis - THIS HAS TO BECOME ASYNC (is SNS rpc faster than Redis?)
        conversation.addMessage(userMessage.role, userMessage.content);
        conversation.addMessage(responseMessage.role, responseMessage.content!);
        await updateConversation(conversation.id, conversation);

        // Build the ChatResponsePayload
        const chatResponsePayload: ChatResponsePayload = {
            conversationId: conversation.id,
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
