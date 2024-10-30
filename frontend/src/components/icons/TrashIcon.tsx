import type { SVGProps } from 'react'

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.33333 5.99967V13.9997C5.33333 15.473 6.52667 16.6663 8 16.6663H12C13.4733 16.6663 14.6667 15.473 14.6667 13.9997V5.99967M4 5.99967H16M7.33333 3.33301H12.6667M8.66667 13.6663V8.66634M11.3333 13.6663V8.66634"
        stroke="black"
        strokeOpacity={props.strokeOpacity || '0.3'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
