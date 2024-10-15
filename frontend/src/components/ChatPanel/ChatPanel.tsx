import { FaAngleDoubleRight } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'

import Input from '@/common/Input'

import ChatPanelWrapper from './ChatPanelWrapper'
import { MicIcon } from '../icons/MicIcon'
import { ImageIcon } from '../icons/ImageIcon'
import { SendIcon } from '../icons/SendIcon'

const ChatPanel = () => {
  return (
    <ChatPanelWrapper>
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="p-5 flex justify-between items-center">
            <button className="p-1.5 bg-background rounded-full shadow-lg text-sm text-secondary-100/50">
              <FaAngleDoubleRight />
            </button>
            <p className="text-[14px] opacity-50 font-medium">Edited 1h ago</p>
            <button className="p-1.5 bg-background rounded-full shadow-lg text-sm text-secondary-100/50">
              <BsThreeDots />
            </button>
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
