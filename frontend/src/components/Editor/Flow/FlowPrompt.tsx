import { memo } from 'react'

import FlowItem from './FlowItem'
import EditableText from '@/common/EditableText'
import { Card } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { findContextNodeById, updateContext } from '@/store/slices'

type FlowPromptProps = {
  id: string
}

const FlowPrompt: React.FC<FlowPromptProps> = ({ id }) => {
  const dispatch = useAppDispatch()
  const flowContext = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, id)
  )
  const childContexts = flowContext?.contexts || []

  const handlePromptChange = (id: string) => (value: string) => {
    dispatch(
      updateContext({
        id,
        newContext: {
          data: {
            content: value,
          },
        },
      })
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <p>Add prompt:</p>
        {childContexts.length > 0 &&
          childContexts.map((context) =>
            context.type === 'input' ? (
              <Card className="py-3 px-4 drop-shadow-[0_0_12px_0_rgba(0,0,0,0.25)]">
                <EditableText
                  text={
                    (context.data && context.data.content) || 'Prompt text here'
                  }
                  onChange={handlePromptChange(context.id)}
                  className="!text-wrap"
                />
              </Card>
            ) : context.type === 'flow' ? (
              <FlowItem context={context} />
            ) : (
              <></>
            )
          )}
      </div>
    </div>
  )
}

export default memo(FlowPrompt)
