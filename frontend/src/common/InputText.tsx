import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface InputTextProps {
  text: string
  onChange: (newText: string) => void
  placeholder?: string
  className?: string
  editing?: boolean
}

const InputText: React.FC<InputTextProps> = ({
  text,
  onChange,
  placeholder = '',
  className = '',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [text])

  return (
    <textarea
      ref={textareaRef}
      value={text}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'flex items-center flex-1 outline-none z-50',
        {
          '!text-[#B1B0AF]': !text && placeholder,
        },
        className
      )}
    />
  )
}

export default InputText
