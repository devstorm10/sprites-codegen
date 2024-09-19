import {Message} from "../chat/Message";

// Request
export interface ChatRequestPayload {
    message?: Message;
}

// Response
export interface ChatResponsePayload {
    message: Message;
}
