import { useState, useCallback } from 'react'
import {
  AutocompletePure,
  AutocompletePureProps,
  RenderItem,
  RenderInput,
  RenderContainer,
} from 'react-autocomplete-pure'
import { Icon } from '@iconify/react'

import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tag } from '@/lib/types'

const renderItem: RenderItem<Tag> = (item) => (
  <div className="flex items-center justify-between cursor-pointer">
    <div className="flex items-center gap-x-2">
      <Icon icon="ph:dots-six-vertical-light" fontSize={16} />
      <span className="rounded-sm">{item.title}</span>
    </div>
    <Icon icon="ph:dots-three-bold" fontSize={16} />
  </div>
)

const renderInput: RenderInput = (props) => (
  <Input
    placeholder="Search or create new tag"
    className="w-[200px] py-1 px-4 border-none focus-visible:ring-0 outline-none rounded-full bg-secondary-200 text-medium mb-2"
    {...props}
  />
)

const renderContainer: RenderContainer = ({ list }) => (
  <Card className="py-2 px-1 relative">{list}</Card>
)

const getSuggestionValue = (item: Tag) => item.title

interface AutoCompleteProps {
  suggestions: Tag[]
  onComplete: (item: Tag) => void
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  onComplete,
  suggestions: initialSuggestions,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [value, setValue] = useState<string>('')
  const [suggestions, setSuggestions] = useState<Tag[]>([])

  const handleChange: AutocompletePureProps<Tag>['onChange'] = useCallback(
    (_event, { value, reason }) => {
      setValue(value)
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
    [initialSuggestions]
  )

  const handleSelect: AutocompletePureProps<Tag>['onSelect'] = useCallback(
    (_event, { item }) => {
      const value = getSuggestionValue(item)
      setValue(value)
      setIsOpen(false)
      onComplete(item)
    },
    []
  )

  const handleClickOutside = (_event: Event) => {
    setIsOpen(false)
  }

  return (
    <AutocompletePure
      open={isOpen}
      value={value}
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
