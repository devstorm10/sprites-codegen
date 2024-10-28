import AutoVarComplete from '@/common/AutoVarComplete'
import { VariableType } from '@/components/Editor/Flow/FlowTrigger'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppSelector } from '@/store/store'
import { cn } from '@/lib/utils'

const optItems: string[] = ['==', '!=', '>', '<', '>=', '<=']

type VariableInputProps = {
  variable: VariableType
  onVarChange: (value: VariableType) => void
  className?: string
}

const VariableInput: React.FC<VariableInputProps> = ({
  variable,
  onVarChange,
  className = '',
}) => {
  const variables = useAppSelector((state) => state.context.variables)

  return (
    <div className={cn('flex', className)}>
      <AutoVarComplete
        varname={variable.name}
        suggestions={variables}
        onFocus={() => {}}
        onVarChange={(name) => onVarChange({ ...variable, name })}
        className="grow rounded-[20px] text-[#0B99FF] focus-visible:ring-0 text-center"
      />
      <Select
        value={variable.opt}
        onValueChange={(opt) => onVarChange({ ...variable, opt })}
      >
        <SelectTrigger className="py-1 px-4 w-[70px] rounded-[20px] !outline-none">
          <SelectValue placeholder="==" />
        </SelectTrigger>
        <SelectContent>
          {optItems.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="value"
        value={variable.value}
        onChange={(e) => onVarChange({ ...variable, value: e.target.value })}
        className="grow py-0.5 !px-0 focus-visible:ring-0 outline-none text-sm text-center font-medium leading-none rounded-[20px] text-[#0B99FF]"
      />
    </div>
  )
}

export default VariableInput
export { optItems }
