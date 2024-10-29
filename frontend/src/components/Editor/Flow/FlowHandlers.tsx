import React, { useCallback, useState } from 'react'
import { Handle, Position } from 'reactflow'

import './FlowHandlers.css'
import { cn } from '@/lib/utils'

export type Anchor = 'left' | 'top' | 'right' | 'bottom'

type FlowHandlerWrapperProps = {
  parentId: string
  color: string
  secondaryColor?: string
  anchors?: Anchor[]
  isDual?: boolean
}

const ANCHOR_DATA: Record<
  Anchor,
  {
    position: Position
  }
> = {
  left: {
    position: Position.Left,
  },
  top: {
    position: Position.Top,
  },
  right: {
    position: Position.Right,
  },
  bottom: {
    position: Position.Bottom,
  },
}

const FlowHandlers: React.FC<FlowHandlerWrapperProps> = ({
  parentId,
  color,
  secondaryColor,
  anchors,
  isDual = false,
}) => {
  const [isShowTarget, setIsShowTarget] = useState(false)
  const _anchors: Anchor[] = anchors || ['left', 'top', 'right', 'bottom']

  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    if (event.buttons === 1) {
      setIsShowTarget(true)
    } else {
      setIsShowTarget(false)
    }
  }, [])

  return (
    <>
      {_anchors.map((anchor) => (
        <div key={anchor}>
          <Handle
            type={isShowTarget ? 'target' : 'source'}
            position={ANCHOR_DATA[anchor].position}
            id={`${parentId}_handle_${anchor}_point`}
            className={cn('w-2 h-2 bg-black opacity-0 !z-[100]', {
              '-translate-x-1.5':
                isDual && (anchor === 'top' || anchor === 'bottom'),
              '-translate-y-1.5':
                isDual && (anchor === 'left' || anchor === 'right'),
            })}
          />
          {isDual && (
            <Handle
              type={isShowTarget ? 'target' : 'source'}
              position={ANCHOR_DATA[anchor].position}
              id={`${parentId}_handle_${anchor}_dual_point`}
              className={cn('w-2 h-2 bg-black opacity-0 !z-[100]', {
                'translate-x-3.5':
                  isDual && (anchor === 'top' || anchor === 'bottom'),
                'translate-y-3.5':
                  isDual && (anchor === 'left' || anchor === 'right'),
              })}
            />
          )}
        </div>
      ))}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+40px)] h-[calc(100%+40px)] group -z-10"
        onMouseEnter={handleMouseEnter}
      >
        {_anchors.map((anchor) => (
          <div key={anchor}>
            <Handle
              id={`${parentId}_handle_${anchor}`}
              type={isShowTarget ? 'target' : 'source'}
              position={ANCHOR_DATA[anchor].position}
              className={cn(
                'absolute w-4 h-4 border !bg-white rounded-full opacity-0 group-hover:opacity-100 !z-[100]',
                {
                  '-translate-x-2.5':
                    isDual && (anchor === 'top' || anchor === 'bottom'),
                  '-translate-y-2.5':
                    isDual && (anchor === 'left' || anchor === 'right'),
                }
              )}
              style={{
                borderColor: color,
              }}
            />
            {isDual && (
              <Handle
                id={`${parentId}_handle_${anchor}_dual`}
                type={isShowTarget ? 'target' : 'source'}
                position={ANCHOR_DATA[anchor].position}
                className={cn(
                  'absolute w-4 h-4 border !bg-white rounded-full opacity-0 group-hover:opacity-100 !z-[100]',
                  {
                    'translate-x-2.5':
                      isDual && (anchor === 'top' || anchor === 'bottom'),
                    'translate-y-2.5':
                      isDual && (anchor === 'left' || anchor === 'right'),
                  }
                )}
                style={{
                  borderColor: secondaryColor,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default FlowHandlers
