import { useState, useCallback, useEffect, forwardRef, useMemo } from 'react'
import { ColorResult, SketchPicker } from 'react-color'
import {
  AutocompletePure,
  AutocompletePureProps,
  RenderItem,
  RenderInput,
  RenderContainer,
} from 'react-autocomplete-pure'
import { Icon } from '@iconify/react'
import uuid from 'react-uuid'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Card } from '@/components/ui/card'
import { Input, InputProps } from '@/components/ui/input'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { useAppDispatch } from '@/store/store'
import { createTagItem, deleteTagItem, updateTagItem } from '@/store/slices'
import { Tag } from '@/lib/types'
import { BsPalette } from 'react-icons/bs'
import { cn } from '@/lib/utils'

const randomColor = () => Math.floor(Math.random() * 256)

const randomRgb = () =>
  `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`

const renderItem: (
  onTagUpdate: (id: string, color: string) => void,
  onTagDelete: (id: string) => void,
  onTagFocus: (item: Tag) => void
) => RenderItem<Tag> =
  (onTagUpdate, onTagDelete, onTagFocus) =>
  (item: Tag, { isHighlighted }) => {
    const [isMenuOpen, setMenuOpen] = useState<boolean>(false)
    const [isPickerOpen, setPickerOpen] = useState<boolean>(false)
    const [color, setColor] = useState<string>(item.color)

    const handleChangeComplete = (color: ColorResult) => {
      onTagUpdate(item.id, color.hex)
    }

    const handleDeleteClick = () => {
      onTagDelete(item.id)
    }

    useEffect(() => {
      if (isHighlighted) {
        onTagFocus(item)
      }
    }, [isHighlighted, item])

    return (
      <div
        className={cn(
          'flex items-center justify-between cursor-pointer hover:bg-muted pr-2 p-1',
          { 'bg-muted': isHighlighted }
        )}
      >
        <div className="flex items-center gap-x-1">
          <Icon icon="ph:dots-six-vertical-light" fontSize={16} />
          <span
            className="rounded-sm px-1 font-medium"
            style={{
              backgroundColor: item.color,
            }}
          >
            {item.title}
          </span>
        </div>
        <DropdownMenu open={isMenuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger>
            <span
              className="h-5 w-5 rounded hover:bg-accent hover:text-accent-foreground"
              onClick={(event) => {
                event.stopPropagation()
                setMenuOpen(true)
              }}
            >
              <Icon icon="ph:dots-three-bold" fontSize={16} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="center"
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <DropdownMenuSub open={isPickerOpen} onOpenChange={setPickerOpen}>
              <DropdownMenuSubTrigger>
                <div className="flex items-center gap-x-1">
                  <span className="w-5 h-5 flex items-center justify-center opacity-30">
                    <BsPalette />
                  </span>
                  <span>Color</span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent onMouseLeave={() => setPickerOpen(false)}>
                <SketchPicker
                  color={color}
                  onChange={(color) => setColor(color.hex)}
                  onChangeComplete={handleChangeComplete}
                  className="!shadow-none"
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="flex items-center gap-x-1"
              >
                <TrashIcon />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

const renderContainer: RenderContainer = ({ list }) => (
  <Card className="py-1 absolute z-50 min-w-[200px] rounded-[12px] mt-2 shadow-[0_0_16px_rgba(0,0,0,0.04)]">
    {list}
  </Card>
)

const getSuggestionValue = (item: Tag) => item?.title || ''

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
      className="w-[200px] py-2 px-4 border-none focus-visible:ring-0 outline-none rounded-full text-[16px] font-medium h-auto leading-none"
      style={{
        backgroundColor:
          selected && selected.title === title ? selected.color : '#f5f5f5',
      }}
      onClick={onInputFocus}
      autoFocus
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
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [tagId, setTagId] = useState<string>(uuid())
  const [tagColor, setTagColor] = useState<string>(randomRgb())
  const [suggestions, setSuggestions] = useState<Tag[]>(initialSuggestions)
  const [selected, setSelected] = useState<Tag | undefined>()
  const [focusedItem, setFocusedItem] = useState<Tag>()

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
  }, [tagTitle, initialSuggestions])

  const handleChange: AutocompletePureProps<Tag>['onChange'] = useCallback(
    (_event, { value, reason }) => {
      const tagTitle = _event.currentTarget.value
      if (reason === 'INPUT') {
        const filteredTags = initialSuggestions.filter((tag) =>
          tag.title.toLowerCase().includes(value.toLowerCase())
        )
        setSuggestions(filteredTags)
        setIsOpen(filteredTags.length > 0)
        onTitleChange(tagTitle)
        setFocusedItem(
          initialSuggestions.find((item) => item.title === tagTitle)
        )
      } else if (reason === 'ENTER') {
        if (focusedItem) {
          onTitleChange(focusedItem.title)
        } else {
          dispatch(
            createTagItem({
              id: tagId,
              color: tagColor,
              title: tagTitle,
            })
          )
          setTagId(uuid())
          setTagColor(randomRgb())
        }
        setIsOpen(false)
      }
    },
    [initialSuggestions, focusedItem, onTitleChange]
  )

  const handleSelect: AutocompletePureProps<Tag>['onSelect'] = useCallback(
    (_event, { item }) => {
      const value = getSuggestionValue(item)
      const tagItem = initialSuggestions.find((item) => item.title === value)
      if (!tagItem) {
        dispatch(createTagItem(item))
        setTagId(uuid())
        setTagColor(randomRgb())
      }
      onTitleChange(value)
      setIsOpen(false)
    },
    [initialSuggestions, onTitleChange]
  )

  const handleTagUpdate = (id: string, color: string) => {
    setSuggestions(
      suggestions.map((item) => (item.id === id ? { ...item, color } : item))
    )
    dispatch(updateTagItem({ id, tag: { color } }))
  }

  const handleTagDelete = (id: string) => {
    setSuggestions(suggestions.filter((item) => item.id !== id))
    dispatch(deleteTagItem(id))
  }

  const handleTagFocus = (item: Tag) => {
    setFocusedItem(item)
  }

  const handleClickOutside = (_event: Event) => {
    if (!tagTitle) setIsOpen(false)
  }

  const handleInputFocus = (event: any) => {
    setIsOpen(suggestions.length > 0)
    onFocus(event)
  }

  const renderInput: RenderInput = useMemo(
    () => (props) => (
      <AutoCompleteInput
        id={`tag_${tagContextId}`}
        selected={selected}
        title={tagTitle}
        onInputFocus={handleInputFocus}
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
      renderItem={renderItem(handleTagUpdate, handleTagDelete, handleTagFocus)}
      renderInput={renderInput}
      renderContainer={renderContainer}
      getSuggestionValue={getSuggestionValue}
    />
  )
}

export default AutoComplete
