import { memo, useCallback, useMemo } from 'react'
import { useReactFlow } from 'reactflow'

import AutoVarComplete from '@/common/AutoVarComplete'
import PromptInput from '@/common/PromptInput'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppSelector } from '@/store/store'

const typeItems = [
  {
    title: 'Number',
    name: 'number',
  },
  {
    title: 'String',
    name: 'string',
  },
]

type ActionContent = {
  value?: string
  inference?: string
  vartype?: string
}

type FlowActionProps = {
  id: string
  data: {
    content: ActionContent
  }
}

const FlowAction: React.FC<FlowActionProps> = ({ id, data }) => {
  const { setNodes } = useReactFlow()
  const variables = useAppSelector((state) => state.context.variables)

  const braceRemovedVar = useMemo(() => {
    const value = data.content.value
    if (value && value.startsWith('{{') && value.endsWith('}}')) {
      return value.slice(2, value.length - 2)
    }
    return value || ''
  }, [data.content.value])

  const handleDataUpdate = useCallback(
    (data: ActionContent) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  content: {
                    ...node.data.content,
                    ...data,
                  },
                },
              }
            : node
        )
      )
    },
    [id]
  )

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-1">
        <p>Update Value</p>
        <Card className="py-3 px-4 flex items-end gap-x-2">
          <AutoVarComplete
            varname={braceRemovedVar}
            suggestions={variables}
            onFocus={() => {}}
            onVarChange={(variable) =>
              handleDataUpdate({ ...data, value: `{{${variable}}}` })
            }
            className="grow !border-none !shadow-none !outline-none !ring-0 p-0 w-full text-left h-auto"
            inputClass="p-0"
            containerClass="w-[75px]"
          />
        </Card>
      </div>
      <div className="flex flex-col gap-y-1">
        <p>Inference</p>
        <Card className="py-3 px-4 flex items-end justify-center gap-x-2">
          <PromptInput
            text={data.content.inference || ''}
            placeholder="On scale of 1-5, how satisfied does the user sound?"
            onChange={(text) =>
              handleDataUpdate({ ...data.content, inference: text })
            }
            className="!text-wrap"
          />
        </Card>
      </div>
      <div className="flex flex-col gap-y-1">
        <p>Variable Type</p>
        <Select
          value={data.content.vartype || ''}
          onValueChange={(type) =>
            handleDataUpdate({ ...data.content, vartype: type })
          }
        >
          <SelectTrigger className="py-5 px-4 rounded-[20px] !outline-none">
            <SelectValue placeholder="Number" />
          </SelectTrigger>
          <SelectContent>
            {typeItems.map((item) => (
              <SelectItem key={item.name} value={item.name}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default memo(FlowAction)
