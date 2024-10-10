import React from 'react'
import { motion, MotionProps } from 'framer-motion'

interface IconButtonProps extends MotionProps {
  className?: string
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.button
      className={`flex items-center justify-center ${className}`}
      whileHover={{ rotate: 360 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default IconButton
