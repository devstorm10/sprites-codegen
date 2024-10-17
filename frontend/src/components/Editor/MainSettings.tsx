import { ChangeEvent, useRef, useState } from 'react'
import { FiSettings } from 'react-icons/fi'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

import EditableText from '@/common/EditableText'
import { Card } from '@/components/ui/card'
import { SparkleIcon } from '@/components/icons/SparkleIcon'
import { cn } from '@/lib/utils'
import { TrashIcon } from '../icons/TrashIcon'
import { FaPlus } from 'react-icons/fa6'
import { ClipIcon } from '../icons/ClipIcon'

const dummyPreDialogSteps: string[] = ['Memories Retriever', 'Emotions Check']

const dummyPostDialogSteps: string[] = [
  'Memories Update',
  'Emotions Update',
  'Favorite Movies Updater',
]

const dummyKnowledgeBases: string[] = []

const dummyConvStarters: string[] = [
  'Hey there! 🦊 How’s your day going so far?',
  'Hi! Just popping in to see what’s on your mind today 😊.',
  'Hiya! Anything exciting happening in your world today? 🌟',
  'Hey! Need a little boost or a fun chat today? I’m here for you! 💫',
  'Hey! How are you feeling right now? Let’s talk about it! 🧡',
]

type ChipItemProps = {
  editing?: boolean
  content: string
  onContentChange?: (value: string) => void
}

type ConverChipItemProps = ChipItemProps & {
  onItemDelete: () => void
}

type AddButtonProps = {
  onClick: () => void
}

const StepChipItem: React.FC<ChipItemProps> = ({
  content,
  onContentChange = () => {},
  editing = false,
}) => {
  return (
    <Card className="py-2.5 px-4 drop-shadow-[0_0_12px_0_rgba(0,0,0,0.25)] flex items-center gap-x-2.5 rounded-[20px]">
      <SparkleIcon />
      <EditableText
        text={content}
        onChange={onContentChange}
        className="font-bold"
        editing={editing}
      />
    </Card>
  )
}

const BaseChipItem: React.FC<ChipItemProps> = ({ content }) => {
  return (
    <Card className="py-2.5 px-4 drop-shadow-sm flex items-center gap-x-2 rounded-2xl">
      <p className="font-bold">{content}</p>
    </Card>
  )
}

const ConvChipItem: React.FC<ConverChipItemProps> = ({
  content,
  onContentChange = () => {},
  onItemDelete,
  editing = false,
}) => {
  return (
    <div className="flex gap-x-1">
      <Card className="py-2.5 px-4 drop-shadow-sm flex items-center gap-x-2 rounded-[20px] text-muted">
        <EditableText
          text={content}
          onChange={onContentChange}
          className="font-medium text-secondary-100"
          editing={editing}
        />
      </Card>
      <Card
        className="p-3.5 rounded-[20px] text-black/30 cursor-pointer hover:bg-secondary-100/10"
        onClick={onItemDelete}
      >
        <TrashIcon />
      </Card>
    </div>
  )
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <Card
      className="py-2.5 px-4 drop-shadow-sm flex items-center gap-x-2.5 rounded-[20px] text-sm text-[#B1B0AF] font-medium hover:bg-secondary-100/5 cursor-pointer"
      onClick={onClick}
    >
      <FaPlus />
      <p>Add new</p>
    </Card>
  )
}

