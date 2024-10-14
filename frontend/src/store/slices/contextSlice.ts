import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import uuid from 'react-uuid'

import { ContextNode, Tag } from '@/lib/types'

const dummyContexts: ContextNode[] = [
  {
    id: 'default_context',
    type: 'group',
    title: 'Default Context',
    contexts: [
      {
        id: 'text_prompt',
        type: 'input',
        title: 'Text prompt',
      },
    ],
  },
]

const dummyTags: Tag[] = [
  {
    id: 'core_memory',
    title: 'Core memory',
    color: '#0b99ff4d',
  },
  {
    id: 'basic_knowledge',
    title: 'Basic knowledge',
    color: '#0bff6f4d',
  },
  {
    id: 'character_trait',
    title: 'Character trait',
    color: '#ff7b0b4d',
  },
]

export function findContextNodeById(
  nodes: ContextNode[],
  id: string
): ContextNode | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }

    if (node.contexts) {
      const result = findContextNodeById(node.contexts, id)
      if (result) {
        return result
      }
    }
  }

  return null
}

export function findParentContextNodeById(
  nodes: ContextNode[],
  id: string
): ContextNode | null {
  for (const node of nodes) {
    if (node.contexts) {
      const result = node.contexts.find((context) => context.id === id)
      if (result) return node

      const recResult = findParentContextNodeById(node.contexts, id)
      if (recResult) return recResult
    }
  }

  return null
}

interface ContextState {
  contexts: ContextNode[]
  activeId: string | null
  selectedId: string | null
  tags: Tag[]
}

const initialState: ContextState = {
  contexts: dummyContexts,
  activeId: dummyContexts[0].id,
  selectedId: null,
  tags: dummyTags,
}

const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    createTextPrompt: (state: ContextState) => {
      const newContext: ContextNode = {
        id: uuid(),
        type: 'input',
        title: 'Text prompt',
      }
      const contextGroup = state.contexts.find(
        (context) => context.id === state.activeId
      )
      if (contextGroup) {
        contextGroup.contexts?.push(newContext)
      }
    },
    createNewTag: (state: ContextState, action: PayloadAction<string>) => {
      const targetContext = findContextNodeById(state.contexts, action.payload)
      if (targetContext) {
        const newTagContext: ContextNode = {
          id: uuid(),
          type: 'tag',
          title: 'Tag',
          data: {},
          contexts: [{ ...targetContext }],
        }
        Object.assign(targetContext, newTagContext)
      }
    },
    updateContext: (
      state: ContextState,
      action: PayloadAction<{ id: string; newContext: Partial<ContextNode> }>
    ) => {
      const targetContext = findContextNodeById(
        state.contexts,
        action.payload.id
      )
      if (targetContext) {
        Object.assign(targetContext, {
          ...targetContext,
          ...action.payload.newContext,
        })
      }
    },
    selectContext: (
      state: ContextState,
      action: PayloadAction<string | null>
    ) => {
      state.selectedId = action.payload
    },
    moveContext: (
      state: ContextState,
      action: PayloadAction<{ source: string; target: string }>
    ) => {
      const { source, target } = action.payload
      const sourceItem = findContextNodeById(state.contexts, source)
      const targetItem = findContextNodeById(state.contexts, target)
      const sourceParent = findParentContextNodeById(state.contexts, source)
      const targetParent = findParentContextNodeById(state.contexts, target)
      if (!sourceItem || !targetItem) return
      const priority = {
        group: 1,
        tag: 2,
        input: 3,
      }
      if (priority[sourceItem.type] > priority[targetItem.type]) {
        if (sourceParent && targetParent) {
          targetItem.contexts = [...(targetItem.contexts || []), sourceItem]
          sourceParent.contexts = sourceParent.contexts?.filter(
            (context) => context.id !== source
          )
        }
      } else if (priority[sourceItem.type] === priority[targetItem.type]) {
        if (
          sourceParent &&
          targetParent &&
          sourceParent.contexts &&
          targetParent.contexts
        ) {
          const sourceIndex = sourceParent.contexts.findIndex(
            (context) => context.id === sourceItem.id
          )
          const targetIndex = targetParent.contexts.findIndex(
            (context) => context.id === targetItem.id
          )
          if (sourceIndex !== -1 && targetIndex !== -1) {
            const [movedItem] = sourceParent.contexts.splice(sourceIndex, 1)
            targetParent.contexts.splice(targetIndex, 0, movedItem)
          }
        }
      }
    },
  },
})

export const {
  createTextPrompt,
  createNewTag,
  updateContext,
  selectContext,
  moveContext,
} = contextSlice.actions

export default contextSlice.reducer
