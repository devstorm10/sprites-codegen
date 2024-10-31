import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import uuid from 'react-uuid'
import { Node } from 'reactflow'

import { ContextNode, FlowNodeData, Tab, Tag, Variable } from '@/lib/types'

const dummyContexts: ContextNode[] = [
  {
    id: 'default_context',
    type: 'group',
    title: 'Default Context',
    contexts: [],
  },
]

const dummyVariables: Variable[] = []

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
  {
    id: 'activities',
    title: 'Activities',
    color: '#FFD4F3',
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
      (node.title &&
        node.title.toLowerCase().includes(keyword.toLowerCase())) ||
      (node.data &&
        node.data.content &&
        node.data.content.toLowerCase().includes(keyword.toLowerCase()))
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

export function searchContextRoute(
  contexts: ContextNode[],
  id: string,
  routes: ContextNode[] = []
): ContextNode[] | null {
  for (const node of contexts) {
    const currentRoute = [...routes, node]
    if (node.id === id) return currentRoute
    if (node.contexts) {
      const result = searchContextRoute(node.contexts, id, currentRoute)
      if (result) return result
    }
  }
  return null
}

export function isTargetChildOfSource(
  source: ContextNode,
  target: string
): boolean {
  if (source.contexts) {
    for (const child of source.contexts) {
      if (child.id === target || isTargetChildOfSource(child, target)) {
        return true
      }
    }
  }
  return false
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
    createTextPrompt: (
      state: ContextState,
      action: PayloadAction<{ contextId: string; promptId?: string }>
    ) => {
      const { contextId, promptId } = action.payload
      const contextItem = findContextNodeById(state.contexts, contextId)
      if (contextItem) {
        const newContext: ContextNode = {
          id: promptId || uuid(),
          type: 'input',
          title: 'Text prompt',
        }
        contextItem.contexts = [...(contextItem.contexts || []), newContext]
      }
    },
    createVariablePrompt: (
      state: ContextState,
      action: PayloadAction<{ contextId: string }>
    ) => {
      const { contextId } = action.payload
      const contextItem = findContextNodeById(state.contexts, contextId)
      if (contextItem) {
        const newContext: ContextNode = {
          id: uuid(),
          type: 'variable',
          title: 'Text prompt',
        }
        contextItem.contexts = [...(contextItem.contexts || []), newContext]
      }
    },
    createFlow: (
      state: ContextState,
      action: PayloadAction<{
        contextId: string
        flowId: string
        title: string
        isRedirect?: boolean
      }>
    ) => {
      const { contextId, flowId, title, isRedirect = false } = action.payload
      const contextItem = findContextNodeById(state.contexts, contextId)
      const newContext: ContextNode = {
        id: flowId || uuid(),
        type: 'flow',
        title: title || 'New flow',
      }
      if (contextItem) {
        contextItem.contexts = [...(contextItem.contexts || []), newContext]
        if (isRedirect) state.selectedId = newContext.id
      }
    },
    createFlowNode: (
      state: ContextState,
      action: PayloadAction<{ id: string; node: Node<FlowNodeData> }>
    ) => {
      const flowItem = findContextNodeById(state.contexts, action.payload.id)
      if (flowItem) {
        const { node } = action.payload
        const newContext: ContextNode = {
          id: node.id,
          title: node.data.title,
          type: 'flow_node',
          data: node.data,
        }
        flowItem.contexts = [...(flowItem.contexts || []), newContext]
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
    createTagItem: (state: ContextState, action: PayloadAction<Tag>) => {
      state.tags.push(action.payload)
    },
    updateTagItem: (
      state: ContextState,
      action: PayloadAction<{ id: string; tag: Partial<Tag> }>
    ) => {
      state.tags = state.tags.map((tag) =>
        tag.id === action.payload.id ? { ...tag, ...action.payload.tag } : tag
      )
    },
    deleteTagItem: (state: ContextState, action: PayloadAction<string>) => {
      state.tags = state.tags.filter((tag) => tag.id === action.payload)
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
    activateContext: (state: ContextState, action: PayloadAction<string>) => {
      state.activeId = action.payload
    },
    moveContext: (
      state: ContextState,
      action: PayloadAction<{
        source: string
        target: string
      }>
    ) => {
      const { source, target } = action.payload
      const sourceItem = findContextNodeById(state.contexts, source)
      const targetItem = findContextNodeById(state.contexts, target)
      const sourceParent = findParentContextNodeById(state.contexts, source)
      const targetParent = findParentContextNodeById(state.contexts, target)
      if (
        !sourceItem ||
        !targetItem ||
        isTargetChildOfSource(sourceItem, targetItem.id)
      )
        return
      const priority = {
        group: 1,
        tag: 2,
        input: 3,
        variable: 3,
        flow: 3,
        flow_node: 4,
      }
      if (priority[sourceItem.type] > priority[targetItem.type]) {
        if (
          sourceParent &&
          sourceParent.type !== 'flow' &&
          sourceParent.type !== 'flow_node'
        ) {
          if (!targetItem.contexts?.find((item) => item.id === sourceItem.id)) {
            targetItem.contexts = [...(targetItem.contexts || []), sourceItem]
            sourceParent.contexts = sourceParent.contexts?.filter(
              (context) => context.id !== source
            )
          }
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
    deleteContext: (state: ContextState, action: PayloadAction<string>) => {
      const delItem = findContextNodeById(state.contexts, action.payload)
      const parentItem = findParentContextNodeById(
        state.contexts,
        action.payload
      )
      if (delItem) {
        if (parentItem) {
          parentItem.contexts = parentItem.contexts?.filter(
            (item) => item.id !== action.payload
          )
        } else {
          state.contexts = state.contexts.filter(
            (item) => item.id !== action.payload
          )
        }
      }
    },
    updateTabs: (state: ContextState, action: PayloadAction<Tab[]>) => {
      state.tabs = action.payload
    },
    closeTab: (state: ContextState, action: PayloadAction<string>) => {
      const tabId = action.payload
      if (tabId === state.activeId) return
      state.tabs = state.tabs
        .filter((item) => item.id !== action.payload)
        .map((item) =>
          item.id === state.activeId ? { ...item, active: true } : item
        )
      state.selectedId = state.activeId
    },
    createActiveTab: (
      state: ContextState,
      action: PayloadAction<{ id: string; title: string }>
    ) => {
      const { id, title } = action.payload
      const context = findContextNodeById(state.contexts, id)
      const tab = state.tabs.find((item) => item.id === id)
      if (!tab) {
        state.tabs.push({
          id,
          title: context?.title || title,
          active: true,
        })
      }
      state.tabs = state.tabs.map((item) => ({
        ...item,
        active: item.id === id,
      }))
    },
    setActiveTab: (state: ContextState, action: PayloadAction<string>) => {
      state.tabs = state.tabs.map((item) => ({
        ...item,
        active: item.id === action.payload,
      }))
    },
    createVariable: (state: ContextState, action: PayloadAction<Variable>) => {
      const variable = state.variables.find(
        (item) => item.name === action.payload.name
      )
      if (!variable) state.variables.push(action.payload)
    },
  },
})

export const {
  createTextPrompt,
  createVariablePrompt,
  createFlow,
  createFlowNode,
  createNewTag,
  createTagItem,
  updateTagItem,
  deleteTagItem,
  updateContext,
  selectContext,
  moveContext,
  activateContext,
  deleteContext,
  updateTabs,
  closeTab,
  createActiveTab,
  setActiveTab,
  createVariable,
} = contextSlice.actions

export default contextSlice.reducer
