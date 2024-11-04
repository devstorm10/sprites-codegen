import { ReactFlowProvider } from 'reactflow'

import ContextViewer from '@/components/Editor/ContextViewer'
import FlowViewer from '@/components/Editor/Flow/FlowViewer'
import MainSettings from '@/components/Editor/MainSettings'
import { FlowProvider } from '@/components/Editor/Flow/FlowContext'
import { useAppSelector } from '@/store/store'
import { findContextNodeById } from '@/store/slices'
import { ContextNode } from '@/lib/types'

const EditorPage = () => {
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const activeContext = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, activeContextId || '')
  )

  return (
    <div className="h-full flex flex-col overflow-y-auto overflow-x-clip">
      {activeContext &&
      (activeContext.type === 'group' || activeContext.type === 'flow_node') ? (
        <div className="py-6 px-8 flex flex-col overflow-y-auto flex-1">
          {activeContext.type === 'group' && <MainSettings />}
          <ContextViewer context={activeContext} />
        </div>
      ) : (
        <ReactFlowProvider>
          <FlowProvider>
            <FlowViewer flowContext={activeContext as ContextNode} />
          </FlowProvider>
        </ReactFlowProvider>
      )}
    </div>
  )
}

export default EditorPage
