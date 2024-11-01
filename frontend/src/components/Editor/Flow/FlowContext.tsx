import React, { createContext, useContext, useState, ReactNode } from 'react'

type FlowContextType = {
  currentHandle: string | null
  setCurrentHandle: (handle: string | null) => void
}

const FlowContext = createContext<FlowContextType | undefined>(undefined)

export const FlowProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentHandle, setCurrentHandle] = useState<string | null>(null)

  return (
    <FlowContext.Provider value={{ currentHandle, setCurrentHandle }}>
      {children}
    </FlowContext.Provider>
  )
}

export const useFlowContext = () => {
  const context = useContext(FlowContext)
  if (!context) {
    throw new Error('useFlowContext must be used within a FlowProvider')
  }
  return context
}
