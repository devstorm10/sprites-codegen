import { Icon } from '@iconify/react'
import { BsCopy } from 'react-icons/bs'
import { FaRegTrashCan } from 'react-icons/fa6'

import { Card } from '@/components/ui/card'
import { useAppDispatch } from '@/store/store'
import { selectContext, updateContext } from '@/store/slices'
import { ContextNode } from '@/lib/types'
import EditableText from '@/common/EditableText'

type FlowProps = {
  context: ContextNode
}

const FlowItem: React.FC<FlowProps> = ({ context }) => {
  const dispatch = useAppDispatch()

  const { id, title } = context

  const handleTitleUpdate = (newTitle: string) => {
    dispatch(
      updateContext({
        id,
        newContext: {
          title: newTitle,
        },
      })
    )
  }

  const handleNewFlowClick = () => {
    dispatch(selectContext(id))
  }

  return (
    <Card className="flex items-center gap-x-3 px-3 py-2 rounded-full">
      <Icon icon="mage:stars-b" fontSize={16} onClick={handleNewFlowClick} />
      <EditableText
        text={title || ''}
        onChange={handleTitleUpdate}
        className="font-bold text-sm"
      />
      <div className="flex items-center gap-x-2 text-black/30 text-sm">
        <BsCopy />
        <FaRegTrashCan />
      </div>
    </Card>
  )
}

export default FlowItem
