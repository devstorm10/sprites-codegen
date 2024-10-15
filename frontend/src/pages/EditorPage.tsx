import { FiSettings } from 'react-icons/fi'
import { FaChevronDown } from 'react-icons/fa'

import { Card } from '@/components/ui/card'
import CreateButton from '@/components/Editor/CreateButton'
import ContextViewer from '@/components/Editor/ContextViewer'
import { useAppSelector } from '@/store/store'
import { findContextNodeById } from '@/store/slices'
import FlowViewer from '@/components/Editor/Flow/FlowViewer'

const EditorPage = () => {
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const selectedContext = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, selectedContextId || '')
  )

  return (
    <div className="h-full flex flex-col">
      {selectedContext?.type === 'flow' ? (
        <FlowViewer />
      ) : (
        <div className="py-6 px-8 flex flex-col">
          <Card className="py-4 px-6 flex items-center justify-between rounded-[16px] shadow-[0_0_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center text-secondary-100/50 gap-1 font-semibold">
              <FiSettings size={18} />
              <p className="pl-1">Main Settings</p>
            </div>
            <span className="h-[24px] w-[24px] rounded-full flex items-center justify-center border text-secondary-100/50 shadow-[0_0_16px_rgba(0,0,0,0.04)]">
              <FaChevronDown size={14} />
            </span>
          </Card>
          <div className="mt-[64px]">
            <CreateButton />
          </div>
          <div className="mt-9">
            <ContextViewer />
          </div>
        </div>
      )}
    </div>
  )
}

export default EditorPage
