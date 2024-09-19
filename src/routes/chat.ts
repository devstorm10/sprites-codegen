import { Router, Request, Response } from 'express';
import { ChatRequestPayload, ChatResponsePayload } from '../types/payloads/Chat';
import { Message } from "../types/chat/Message";
import { Role } from '../types/chat/Role';

// Initialize the Express Router
const router = Router();

// POST /chat/:id - Accepts an ID, an optional ChatRequestPayload, and returns a ChatResponsePayload
router.post('/:id', (req: Request, res: Response) => {
    const { id } = req.params; // Get the unique ID from the URL parameter

    // Cast the incoming JSON body to the ChatRequestPayload type
    const chatRequestPayload: ChatRequestPayload = req.body;

    // Check if the message is present in the request payload
    const userMessage: Message = chatRequestPayload.message || {
        role: Role.user, // Default role if no message is provided
        content: 'Default content as no message was provided.',
    };

    // TODO inference Call

    // Example business logic: Process the message and craft a response
    const responseMessage: Message = {
        role: Role.assistant, // The assistant responds
        content: "Hello, this is a AI response to your message!",
    };

    // Build the ChatResponsePayload
    const chatResponsePayload: ChatResponsePayload = {
        message: responseMessage,
    };

    // Send back the response payload as a JSON
    return res.status(200).json(chatResponsePayload);
});

export default router;
