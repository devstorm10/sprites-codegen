import { useState, useCallback, useEffect, forwardRef, useMemo } from 'react'
import {
  AutocompletePure,
  AutocompletePureProps,
  RenderItem,
  RenderInput,
  RenderContainer,
} from 'react-autocomplete-pure'
import { Icon } from '@iconify/react'

import { Card } from '@/components/ui/card'
import { Input, InputProps } from '@/components/ui/input'
import { Tag } from '@/lib/types'

const renderItem: RenderItem<Tag> = (item) => (
  <div className="flex items-center justify-between cursor-pointer hover:bg-muted pr-2 p-1">
    <div className="flex items-center gap-x-1">
      <Icon icon="ph:dots-six-vertical-light" fontSize={16} />
      <span
        className="rounded-sm px-1 text-sm"
        style={{
          backgroundColor: item.color,
        }}
      >
        {item.title}
      </span>
    </div>
    <Icon icon="ph:dots-three-bold" fontSize={16} />
  </div>
)

const renderContainer: RenderContainer = ({ list }) => (
  <Card className="py-1 absolute min-w-[200px] rounded-lg mt-2">{list}</Card>
)

const getSuggestionValue = (item: Tag) => item.title

const AutoCompleteInput = forwardRef<
  HTMLInputElement,
  InputProps & {
    selected: Tag | undefined
    title: string
    onInputFocus: (e: any) => void
  }
>((props, ref) => {
  const { selected, title, onInputFocus, ...rest } = props
  return (
    <Input
      ref={ref}
      placeholder="Search or create new tag"
      className="w-[200px] py-2 px-4 border-none focus-visible:ring-0 outline-none rounded-full text-medium text-sm h-auto leading-none"
      style={{
        backgroundColor:
          selected && selected.title === title ? selected.color : '#f5f5f5',
      }}
      autoFocus
      onClick={onInputFocus}
      {...rest}
    />
  )
})

interface AutoCompleteProps {
  tagContextId: string
  tagTitle: string
  suggestions: Tag[]
  hasFocus: boolean
  onFocus: (e: any) => void
  onTitleChange: (tilte: string) => void
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  tagContextId,
  tagTitle,
  suggestions: initialSuggestions,
  hasFocus,
  onFocus,
  onTitleChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<Tag[]>([])
  const [selected, setSelected] = useState<Tag | undefined>()

  useEffect(() => {
    if (hasFocus && tagContextId) {
      const inputElement = document.getElementById(`tag_${tagContextId}`)
      if (inputElement) {
        inputElement.focus()
      }
    }
  }, [hasFocus, tagContextId])

  useEffect(() => {
    setSelected(initialSuggestions.find((item) => item.title === tagTitle))
  }, [tagTitle])

  const handleChange: AutocompletePureProps<Tag>['onChange'] = useCallback(
    (_event, { value, reason }) => {
      onTitleChange(value)

      if (reason === 'INPUT') {
        const filteredTags = initialSuggestions.filter((tag) =>
          tag.title.toLowerCase().includes(value.toLowerCase())
        )
        setSuggestions(filteredTags)
        setIsOpen(Boolean(filteredTags.length))
      } else if (reason === 'ENTER') {
        setIsOpen(false)
      }
    },
    [initialSuggestions, onTitleChange]
  )

  const handleSelect: AutocompletePureProps<Tag>['onSelect'] = useCallback(
    (_event, { item }) => {
      const value = getSuggestionValue(item)
      onTitleChange(value)
      setIsOpen(false)
    },
    [onTitleChange]
  )

  const handleClickOutside = (_event: Event) => {
    setIsOpen(false)
  }

  const renderInput: RenderInput = useMemo(
    () => (props) => (
      <AutoCompleteInput
        id={`tag_${tagContextId}`}
        selected={selected}
        title={tagTitle}
        onInputFocus={onFocus}
        {...props}
      />
    ),
    [selected, tagTitle]
  )

  return (
    <AutocompletePure
      open={isOpen}
      value={tagTitle}
      items={suggestions}
      onChange={handleChange}
      onSelect={handleSelect}
      onClickOutside={handleClickOutside}
      renderItem={renderItem}
      renderInput={renderInput}
      renderContainer={renderContainer}
      getSuggestionValue={getSuggestionValue}
    />
  )
}

export default AutoComplete
