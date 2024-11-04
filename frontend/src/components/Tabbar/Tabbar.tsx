import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Reorder } from 'framer-motion'

import TabItem from './TabItem'
import AddTabButton from './AddTabButton'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { activateContext, closeTab, updateTabs } from '@/store/slices'
import { Tab } from '@/lib/types'
import { getAgentUrl } from '@/lib/utils'

const Tabbar = () => {
  const { project_id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const tabs = useAppSelector((state) => state.context.tabs)
  const activeTab = useMemo(() => tabs.find((item) => item.active), [tabs])

  useEffect(() => {
    if (activeTab?.id) {
      dispatch(activateContext(activeTab.id))
    }
  }, [activeTab?.id, dispatch])

  const handleTabsUpdate = (tabs: Tab[]) => {
    dispatch(updateTabs(tabs))
  }

  const handleTabItemClick = (id: string) => () => {
    navigate(getAgentUrl(project_id || '', id))
  }

  const handleTabClose = (id: string) => () => {
    dispatch(closeTab(id))
  }

  return (
    <div className="bg-muted flex">
      <Reorder.Group
        axis="x"
        className="flex"
        values={tabs}
        onReorder={handleTabsUpdate}
      >
        {tabs.map((tab) => (
          <Reorder.Item key={tab.id} value={tab}>
            <TabItem
              active={tab.active}
              title={tab.title}
              onClick={handleTabItemClick(tab.id)}
              onClose={handleTabClose(tab.id)}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <AddTabButton />
    </div>
  )
}

export default Tabbar
