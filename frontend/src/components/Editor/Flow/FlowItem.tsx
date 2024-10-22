import { Card } from '@/components/ui/card'
import { useAppDispatch } from '@/store/store'
import { selectContext, updateContext } from '@/store/slices'
import { ContextNode } from '@/lib/types'
import EditableText from '@/common/EditableText'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { SparkleIcon } from '@/components/icons/SparkleIcon'

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
    <Card className="px-5 py-2 flex items-center gap-x-3 border border-[#EAEAEA] shadow-[0_0_16px_0px_rgba(0,0,0,0.08)] rounded-[20px]">
      <SparkleIcon fontSize={20} onClick={handleNewFlowClick} />
      <EditableText
        text={title || ''}
        onChange={handleTitleUpdate}
        className="font-bold"
      />
      <div className="flex items-center gap-x-2 text-secondary-100/50">
        <CopyIcon />
        <TrashIcon />
      </div>
    </Card>
  )
}

export default FlowItem
