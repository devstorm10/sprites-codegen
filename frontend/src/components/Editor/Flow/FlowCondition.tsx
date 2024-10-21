import { memo } from 'react'
import { Handle, Position } from 'reactflow'

import EditableText from '@/common/EditableText'
import { FlowNodeData } from '@/lib/types'
import './FlowCondition.css'

type FlowConditionProps = {
  data: FlowNodeData
}

const FlowCondition: React.FC<FlowConditionProps> = ({ data }) => {
  return (
    <div className="flex flex-col gap-y-2">
      <EditableText
        text={(data.content && data.content.condition) || 'Condition text here'}
        onChange={() => {}}
        className="w-full whitespace-normal overflow-visible !text-wrap"
      />

      <div className="flex flex-col gap-y-2 font-semibold">
        <div className="py-3 px-4 rounded-[20px] border border-[#00AF46] flex items-center justify-between">
          <p>YES</p>
          <span className="relative">
            <Handle
              id="a"
              type="source"
              position={Position.Right}
              className="absolute !bg-[#319CFF] border border-[#319CFF] w-2 h-2"
            />
          </span>
        </div>
        <div className="py-3 px-4 rounded-[20px] border border-[#FF0000] flex items-center justify-between">
          <p>NO</p>
          <span className="relative">
            <Handle
              id="b"
              type="source"
              position={Position.Right}
              className="absolute border border-[#319CFF] !bg-white w-2 h-2"
            />
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(FlowCondition)
