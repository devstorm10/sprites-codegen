import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react'
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions'
import { Icon } from '@iconify/react'

import { useAppDispatch, useAppSelector } from '@/store/store'
import { selectContext, updateContext } from '@/store/slices'
import { ContextNode } from '@/lib/types'

import defaultStyle from './defaultStyle'
import defaultMentionStyle from './defaultMentionStyle'

interface TextPromptProps {
  textPrompt: ContextNode
}

const TextPromptItem: React.FC<TextPromptProps> = ({ textPrompt }) => {
  const dispatch = useAppDispatch()
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const variables = useAppSelector((state) => state.context.variables)

  const { id, data } = textPrompt
  const editorRef = useRef<HTMLInputElement>(null)
  const [isEditing, setEditing] = useState<boolean>(false)

  const handleTextUpdate = (event: { target: { value: string } }) => {
    dispatch(
      updateContext({
        id,
        newContext: {
          data: {
            content: event.target.value,
          },
        },
      })
    )
  }

  const handleTextEdit = () => {
    setEditing(true)
    dispatch(selectContext(id))
  }

  const varsToDisplay = useMemo(() => {
    return variables.map((variable) => ({
      id: variable.id,
      display: variable.name,
    }))
  }, [variables])

  const renderVarSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focused: boolean
    ) => {
      const variable = variables[index]
      return (
        <div className="flex items-center justify-between cursor-pointer hover:bg-muted pr-2 p-1">
          <div className="flex items-center gap-x-1">
            <Icon icon="ph:dots-six-vertical-light" fontSize={16} />
            <span className="rounded-sm px-1 text-sm">{variable.name}</span>
          </div>
          <Icon icon="ph:dots-three-bold" fontSize={16} />
        </div>
      )
    },
    [variables]
  )

  const renderSuggestionContainer = (children: ReactNode) => (
    <div>{children}</div>
  )

  const displayTransformHandler = useCallback(
    (id: string, display: string) => {
      const variable = variables.find((item) => item.id === id)
      return `{{${variable?.name || display}}}`
    },
    [variables]
  )

  useEffect(() => {
    if (id === selectedContextId) {
      setEditing(true)
    } else {
      setEditing(false)
    }
  }, [id, selectedContextId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        if (isEditing) {
          setEditing(false)
          dispatch(selectContext(null))
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editorRef, isEditing])

  return (
    <div className="grow">
      <MentionsInput
        inputRef={editorRef}
        style={defaultStyle(isEditing)}
        customSuggestionsContainer={renderSuggestionContainer}
        value={
          (data && data.content) || (isEditing ? '' : 'Write something here')
        }
        allowSuggestionsAboveCursor={true}
        onChange={handleTextUpdate}
        onFocus={handleTextEdit}
      >
        <Mention
          markup="{{__display__}}"
          trigger="{{"
          data={varsToDisplay}
          renderSuggestion={renderVarSuggestion}
          displayTransform={displayTransformHandler}
          style={defaultMentionStyle}
        />
      </MentionsInput>
    </div>
  )
}

export default TextPromptItem