const MainSettings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [addingPreStepId, setAddingPreStepId] = useState<number>(-1)
  const [addingPostStepId, setAddingPostStepId] = useState<number>(-1)
  const [addingConvId, setAddingConvId] = useState<number>(-1)
  const [preDialogSteps, setPreDialogSteps] =
    useState<string[]>(dummyPreDialogSteps)
  const [postDialogSteps, setPostDialogSteps] =
    useState<string[]>(dummyPostDialogSteps)
  const [knowledgeBases, setKnowledgeBases] =
    useState<string[]>(dummyKnowledgeBases)
  const [convStarters, setConvStarters] = useState<string[]>(dummyConvStarters)

  const handlePreDialogStepChange = (index: number) => (value: string) => {
    setPreDialogSteps(
      preDialogSteps.map((step, idx) => (idx === index ? value : step))
    )
  }

  const handlePostDialogStepChange = (index: number) => (value: string) => {
    setPostDialogSteps(
      postDialogSteps.map((step, idx) => (idx === index ? value : step))
    )
  }

  const handleKnowledgeBaseChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const filename = event.target.files[0].name
      setKnowledgeBases([...knowledgeBases, filename])
    }
  }

  const handleConvItemChange = (index: number) => (value: string) => {
    setConvStarters(
      convStarters.map((step, idx) => (idx === index ? value : step))
    )
  }

  const handleConvItemDelete = (index: number) => () => {
    const convItem = convStarters[index]
    setConvStarters(convStarters.filter((item) => item !== convItem))
  }

  const handleAddPreDialogStepClick = () => {
    setPreDialogSteps([...preDialogSteps, ''])
    setAddingPreStepId(preDialogSteps.length)
  }

  const handleAddPostDialogStepClick = () => {
    setPostDialogSteps([...postDialogSteps, ''])
    setAddingPostStepId(postDialogSteps.length)
  }

  const handleAddKnowledgeClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleAddConvItemClick = () => {
    setConvStarters([...convStarters, ''])
    setAddingConvId(convStarters.length)
  }

  return (
    <Card className="py-4 px-6 rounded-[16px] drop-shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={cn('flex items-center gap-1 font-semibold', {
            'text-secondary-100/50': !isOpen,
          })}
        >
          <FiSettings size={18} />
          <p className="pl-1">Main Settings</p>
        </div>
        <span
          className="h-[24px] w-[24px] rounded-full flex items-center justify-center border text-secondary-100/50 shadow-[0_0_16px_rgba(0,0,0,0.04)] hover:bg-secondary-100/10 text-sm cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      <div className={cn('mt-8 flex flex-col gap-y-4', { hidden: !isOpen })}>
        <Card className="py-2 px-4 shadow-none">
          <p className="text-secondary-100 font-bold">Pre dialog steps</p>
          <div className="mt-2.5 flex gap-2 flex-wrap">
            {preDialogSteps.map((step, idx) => (
              <StepChipItem
                key={idx}
                content={step}
                onContentChange={handlePreDialogStepChange(idx)}
                editing={idx === addingPreStepId}
              />
            ))}
            <AddButton onClick={handleAddPreDialogStepClick} />
          </div>
        </Card>
        <Card className="py-2 px-4 shadow-none">
          <p className="text-secondary-100 font-bold">Post dialog steps</p>
          <div className="mt-2.5 flex gap-2 flex-wrap">
            {postDialogSteps.map((step, idx) => (
              <StepChipItem
                key={idx}
                content={step}
                onContentChange={handlePostDialogStepChange(idx)}
                editing={idx === addingPostStepId}
              />
            ))}
            <AddButton onClick={handleAddPostDialogStepClick} />
          </div>
        </Card>
        <Card className="py-2 px-4 shadow-none">
          <p className="text-secondary-100 font-bold">Knowledge base</p>
          <div className="mt-2.5 flex gap-2 flex-wrap">
            {knowledgeBases.map((knowbase, idx) => (
              <BaseChipItem key={idx} content={knowbase} />
            ))}
            <Card
              className="py-2.5 px-4 drop-shadow-sm flex items-center gap-x-2.5 rounded-2xl text-sm text-[#B1B0AF] font-medium hover:bg-secondary-100/5 cursor-pointer"
              onClick={handleAddKnowledgeClick}
            >
              <ClipIcon />
              <p>Add new file</p>
            </Card>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleKnowledgeBaseChange}
              hidden
            />
          </div>
        </Card>
        <Card className="py-2 px-4 shadow-none flex flex-col gap-y-2.5">
          <p className="text-secondary-100 font-bold">Conversation Starters</p>
          {convStarters.map((conversation, idx) => (
            <ConvChipItem
              key={idx}
              content={conversation}
              onContentChange={handleConvItemChange(idx)}
              onItemDelete={handleConvItemDelete(idx)}
              editing={addingConvId === idx}
            />
          ))}
          <div className="flex items-start">
            <AddButton onClick={handleAddConvItemClick} />
          </div>
        </Card>
      </div>
    </Card>
  )
}

export default MainSettings
