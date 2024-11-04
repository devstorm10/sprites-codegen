import { useNavigate, useParams } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import EditableText from '@/common/EditableText'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { SparkleIcon } from '@/components/icons/SparkleIcon'
import { EditIcon } from '@/components/icons/EditIcon'
import { useAppDispatch } from '@/store/store'
import { updateContext } from '@/store/slices'
import { ContextNode } from '@/lib/types'
import { getAgentUrl } from '@/lib/utils'

type FlowProps = {
  context: ContextNode
}

const FlowItem: React.FC<FlowProps> = ({ context }) => {
  const { project_id } = useParams()
  const navigate = useNavigate()
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
    navigate(getAgentUrl(project_id || '', id))
  }

  return (
    <Card className="px-5 py-2 flex items-center gap-x-3">
      <SparkleIcon fontSize={20} />
      <EditableText
        text={title || ''}
        onChange={handleTitleUpdate}
        className="font-bold"
      />
      <div className="flex items-center gap-x-2 text-secondary-100/50">
        <EditIcon onClick={handleNewFlowClick} />
        <CopyIcon />
        <TrashIcon />
      </div>
    </Card>
  )
}

export default FlowItem
