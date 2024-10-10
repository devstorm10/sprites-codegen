import { Reorder } from 'framer-motion'
import { useState } from 'react'

import { Tab } from '@/lib/types'

import TabItem from './TabItem'
import AddTabButton from './AddTabButton'

const mockTabs: Tab[] = [
  {
    title: 'Default Context',
    active: true,
  },
  {
    title: 'Another Context',
  },
]

const Tabbar = () => {
  const [tabs, setTabs] = useState<Tab[]>(mockTabs)

  return (
    <div className="bg-muted flex">
      <Reorder.Group
        axis="x"
        className="flex"
        values={tabs}
        onReorder={setTabs}
      >
        {tabs.map((tab) => (
          <Reorder.Item key={tab.title} value={tab}>
            <TabItem active={tab.active} title={tab.title} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <AddTabButton />
    </div>
  )
}

export default Tabbar
