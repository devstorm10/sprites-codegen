import { motion } from 'framer-motion'
import { RxPlus } from 'react-icons/rx'

const AddTabButton = () => {
  return (
    <motion.button className="h-[32px] w-[32px] flex justify-center items-center hover:bg-background">
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
