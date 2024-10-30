import { ReactFlowProvider } from 'reactflow'

import ContextViewer from '@/components/Editor/ContextViewer'
import FlowViewer from '@/components/Editor/Flow/FlowViewer'
import MainSettings from '@/components/Editor/MainSettings'
import { useAppSelector } from '@/store/store'
import { findContextNodeById } from '@/store/slices'
import { ContextNode } from '@/lib/types'

const EditorPage = () => {
  const activeContextId = useAppSelector((state) => state.context.activeId)
  const activeContext = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, activeContextId || '')
  )
  const isPromptbarStretched = useAppSelector(
    (state) => state.setting.isPromptbarStretched
  )

  return (
    <div className="h-full flex flex-col overflow-y-auto overflow-x-clip">
      {isPromptbarStretched || activeContext?.type === 'group' ? (
        <div className="py-6 px-8 flex flex-col overflow-y-auto flex-1">
          {!isPromptbarStretched && <MainSettings />}
          {activeContext && <ContextViewer context={activeContext} />}
        </div>
      ) : (
        <ReactFlowProvider>
          <FlowViewer flowContext={activeContext as ContextNode} />
        </ReactFlowProvider>
      )}
    </div>
  )
}

export default EditorPage
