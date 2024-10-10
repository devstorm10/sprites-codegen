import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`border-b border-transparent focus:border-primary-100 outline-none p-2 ${className}`}
      {...props}
    />
  )
}

export default Input
