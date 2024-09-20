// src/models/message.ts

import {Role} from "../../types/chat/Role";

export interface Message {
    id: string;
    role: Role;
    content: string;
}
