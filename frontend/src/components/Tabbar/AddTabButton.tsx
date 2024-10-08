import { motion } from 'framer-motion'
import { RxPlus } from 'react-icons/rx'

const AddTabButton = () => {
  return (
    <motion.button className="bg-background-200 h-[32px] w-[32px] flex justify-center items-center hover:bg-background-100/50">
      <motion.span
        className="h-full w-full flex items-center justify-center"
        whileHover={{ rotate: 360 }}
      >
        <RxPlus />
      </motion.span>
    </motion.button>
  )
}

export default AddTabButton
