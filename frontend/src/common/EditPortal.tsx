import ReactDOM from 'react-dom'
import { FaCheck } from 'react-icons/fa6'

import { Input } from '@/components/ui/input'

type PortalPosition = {
  left: number
  top: number
  width: number
  height: number
}

interface EditPortalProps {
  text: string
  position: PortalPosition
  handleSave: () => void
  handleCancel: () => void
  handleTextChange: (text: string) => void
}

const EditPortal: React.FC<EditPortalProps> = ({
  text,
  position,
  handleSave,
  handleCancel,
  handleTextChange,
}) => {
  return ReactDOM.createPortal(
    <div
      className="w-screen h-screen bg-black/20 fixed inset-0 z-[100]"
      onClick={handleCancel}
    >
      <div
        className="!fixed flex gap-x-2 items-center"
        style={{
          left: position.left,
          top: position.top,
          width: position.width,
          height: position.height,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          className="!h-auto !p-0 !outline-none !border-none !ring-0 bg-white font-bold"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
        />
        <span
          className="w-4 h-4 flex items-center justify-center cursor-pointer"
          onClick={handleSave}
        >
          <FaCheck />
        </span>
      </div>
    </div>,
    document.body
  )
}

export default EditPortal
export type { PortalPosition }
