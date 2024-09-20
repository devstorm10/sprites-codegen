import {Message} from "../chat/Message";

// Request
export interface ChatRequestPayload {
    conversationId?: string;
    message?: string;
}

// Response
export interface ChatResponsePayload {
    conversationId?: string;
    message: Message;
}
