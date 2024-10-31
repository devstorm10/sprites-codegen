import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { FaAngleDoubleRight } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import { motion } from 'framer-motion'

import Input from '@/common/Input'

import ChatPanelWrapper from './ChatPanelWrapper'
import sendMessage from './sendMessage'
import { MicIcon } from '../icons/MicIcon'
import { ImageIcon } from '../icons/ImageIcon'
import { SendIcon } from '../icons/SendIcon'
import { ChatMessage } from '@/lib/types'
import { cn } from '@/lib/utils'
import Favicon from '/favicon.png'

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
            'py-2 px-4 rounded-full text-sm flex',
            message.role === 'user' ? 'self-end' : 'self-start',
            { 'max-w-[80%] bg-secondary-100/10': message.role === 'user' }
          )}
          layout
        >
          <span
            className={cn('shrink-0 mr-2 text-lg w-7 h-7', {
              hidden: message.role === 'user',
            })}
          >
            <img src={Favicon} />
          </span>
          {message.role === 'user' ? (
            message.message
          ) : (
            <pre
              className="whitespace-pre-wrap font-inter"
              dangerouslySetInnerHTML={{ __html: message.message }}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}

const ChatPanel: React.FC = () => {
  const [chatValue, setChatValue] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)

  const handleChatChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChatValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!chatValue) return
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', message: chatValue },
    ]
    setMessages(newMessages)
    setLoading(true)
    sendMessage(chatValue)
      .then((response: string) => {
        const formattedResponse = response.replace(
          /\*\*(.*?)\*\*/g,
          '<b>$1</b>'
        )
        setMessages([
          ...newMessages,
          { role: 'assistant', message: formattedResponse },
        ])
      })
      .finally(() => {
        setLoading(false)
      })
    setChatValue('')
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
              disabled={isLoading}
            />
            <button
              className="w-[35px] h-[35px] flex justify-center items-center rounded-lg hover:bg-muted"
              onClick={handleSubmit}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </ChatPanelWrapper>
  )
}

export default ChatPanel
