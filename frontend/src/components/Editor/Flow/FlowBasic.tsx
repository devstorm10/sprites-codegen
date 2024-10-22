import { memo } from 'react'
import { FaPlus } from 'react-icons/fa6'

import { SparkleIcon } from '@/components/icons/SparkleIcon'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import { CreateNode } from '@/lib/types'
import { Card } from '@/components/ui/card'
import EditableText from '@/common/EditableText'
// import AutoComplete from '@/common/Autocomplete'

const createItems: CreateNode[] = [
  {
    title: 'Text Prompt',
    name: 'text-prompt',
  },
  {
    title: 'Action',
    name: 'action',
  },
  {
    title: 'Variable',
    name: 'variable',
  },
  {
    title: 'Autofill with AI',
    name: 'autofill-with-ai',
  },
]

const FlowBasic: React.FC = () => {
  const handleItemClick = (name: string) => () => {
    switch (name) {
      case 'text-prompt':
        break
      case 'action':
        break
      case 'variable':
        break
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Card className="py-3 px-4 border border-[#EAEAEA] shadow-[0_0_16px_0px_rgba(0,0,0,0.08)] rounded-[20px] flex items-center gap-x-2">
        <EditableText text="Variable here" onChange={() => {}} />
        {/* <Select>
          <SelectTrigger className="py-1 px-4 w-[70px] rounded-[20px] !outline-none">
            <SelectValue placeholder="==" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equal">==</SelectItem>
            <SelectItem value="not-equal">!=</SelectItem>
          </SelectContent>
        </Select> */}
      </Card>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="py-3 px-4 flex items-center gap-x-2.5 rounded-[20px] text-secondary-100/50 text-sm font-medium border">
            <FaPlus size={14} />
            <p>Add new</p>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-60 shadow-[0_0_16px_rgba(0,0,0,0.04)] rounded-[12px]"
        >
          {createItems.map((item: CreateNode) => (
            <DropdownMenuItem
              key={item.name}
              className="flex items-center gap-x-2.5"
              onClick={handleItemClick(item.name)}
            >
              <SparkleIcon fontSize={18} />
              <span className="text-[14px] font-medium">{item.title}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default memo(FlowBasic)
