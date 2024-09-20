// src/models/conversation.ts
import { Message } from './message';
import {Role} from "../../types/chat/Role";
import { v4 as uuidv4 } from 'uuid';

export class Conversation {
    id: string;
    updated_at: Date;
    messages: Message[];

    constructor(id: string) {
        this.id = id;
        this.updated_at = new Date();
        this.messages = [];
    }

    // Method to add a message to the conversation
    public addMessage(role: Role, content: string): Message {
        const message: Message = {
            id: uuidv4(),
            role,
            content,
        };

        this.messages.push(message);
        this.updated_at = new Date(); // Update the timestamp

        return message;
    }
}
