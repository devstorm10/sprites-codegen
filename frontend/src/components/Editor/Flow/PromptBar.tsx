import { useEffect } from 'react'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'

import ContextViewer from '../ContextViewer'
import { CopyIcon } from '@/components/icons/CopyIcon'
import { ExpandIcon } from '@/components/icons/ExpandIcon'
import { SparkleIcon } from '@/components/icons/SparkleIcon'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { LayoutIcon } from '@/components/icons/LayoutIcon'
import { PromptIcon } from '@/components/icons/PromptIcon'
import {
  createActiveTab,
  expandPromptbar,
  findContextNodeById,
  findFlowNodeById,
} from '@/store/slices'
import { useAppDispatch, useAppSelector } from '@/store/store'

const PromptBar: React.FC = () => {
  const dispatch = useAppDispatch()
  const isExpanded = useAppSelector(
    (state) => state.setting.isPromptbarExpanded
  )
  const selectedNodeId = useAppSelector((state) => state.context.selectedId)
  const selectedContext = useAppSelector((state) =>
    findContextNodeById(state.context.contexts || [], selectedNodeId || '')
  )
  const selectedNode = useAppSelector((state) =>
    findFlowNodeById(state.flow.flows, selectedNodeId || '')
  )

  const xAnimation = useAnimation()

  const handleLayoutExpand = () => {
    if (selectedNodeId) {
      dispatch(
        createActiveTab({ id: selectedNodeId, title: 'Additional Prompt' })
      )
    }
  }

  useEffect(() => {
    xAnimation.start({ x: isExpanded ? 0 : 350 })
  }, [isExpanded, xAnimation])

  return (
    <motion.div
      animate={xAnimation}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.5,
        duration: 0.3,
      }}
      className="absolute top-0 right-0 h-full flex select-none pointer-events-none"
    >
      <div className="flex flex-col pointer-events-none select-none">
        <span
          className="-rotate-90 origin-top-right -translate-x-[32px] bg-white px-3 py-1 rounded-t-xl shadow-[-3px_0px_15px_0px_rgba(38,50,56,0.1015)] pointer-events-auto cursor-pointer hover:shadow-[-3px_0px_15px_0px_rgba(38,50,56,0.2515)]"
          onClick={() => {
            dispatch(expandPromptbar(!isExpanded))
          }}
        >
          Properties
        </span>
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-6 flex flex-col gap-y-6 bg-white z-10 pointer-events-auto relative w-[350px]"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                {selectedNode?.data?.type === 'trigger' ? (
                  <LayoutIcon />
                ) : selectedNode?.data?.type === 'prompt' ? (
                  <PromptIcon />
                ) : (
                  <SparkleIcon />
                )}
                <p className="font-semibold">{selectedContext?.title || ''}</p>
              </div>
              <div className="flex items-center gap-x-1">
                <ExpandIcon
                  onClick={handleLayoutExpand}
                  className="cursor-pointer"
                />
                <CopyIcon />
                <TrashIcon />
              </div>
            </div>
            {selectedContext && (
              <ContextViewer context={selectedContext} isOnPromptbar={true} />
            )}
          </div>
          <div className="absolute left-0 top-0 w-full h-full bg-white z-1"></div>
          <div className="absolute left-0 bottom-0 w-full h-[calc(100%_-_102px)] bg-white shadow-[-3px_0px_15px_0px_rgba(38,50,56,0.1015)] -z-10"></div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default PromptBar
