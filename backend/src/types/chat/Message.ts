// src/types/Message.ts

import { Role } from './Role'

export interface Message {
  role: Role // Role, maps to roles
  content?: string // Content of the message
}
