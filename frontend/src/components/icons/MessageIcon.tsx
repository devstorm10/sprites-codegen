import type { SVGProps } from 'react'

export function MessageIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M6.3335 7.33333L13.6668 7.33333M6.3335 10.6667H11.0002M14.0002 14L8.14016 14C7.6135 14 7.10016 14.1533 6.66016 14.4467L3.3335 16.6667L3.3335 6.66667C3.3335 5.19333 4.52683 4 6.00016 4L14.0002 4C15.4735 4 16.6668 5.19333 16.6668 6.66667V11.3333C16.6668 12.8067 15.4735 14 14.0002 14Z"
        stroke="#37352F"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
