import { memo, useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import { FaPlus } from 'react-icons/fa6'

import PromptInput from '@/common/PromptInput'
import { Card } from '@/components/ui/card'

type FlowInsertLineProps = {
  id: string
  data: {
    content: {
      items: string[]
    }
  }
}

const FlowInsertLine: React.FC<FlowInsertLineProps> = ({ id, data }) => {
  const { setNodes } = useReactFlow()

  const handleLineCreate = () => {
    const newData = {
      ...data,
      content: {
        ...data.content,
        items: [...data.content.items, ''],
      },
    }

    setNodes((prvNodes) =>
      prvNodes.map((node) =>
        node.id === id ? { ...node, data: newData } : node
      )
    )
  }

  const handleDataUpdate = useCallback(
    (data: string, idx: number) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  content: {
                    ...node.data.content,
                    items: node.data.content.items.map(
                      (item: string, index: number) =>
                        index === idx ? data : item
                    ),
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
      {data.content &&
        data.content.items &&
        data.content.items.map((line: string, idx: number) => (
          <Card
            key={idx}
            className="py-3 px-4 flex items-end justify-center gap-x-2"
          >
            <PromptInput
              text={line}
              placeholder="Start typing"
              onChange={(text) => handleDataUpdate(text, idx)}
              className="!text-wrap"
            />
          </Card>
        ))}
      <span
        className="py-3 px-4 flex items-center gap-x-2.5 rounded-[20px] text-secondary-100/50 text-sm font-medium border"
        onClick={handleLineCreate}
      >
        <FaPlus size={14} />
        <p>New Line</p>
      </span>
    </div>
  )
}

export default memo(FlowInsertLine)
