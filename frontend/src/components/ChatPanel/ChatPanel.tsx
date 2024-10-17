import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { FaAngleDoubleRight } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import { AiOutlineOpenAI } from 'react-icons/ai'
import { motion } from 'framer-motion'

import Input from '@/common/Input'

import ChatPanelWrapper from './ChatPanelWrapper'
import { MicIcon } from '../icons/MicIcon'
import { ImageIcon } from '../icons/ImageIcon'
import { SendIcon } from '../icons/SendIcon'
import { ChatMessage } from '@/lib/types'
import { cn } from '@/lib/utils'

type ChatMessagesProps = {
  messages: ChatMessage[]
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <motion.div className="p-4 flex flex-col gap-y-2.5" layout>
      {messages.map((message: ChatMessage, idx: number) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'max-w-[80%] py-2 px-4 rounded-full text-sm flex items-center',
            message.role === 'user' ? 'self-end' : 'self-start',
            { 'bg-secondary-100/10': message.role === 'user' }
          )}
          layout
        >
          <span
            className={cn('mr-2 text-lg', {
              hidden: message.role === 'user',
            })}
          >
            <AiOutlineOpenAI />
          </span>
          {message.message}
        </motion.div>
      ))}
    </motion.div>
  )
}

const ChatPanel: React.FC = () => {
  const [chatValue, setChatValue] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const handleChatChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChatValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setMessages([...messages, { role: 'user', message: chatValue }])
      setChatValue('')
      setTimeout(() => {
        setMessages((messages) => [
          ...messages,
          { role: 'assistant', message: 'How can I assist you?' },
        ])
      }, 500)
    }
  }

  return (
    <ChatPanelWrapper>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-5 flex justify-between items-center">
            <button className="p-1.5 bg-background rounded-full shadow-lg text-sm text-secondary-100/50">
              <FaAngleDoubleRight />
            </button>
            <p className="text-[14px] opacity-50 font-medium">Edited 1h ago</p>
            <button className="p-1.5 bg-background rounded-full shadow-lg text-sm text-secondary-100/50">
              <BsThreeDots />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatMessages messages={messages} />
          </div>
        </div>
        <div className="p-5">
          <div className="bg-background p-3 rounded-[15px] shadow flex">
            <button className="w-[35px] h-[35px] flex justify-center items-center rounded-lg hover:bg-muted">
              <MicIcon />
            </button>
            <button className="w-[35px] h-[35px] flex justify-center items-center rounded-lg hover:bg-muted">
              <ImageIcon />
            </button>
            <Input
              placeholder="Type message"
              className="text-[14px] py-1 mx-1 flex-1"
              value={chatValue}
              onChange={handleChatChange}
              onKeyDown={handleKeyDown}
            />
            <button className="w-[35px] h-[35px] flex justify-center items-center rounded-lg hover:bg-muted">
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </ChatPanelWrapper>
  )
}

export default ChatPanel
