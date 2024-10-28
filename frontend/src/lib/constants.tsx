import { HiOutlineFolder } from 'react-icons/hi'
import { LuTag } from 'react-icons/lu'
import { RxText } from 'react-icons/rx'

import { FlowIcon } from '@/components/icons/FlowIcon'
import { SparkleIcon } from '@/components/icons/SparkleIcon'

export const CONTEXT_ICONS = {
  group: <HiOutlineFolder size={20} />,
  tag: <LuTag size={20} />,
  flow: <FlowIcon />,
  flow_node: <SparkleIcon />,
  input: <RxText size={20} />,
  variable: <RxText size={20} />,
}

export const FAKE_NODE_ID = 'fake_node'
