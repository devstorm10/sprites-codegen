import { useState, useCallback, useEffect, forwardRef, useMemo } from 'react'
import {
  AutocompletePure,
  AutocompletePureProps,
  RenderItem,
  RenderInput,
  RenderContainer,
} from 'react-autocomplete-pure'
import { Icon } from '@iconify/react'
import uuid from 'react-uuid'

import { Card } from '@/components/ui/card'
import { Input, InputProps } from '@/components/ui/input'
import { useAppDispatch } from '@/store/store'
import { createVariable } from '@/store/slices'
import { Variable } from '@/lib/types'
import { cn } from '@/lib/utils'

const renderItem: (
  handleVarUpdate: (item: Variable) => void
) => RenderItem<Variable> =
  (handleVarUpdate) =>
  (item: Variable, { isHighlighted }) => {
    useEffect(() => {
      if (isHighlighted) {
        handleVarUpdate(item)
      }
    }, [isHighlighted])

    return (
      <div
        className={cn(
          'flex items-center justify-between cursor-pointer hover:bg-muted pr-2 p-1',
          { 'bg-muted': isHighlighted }
        )}
      >
        <div className="flex items-center gap-x-1">
          <Icon icon="ph:dots-six-vertical-light" fontSize={16} />
          <span className="rounded-sm px-1 font-medium">{item.name}</span>
        </div>
      </div>
    )
  }

const getSuggestionValue = (item: Variable) => item?.name || ''

const AutoCompleteInput = forwardRef<
  HTMLInputElement,
  InputProps & {
    selected: Variable | undefined
    title: string
    onInputFocus: (e: any) => void
    inputClass?: string
  }
>((props, ref) => {
  const { selected, title, onInputFocus, inputClass, ...rest } = props
  return (
    <Input
      ref={ref}
      placeholder="name"
      className={cn(
        'w-[75px] py-0.5 !px-0 focus-visible:!ring-0 outline-none text-sm text-center font-medium leading-none rounded-[20px] text-[#0B99FF]',
        inputClass
      )}
      onClick={onInputFocus}
      autoFocus
      {...rest}
    />
  )
})

interface AutoCompleteProps {
  varname: string
  suggestions: Variable[]
  onFocus: (e: any) => void
  onVarChange: (tilte: string) => void
  className?: string
  inputClass?: string
  containerClass?: string
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  varname,
  suggestions: initialSuggestions,
  onFocus,
  onVarChange,
  className = '',
  inputClass = '',
  containerClass = '',
}) => {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<Variable[]>(initialSuggestions)
  const [selected, setSelected] = useState<Variable | undefined>()
  const [focusedItem, setFocusedItem] = useState<Variable>()

  useEffect(() => {
    setSelected(initialSuggestions.find((item) => item.name === varname))
  }, [varname, initialSuggestions])

  const handleChange: AutocompletePureProps<Variable>['onChange'] = useCallback(
    (_event, { value, reason }) => {
      const newVarname = _event.currentTarget.value
      if (reason === 'INPUT') {
        const filteredVars = initialSuggestions.filter((item) =>
          item.name.toLowerCase().includes(newVarname.toLowerCase())
        )
        setIsOpen(filteredVars.length > 0)
        setSuggestions(filteredVars)
        setFocusedItem(
          initialSuggestions.find((item) => item.name === newVarname)
        )
        onVarChange(value)
      } else if (reason === 'ENTER') {
        if (focusedItem) {
          onVarChange(focusedItem.name)
        } else {
          dispatch(
            createVariable({
              id: uuid(),
              name: newVarname,
              value: '',
            })
          )
        }
        setIsOpen(false)
      }
    },
    [initialSuggestions, focusedItem, onVarChange]
  )

  const handleSelect: AutocompletePureProps<Variable>['onSelect'] = useCallback(
    (_event, { item }) => {
      const value = getSuggestionValue(item)
      onVarChange(value)
      setIsOpen(false)
    },
    [initialSuggestions, onVarChange]
  )

  const handleClickOutside = (_event: Event) => {
    if (!varname) setIsOpen(false)
  }

  const handleInputFocus = (event: any) => {
    setIsOpen(suggestions.length > 0)
    onFocus(event)
  }

  const handleVarUpdate = (item: Variable) => {
    setFocusedItem(item)
  }

  const renderInput: RenderInput = useMemo(
    () => (props) => (
      <AutoCompleteInput
        title={varname}
        selected={selected}
        onInputFocus={handleInputFocus}
        inputClass={inputClass}
        {...props}
      />
    ),
    [selected, varname, inputClass]
  )

  const renderContainer: RenderContainer = useMemo(
    () =>
      ({ list }) => (
        <Card
          className={cn(
            'py-1 absolute z-50 min-w-[200px] rounded-[12px] mt-2',
            containerClass
          )}
        >
          {list}
        </Card>
      ),
    [containerClass]
  )

  return (
    <AutocompletePure
      open={isOpen}
      value={varname}
      items={suggestions}
      onChange={handleChange}
      onSelect={handleSelect}
      onClickOutside={handleClickOutside}
      renderItem={renderItem(handleVarUpdate)}
      renderInput={renderInput}
      renderContainer={renderContainer}
      getSuggestionValue={getSuggestionValue}
      className={className}
    />
  )
}

export default AutoComplete
