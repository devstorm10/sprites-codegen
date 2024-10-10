import { IoImageOutline, IoMicOutline, IoSendOutline } from 'react-icons/io5'
import { FaAngleDoubleRight } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'

import Input from '@/common/Input'

import ChatPanelWrapper from './ChatPanelWrapper'

const ChatPanel = () => {
  return (
    <ChatPanelWrapper>
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="p-5 flex justify-between items-center">
            <button className="p-1.5 bg-background rounded-full shadow-lg text-sm">
              <FaAngleDoubleRight />
            </button>
            <p className="text-sm opacity-50">Edited 1h ago</p>
            <button className="p-1.5 bg-background rounded-full shadow-lg text-sm">
              <BsThreeDots />
            </button>
          </div>
        </div>
        <div className="p-5">
          <div className="bg-background p-3 rounded-[15px] shadow flex">
            <button className="w-[35px] h-[35px] flex justify-center items-center rounded-lg hover:bg-muted">
              <IoMicOutline />
            </button>
            <button className="w-[35px] h-[35px] flex justify-center items-center rounded-lg hover:bg-muted">
              <IoImageOutline />
            </button>
            <Input
              placeholder="Type message"
              className="text-sm py-1 mx-1 flex-1"
            />
            <button className="w-[35px] h-[35px] flex justify-center items-center rounded-lg hover:bg-muted">
              <IoSendOutline />
            </button>
          </div>
        </div>
      </div>
    </ChatPanelWrapper>
  )
}

export default ChatPanel
