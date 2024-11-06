import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
  KeyboardEvent,
} from 'react'
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions'
import { Icon } from '@iconify/react'
import uuid from 'react-uuid'

import { useAppDispatch, useAppSelector } from '@/store/store'
import { createVariable, selectContext, updateContext } from '@/store/slices'
import { ContextNode } from '@/lib/types'

import defaultStyle from './defaultStyle'
import defaultMentionStyle from './defaultMentionStyle'

interface TextPromptProps {
  textPrompt: ContextNode
  isOnNode?: boolean
}

const TextPromptItem: React.FC<TextPromptProps> = ({
  textPrompt,
  isOnNode = false,
}) => {
  const dispatch = useAppDispatch()
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const variables = useAppSelector((state) => state.context.variables)

  const { id, data } = textPrompt
  const editorRef = useRef<HTMLInputElement>(null)
  const [isEditing, setEditing] = useState<boolean>(false)
  const [inputSuggestion, setInputSuggestion] = useState<string>('')

  const totalVars = useMemo(
    () => [
      ...variables,
      { id: 'new_variable', name: inputSuggestion, value: '' },
    ],
    [variables, inputSuggestion]
  )

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
    if (!isEditing) {
      setEditing(true)
      if (!isOnNode) dispatch(selectContext(id))
    }
  }

  const varsToDisplay = useMemo(
    () =>
      totalVars
        .filter((v) => v.name)
        .map((variable) => ({
          id: variable.id,
          display: variable.name,
        })),
    [totalVars]
  )

  const renderVarSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      _search: string,
      _highlightedDisplay: React.ReactNode,
      _index: number,
      _focused: boolean
    ) => {
      return (
        <div
          className={
            'flex items-center justify-between cursor-pointer hover:bg-muted pr-2 p-1 rounded-[12px]'
          }
        >
          <div className="flex items-center gap-x-1">
            <Icon icon="ph:dots-six-vertical-light" fontSize={16} />
            <span className="rounded-sm px-1 text-[#319CFF] font-medium">
              {suggestion.display}
            </span>
          </div>
          <Icon icon="ph:dots-three-bold" fontSize={16} />
        </div>
      )
    },
    []
  )

  const renderSuggestionContainer = useCallback(
    (children: ReactNode) => (
      <div style={{ display: children ? 'block' : 'none' }} className="z-[100]">
        {children}
      </div>
    ),
    []
  )

  const displayTransformHandler = useCallback(
    (id: string, display: string) => {
      const variable = totalVars.find((item) => item.id === id)
      return `{{${variable?.name || display}}}`
    },
    [totalVars]
  )

  const handleEditorKeyUp = useCallback(() => {
    if (editorRef.current) {
      const currentCursor = editorRef.current.selectionStart || 0
      const textUpToCursor = editorRef.current.value.substring(0, currentCursor)
      const lastOpenBraceIndex = textUpToCursor.lastIndexOf('{{')
      if (lastOpenBraceIndex !== -1 && lastOpenBraceIndex < currentCursor) {
        const suggestion = textUpToCursor.substring(
          lastOpenBraceIndex + 2,
          currentCursor
        )
        if (suggestion.endsWith('}}')) {
          dispatch(
            createVariable({
              id: uuid(),
              name: suggestion.slice(0, suggestion.length - 2),
              value: '',
            })
          )
        }
        setInputSuggestion(suggestion)
      }
    }
  }, [editorRef])

  const handleMentionAdd = (id: string | number, display: string) => {
    if (id === 'new_variable' && display) {
      dispatch(
        createVariable({
          id: uuid(),
          name: display,
          value: '',
        })
      )
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') {
      e.stopPropagation()
    }
  }

  useEffect(() => {
    if (isOnNode) return
    if (id === selectedContextId) {
      setEditing(true)
    } else if (isEditing) {
      setEditing(false)
    }
  }, [id, selectedContextId, isEditing, isOnNode])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.addEventListener('keyup', handleEditorKeyUp)
    }
    return () => {
      if (editorRef.current) {
        editorRef.current.removeEventListener('keyup', handleEditorKeyUp)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        if (isEditing) {
          setEditing(false)
          if (!isOnNode) dispatch(selectContext(null))
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editorRef, isEditing, isOnNode])

  return (
    <div className="grow" onKeyDownCapture={handleKeyDown}>
      <MentionsInput
        inputRef={editorRef}
        style={defaultStyle(isEditing, !!data?.content, isOnNode)}
        customSuggestionsContainer={renderSuggestionContainer}
        value={
          (data && data.content) ||
          (isEditing ? '' : 'Write something or press ‘/’ for commands')
        }
        allowSuggestionsAboveCursor={true}
        onChange={handleTextUpdate}
        onFocus={handleTextEdit}
        spellCheck={false}
      >
        <Mention
          markup="{{__display__}}"
          trigger="{{"
          data={varsToDisplay}
          renderSuggestion={renderVarSuggestion}
          displayTransform={displayTransformHandler}
          style={defaultMentionStyle}
          onAdd={handleMentionAdd}
        />
      </MentionsInput>
    </div>
  )
}

export default TextPromptItem
