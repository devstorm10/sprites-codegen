import React, { useCallback, useState } from 'react'
import { Handle, Position } from 'reactflow'

import { cn } from '@/lib/utils'
import './FlowHandlers.css'

export type Anchor = 'left' | 'top' | 'right' | 'bottom'

type FlowHandlerWrapperProps = {
  parentId: string
  color?: string
  dualColor?: {
    positive: string
    negative: string
  }
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
  color = '#0B99FF',
  dualColor = {
    positive: '#32CD25',
    negative: '#FF0000',
  },
  anchors,
  isDual = false,
}) => {
  const [isShowTarget, setShowTarget] = useState<
    Partial<Record<Anchor, boolean>>
  >({})
  const _anchors: Anchor[] = anchors || ['left', 'top', 'right', 'bottom']

  const handleMouseEnter = useCallback(
    (anchor: Anchor) => (event: React.MouseEvent) => {
      setShowTarget({ ...isShowTarget, [anchor]: event.buttons === 1 })
    },
    []
  )

  return (
    <>
      {_anchors.map((anchor) =>
        isDual ? (
          <div key={anchor}>
            {isShowTarget[anchor] ? (
              <Handle
                id={`${parentId}_handle_${anchor}_point`}
                type="target"
                position={ANCHOR_DATA[anchor].position}
                className="w-2 h-2 bg-black opacity-0 !z-[100]"
              />
            ) : (
              <>
                <Handle
                  id={`${parentId}_handle_${anchor}_yes_point`}
                  type="source"
                  position={ANCHOR_DATA[anchor].position}
                  className={cn('w-2 h-2 bg-black opacity-0 !z-[100]', {
                    '-translate-x-1.5': anchor === 'top' || anchor === 'bottom',
                    '-translate-y-1.5': anchor === 'left' || anchor === 'right',
                  })}
                />
                <Handle
                  id={`${parentId}_handle_${anchor}_no_point`}
                  type="source"
                  position={ANCHOR_DATA[anchor].position}
                  className={cn('w-2 h-2 bg-black opacity-0 !z-[100]', {
                    'translate-x-3.5': anchor === 'top' || anchor === 'bottom',
                    'translate-y-3.5': anchor === 'left' || anchor === 'right',
                  })}
                />
              </>
            )}
          </div>
        ) : (
          <Handle
            id={`${parentId}_handle_${anchor}_point`}
            type={isShowTarget[anchor] ? 'target' : 'source'}
            position={ANCHOR_DATA[anchor].position}
            className="w-2 h-2 bg-black opacity-0 !z-[100]"
          />
        )
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+40px)] h-[calc(100%+40px)] group -z-10">
        {_anchors.map((anchor) =>
          isDual ? (
            <div key={anchor}>
              {isShowTarget[anchor] ? (
                <Handle
                  id={`${parentId}_handle_${anchor}`}
                  type="target"
                  position={ANCHOR_DATA[anchor].position}
                  className="absolute w-4 h-4 border !bg-white rounded-full opacity-0 group-hover:opacity-100 !z-[100]"
                  style={{
                    borderColor: color,
                  }}
                  onMouseEnter={handleMouseEnter(anchor)}
                />
              ) : (
                <>
                  <Handle
                    id={`${parentId}_handle_${anchor}_yes`}
                    type="source"
                    position={ANCHOR_DATA[anchor].position}
                    className={cn(
                      'absolute w-4 h-4 border !bg-white rounded-full opacity-0 group-hover:opacity-100 !z-[100]',
                      {
                        '-translate-x-2.5':
                          anchor === 'top' || anchor === 'bottom',
                        '-translate-y-2.5':
                          anchor === 'left' || anchor === 'right',
                      }
                    )}
                    style={{
                      borderColor: dualColor.positive,
                    }}
                  />
                  <Handle
                    id={`${parentId}_handle_${anchor}_no`}
                    type="source"
                    position={ANCHOR_DATA[anchor].position}
                    className={cn(
                      'absolute w-4 h-4 border !bg-white rounded-full opacity-0 group-hover:opacity-100 !z-[100]',
                      {
                        'translate-x-2.5':
                          anchor === 'top' || anchor === 'bottom',
                        'translate-y-2.5':
                          anchor === 'left' || anchor === 'right',
                      }
                    )}
                    style={{
                      borderColor: dualColor.negative,
                    }}
                  />
                </>
              )}
            </div>
          ) : (
            <Handle
              id={`${parentId}_handle_${anchor}`}
              type={isShowTarget[anchor] ? 'target' : 'source'}
              position={ANCHOR_DATA[anchor].position}
              className="absolute w-4 h-4 border !bg-white rounded-full opacity-0 group-hover:opacity-100 !z-[100]"
              style={{
                borderColor: color,
              }}
              onMouseEnter={handleMouseEnter(anchor)}
            />
          )
        )}
      </div>
    </>
  )
}

export default FlowHandlers
