import CreateButton from '@/components/Editor/CreateButton'
import ContextViewer from '@/components/Editor/ContextViewer'
import { useAppSelector } from '@/store/store'
import { findContextNodeById } from '@/store/slices'
import FlowViewer from '@/components/Editor/Flow/FlowViewer'
import MainSettings from '@/components/Editor/MainSettings'

const EditorPage = () => {
  const selectedContextId = useAppSelector((state) => state.context.selectedId)
  const selectedContext = useAppSelector((state) =>
    findContextNodeById(state.context.contexts, selectedContextId || '')
  )

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {selectedContext?.type === 'flow' ? (
        <FlowViewer />
      ) : (
        <div className="py-6 px-8 flex flex-col overflow-y-auto flex-1">
          <MainSettings />
          <div className="mt-[64px]">
            <CreateButton />
          </div>
          <div className="mt-9">
            <ContextViewer />
          </div>
        </div>
      )}
    </div>
  )
}

export default EditorPage
