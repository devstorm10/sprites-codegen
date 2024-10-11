import { FiSettings } from 'react-icons/fi'
import { FaChevronDown } from 'react-icons/fa'

import { Card } from '@/components/ui/card'
import CreateButton from '@/components/Editor/CreateButton'
import ContextViewer from '@/components/Editor/ContextViewer'

const EditorPage = () => {
  return (
    <div className="py-6 px-8 flex flex-col">
      <Card className="py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <FiSettings size={18} />
          <p className="pl-1 font-semibold">Main Settings</p>
        </div>
        <span className="h-6 w-6 rounded-full flex items-center justify-center border">
          <FaChevronDown />
        </span>
      </Card>
      <div className="mt-16">
        <CreateButton />
      </div>
      <div className="mt-9">
        <ContextViewer />
      </div>
    </div>
  )
}

export default EditorPage
