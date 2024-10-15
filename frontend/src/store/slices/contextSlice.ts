import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import uuid from 'react-uuid'

import { ContextNode, Tab, Tag, Variable } from '@/lib/types'

const dummyContexts: ContextNode[] = [
  {
    id: 'default_context',
    type: 'group',
    title: 'Default Context',
    contexts: [],
  },
]

const dummyVariables: Variable[] = [
  {
    id: 'default_variable',
    name: 'relationshipStatus',
    value: '',
  },
  {
    id: 'secondary_variable',
    name: 'commercialStatus',
    value: '',
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

const dummyTabs: Tab[] = [
  {
    id: dummyContexts[0].id,
    title: 'Default Context',
    active: true,
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

export function searchContextsByKeyword(
  nodes: ContextNode[],
  keyword: string
): ContextNode[] {
  const result: ContextNode[] = []
  for (const node of nodes) {
    if (
      node.title?.includes(keyword) ||
      (node.data && node.data.content && node.data.content.includes(keyword))
    ) {
      result.push({
        id: node.id,
        type: node.type,
        title: node.title,
        data: node.data,
      })
    }

    if (node.contexts) {
      result.push(...searchContextsByKeyword(node.contexts, keyword))
    }
  }

  return result
}

interface ContextState {
  contexts: ContextNode[]
  activeId: string | null
  selectedId: string | null
  variables: Variable[]
  tags: Tag[]
  tabs: Tab[]
}

const initialState: ContextState = {
  contexts: dummyContexts,
  activeId: dummyContexts[0].id,
  selectedId: null,
  variables: dummyVariables,
  tags: dummyTags,
  tabs: dummyTabs,
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
    createFlow: (state: ContextState) => {
      const newContext: ContextNode = {
        id: uuid(),
        type: 'flow',
        title: 'Flow',
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
        flow: 3,
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
    updateTabs: (state: ContextState, action: PayloadAction<Tab[]>) => {
      state.tabs = action.payload
    },
    createActiveTab: (state: ContextState, action: PayloadAction<string>) => {
      const flowId = action.payload
      const flowContext = findContextNodeById(state.contexts, flowId)
      const flowTab = state.tabs.find((item) => item.id === flowId)
      if (!flowTab) {
        state.tabs.push({
          id: flowId,
          title: flowContext?.title || 'New flow',
          active: true,
        })
      }
      state.tabs = state.tabs.map((item) => ({
        ...item,
        active: item.id === flowId,
      }))
    },
    setActiveTab: (state: ContextState, action: PayloadAction<string>) => {
      state.tabs = state.tabs.map((item) => ({
        ...item,
        active: item.id === action.payload,
      }))
    },
  },
})

export const {
  createTextPrompt,
  createFlow,
  createNewTag,
  updateContext,
  selectContext,
  moveContext,
  updateTabs,
  createActiveTab,
  setActiveTab,
} = contextSlice.actions

export default contextSlice.reducer
