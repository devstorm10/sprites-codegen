import { useEffect, useMemo } from 'react'
import { Reorder } from 'framer-motion'

import TabItem from './TabItem'
import AddTabButton from './AddTabButton'
import { useAppDispatch, useAppSelector } from '@/store/store'
import {
  activateContext,
  closeTab,
  setActiveTab,
  updateTabs,
} from '@/store/slices'
import { Tab } from '@/lib/types'

const Tabbar = () => {
  const dispatch = useAppDispatch()
  const tabs = useAppSelector((state) => state.context.tabs)
  const activeTab = useMemo(() => tabs.find((item) => item.active), [tabs])

  useEffect(() => {
    if (activeTab?.id) {
      dispatch(activateContext(activeTab.id))
    }
  }, [activeTab?.id])

  const handleTabsUpdate = (tabs: Tab[]) => {
    dispatch(updateTabs(tabs))
  }

  const handleTabItemClick = (id: string) => () => {
    dispatch(setActiveTab(id))
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
