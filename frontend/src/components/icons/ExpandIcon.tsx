import type { SVGProps } from 'react'

export function ExpandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 19H5V14M14 5H19V10"
        stroke="black"
        strokeOpacity={0.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
