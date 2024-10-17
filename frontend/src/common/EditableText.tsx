import React, { useState, useRef, useEffect } from 'react'

interface EditableTextProps {
  text: string
  onChange: (newText: string) => void
  className?: string
  editing?: boolean
}

const EditableText: React.FC<EditableTextProps> = ({
  text,
  onChange,
  className = '',
  editing = false,
}) => {
  const [isEditing, setIsEditing] = useState(editing)
  const inputRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.textContent = text
    }
  }, [isEditing, text])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (inputRef.current) {
      onChange(inputRef.current.textContent || '')
    }
  }

  return (
    <div onDoubleClick={handleDoubleClick} className="flex items-center flex-1">
      {isEditing ? (
        <div
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning={true}
          onBlur={handleBlur}
          className={`text-nowrap bg-transparent border-b border-primary-100 outline-none w-full ${className}`}
        ></div>
      ) : (
        <div className={`text-nowrap border-b border-transparent ${className}`}>
          {text}
        </div>
      )}
    </div>
  )
}

export default EditableText
