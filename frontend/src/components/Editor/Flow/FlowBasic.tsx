import { memo, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'

import AutoVarComplete from '@/common/AutoVarComplete'
import { Card } from '@/components/ui/card'
import { SparkleIcon } from '@/components/icons/SparkleIcon'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useAppSelector } from '@/store/store'
import { CreateNode } from '@/lib/types'

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

const optItems: string[] = ['==', '!=', '>', '<', '>=', '<=']

const FlowBasic: React.FC = () => {
  const variables = useAppSelector((state) => state.context.variables)
  const [varname, setVarname] = useState<string>('')
  const [varvalue, setVarvalue] = useState<string>('')

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
      <Card className="py-3 px-4 border border-[#EAEAEA] shadow-[0_0_16px_0px_rgba(0,0,0,0.08)] rounded-[20px] flex items-end justify-center gap-x-2">
        <AutoVarComplete
          varname={varname}
          suggestions={variables}
          onFocus={() => {}}
          onVarChange={setVarname}
        />
        <Select>
          <SelectTrigger className="py-1 px-4 w-[70px] rounded-[20px] !outline-none">
            <SelectValue placeholder="==" />
          </SelectTrigger>
          <SelectContent>
            {optItems.map((item) => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="value"
          value={varvalue}
          onChange={(e) => setVarvalue(e.target.value)}
          className="w-[75px] py-0.5 !px-0 focus-visible:ring-0 outline-none text-sm text-center font-medium leading-none rounded-[20px]"
        />
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
