import React, { useState } from 'react'
import { HiOutlineSearch, HiOutlineSelector } from 'react-icons/hi'

import EditableText from '@/common/EditableText'
import IconButton from '@/common/IconButton'
import Input from '@/common/Input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import Contexts, { FilteredContexts } from './Contexts'
import Menu from './Menu'
import SidebarWrapper from './SidebarWrapper'

const Sidebar: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('Project Name')
  const [searchTerm, setSearchTerm] = useState<string>('')

  return (
    <SidebarWrapper>
      <div className="flex items-center gap-2 px-[16px] py-[8px] border-b border-background-300 w-full">
        <div className="flex items-center gap-2 overflow-clip w-[calc(100%_-_20px)]">
          <span className="w-[22px] h-[22px] bg-[#643A46] rounded flex items-center justify-center text-[#FCB0C4] shrink-0 text-[10px]">
            {projectName
              .split(' ')
              .map((word) => word[0])
              .join('')
              .toUpperCase()}
          </span>
          <div className="w-[calc(100%_-_22px)]">
            <EditableText
              className="p-1 w-full overflow-clip text-nowrap text-ellipsis text-[14px] font-medium"
              text={projectName}
              onChange={setProjectName}
            />
          </div>
        </div>
        <IconButton className="shrink-0">
          <HiOutlineSelector />
        </IconButton>
      </div>
      <div className="flex items-center gap-2 p-2 px-3">
        <span className="w-[36px] h-[36px] flex justify-center items-center">
          <HiOutlineSearch size={21} />
        </span>
        <Input
          className="w-full"
          placeholder="Search something..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex-1 px-[5px]">
        <Tabs defaultValue="contexts" className="w-full">
          <TabsList className="w-full bg-background border-b rounded-none pb-0 justify-start">
            <TabsTrigger
              className="outline-none rounded-none data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:shadow-black text-[16px]"
              value="contexts"
            >
              Contexts
            </TabsTrigger>
            <TabsTrigger
              className="outline-none rounded-none data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:shadow-black text-[16px]"
              value="components"
            >
              Components
            </TabsTrigger>
          </TabsList>
          <TabsContent value="contexts">
            {searchTerm ? (
              <FilteredContexts
                filter={searchTerm}
                onFilterClear={() => setSearchTerm('')}
              />
            ) : (
              <Contexts />
            )}
          </TabsContent>
          <TabsContent value="components">
            <div className="px-3">Your components here.</div>
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <Menu />
      </div>
    </SidebarWrapper>
  )
}

export default Sidebar
