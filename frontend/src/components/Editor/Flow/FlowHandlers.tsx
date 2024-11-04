import React, { useCallback, useState } from 'react'
import { Handle, Position } from 'reactflow'

import { useFlowContext } from './FlowContext'
import { cn } from '@/lib/utils'
import './FlowHandlers.css'
import { Tooltip } from 'react-tooltip'

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
    className: string
  }
> = {
  left: {
    position: Position.Left,
    className: 'left-0',
  },
  top: {
    position: Position.Top,
    className: 'top-0',
  },
  right: {
    position: Position.Right,
    className: 'right-0',
  },
  bottom: {
    position: Position.Bottom,
    className: 'bottom-0',
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
  const { currentHandle } = useFlowContext()
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
            <Handle
              id={`${parentId}_handle_${anchor}_point`}
              type="target"
              position={ANCHOR_DATA[anchor].position}
              className="w-2 h-2 bg-black opacity-0 !z-[100]"
            />
            <Handle
              id={`${parentId}_handle_${anchor}_yes_point`}
              type="source"
              position={ANCHOR_DATA[anchor].position}
              className={cn('w-2 h-2 bg-black opacity-0 !z-[100]', {
                '-translate-x-4': anchor === 'top' || anchor === 'bottom',
                '-translate-y-4': anchor === 'left' || anchor === 'right',
              })}
            />
            <Handle
              id={`${parentId}_handle_${anchor}_no_point`}
              type="source"
              position={ANCHOR_DATA[anchor].position}
              className={cn('w-2 h-2 bg-black opacity-0 !z-[100]', {
                'translate-x-2': anchor === 'top' || anchor === 'bottom',
                'translate-y-2': anchor === 'left' || anchor === 'right',
              })}
            />
          </div>
        ) : (
          <Handle
            key={anchor}
            id={`${parentId}_handle_${anchor}_point`}
            type={isShowTarget[anchor] ? 'target' : 'source'}
            position={ANCHOR_DATA[anchor].position}
            className="w-2 h-2 bg-black opacity-0 !z-[100]"
          />
        )
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%+40px)] h-[calc(100%+40px)] -z-10">
        {_anchors.map((anchor) =>
          isDual ? (
            <div key={anchor}>
              {currentHandle &&
              ['yes', 'no'].every(
                (q) => currentHandle !== `${parentId}_handle_${anchor}_${q}`
              ) ? (
                <div
                  className={cn(
                    'absolute group',
                    {
                      'w-5 h-full top-0':
                        anchor === 'left' || anchor === 'right',
                      'h-5 w-full left-0':
                        anchor === 'top' || anchor === 'bottom',
                    },
                    ANCHOR_DATA[anchor].className
                  )}
                >
                  <Handle
                    id={`${parentId}_handle_${anchor}`}
                    type="target"
                    position={ANCHOR_DATA[anchor].position}
                    className="absolute w-4 h-4 border !bg-white rounded-full opacity-0 hover:opacity-100 !z-[100]"
                    style={{
                      borderColor: color,
                    }}
                    onMouseEnter={handleMouseEnter(anchor)}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    'absolute group',
                    {
                      'w-5 h-full top-0':
                        anchor === 'left' || anchor === 'right',
                      'h-5 w-full left-0':
                        anchor === 'top' || anchor === 'bottom',
                    },
                    ANCHOR_DATA[anchor].className
                  )}
                >
                  <Handle
                    id={`${parentId}_handle_${anchor}_yes`}
                    data-tooltip-id={`${parentId}_handler_${anchor}_yes_tooltip"`}
                    type="source"
                    position={ANCHOR_DATA[anchor].position}
                    className={cn(
                      'absolute w-4 h-4 border !bg-white rounded-full opacity-0 group-hover:opacity-100 !z-[100]',
                      {
                        '-translate-x-5':
                          anchor === 'top' || anchor === 'bottom',
                        '-translate-y-5':
                          anchor === 'left' || anchor === 'right',
                        '!opacity-100':
                          currentHandle === `${parentId}_handle_${anchor}_yes`,
                      }
                    )}
                    style={{
                      borderColor: dualColor.positive,
                    }}
                  />
                  <Handle
                    id={`${parentId}_handle_${anchor}_no`}
                    data-tooltip-id={`${parentId}_handler_${anchor}_no_tooltip"`}
                    type="source"
                    position={ANCHOR_DATA[anchor].position}
                    className={cn(
                      'absolute w-4 h-4 border !bg-white rounded-full opacity-0 group-hover:opacity-100 !z-[100]',
                      {
                        'translate-x-1':
                          anchor === 'top' || anchor === 'bottom',
                        'translate-y-1':
                          anchor === 'left' || anchor === 'right',
                      }
                    )}
                    style={{
                      borderColor: dualColor.negative,
                    }}
                  />
                  <Tooltip
                    id={`${parentId}_handler_${anchor}_yes_tooltip"`}
                    place={anchor}
                    content="Add “YES” Condition"
                    className="!py-1 !px-2 !rounded-lg !text-xs"
                    classNameArrow="hidden"
                  />
                  <Tooltip
                    id={`${parentId}_handler_${anchor}_no_tooltip"`}
                    place={anchor}
                    content="Add “NO” Condition"
                    className="!py-1 !px-2 !rounded-lg !text-xs"
                    classNameArrow="hidden"
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              key={anchor}
              className={cn(
                'absolute group',
                {
                  'w-5 h-full top-0': anchor === 'left' || anchor === 'right',
                  'h-5 w-full left-0': anchor === 'top' || anchor === 'bottom',
                },
                ANCHOR_DATA[anchor].className
              )}
            >
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
            </div>
          )
        )}
      </div>
    </>
  )
}

export default FlowHandlers
