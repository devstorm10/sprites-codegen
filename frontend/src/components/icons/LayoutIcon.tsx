import type { SVGProps } from 'react'

export function LayoutIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M9 7.33301L11.6667 9.99967L9 12.6663M3 9.99967H11M6.66667 4.22489C7.64724 3.65766 8.78571 3.33301 10 3.33301C13.6819 3.33301 16.6667 6.31778 16.6667 9.99967C16.6667 13.6816 13.6819 16.6663 10 16.6663C8.78571 16.6663 7.64724 16.3417 6.66667 15.7745"
        stroke="#37352F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
