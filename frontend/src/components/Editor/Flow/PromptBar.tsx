import ContextViewer from '../ContextViewer'

import { CopyIcon } from '@/components/icons/CopyIcon'
import { ExpandIcon } from '@/components/icons/ExpandIcon'
import { SparkleIcon } from '@/components/icons/SparkleIcon'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { ContextNode } from '@/lib/types'

interface PromptBarProps {
  context: ContextNode
}

const PromptBar: React.FC<PromptBarProps> = ({ context }) => {
  return (
    <div className="p-6 absolute top-0 right-0 h-full w-[400px] bg-white shadow-[0px_3px_15px_0px_rgba(38,50,56,0.0715)]">
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <SparkleIcon />
            <p className="font-semibold">Additional Prompt</p>
          </div>
          <div className="flex items-center gap-x-1">
            <ExpandIcon />
            <CopyIcon />
            <TrashIcon />
          </div>
        </div>
        <ContextViewer context={context} />
      </div>
    </div>
  )
}

export default PromptBar
