import { ReactFlowProvider } from 'reactflow'

import ContextViewer from '@/components/Editor/ContextViewer'
import FlowViewer from '@/components/Editor/Flow/FlowViewer'
import MainSettings from '@/components/Editor/MainSettings'
import { useAppSelector } from '@/store/store'
import { findContextNodeById, findParentContextNodeById } from '@/store/slices'
import { ContextNode } from '@/lib/types'

const EditorPage = () => {
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const activeContext = useAppSelector((state) =>
    state.context.contexts.find((context) => context.id === activeContextId)
  )
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const selectedContext = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, selectedContextId || '')
  )
  const parentContext = useAppSelector((state) =>
    findParentContextNodeById(state.context.contexts, selectedContextId || '')
  )

  return (
    <div className="h-full flex flex-col overflow-y-auto overflow-x-clip">
      {selectedContext &&
      (selectedContext.type === 'flow' ||
        (selectedContext.type === 'flow_node' && parentContext)) ? (
        <ReactFlowProvider>
          <FlowViewer
            flowContext={
              selectedContext.type === 'flow_node'
                ? (parentContext as ContextNode)
                : selectedContext
            }
          />
        </ReactFlowProvider>
      ) : (
        <div className="py-6 px-8 flex flex-col overflow-y-auto flex-1">
          <MainSettings />
          {activeContext && <ContextViewer context={activeContext} />}
        </div>
      )}
    </div>
  )
}

export default EditorPage
