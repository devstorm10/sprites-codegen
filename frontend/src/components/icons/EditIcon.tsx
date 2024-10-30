import type { SVGProps } from 'react'

export function EditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.04778 17.1658H16.6668M14.7621 6.68961L15.7144 7.64199M16.1906 4.30866C16.3784 4.49618 16.5273 4.71887 16.629 4.964C16.7306 5.20912 16.7829 5.47188 16.7829 5.73723C16.7829 6.00259 16.7306 6.26534 16.629 6.51047C16.5273 6.7556 16.3784 6.97829 16.1906 7.1658L7.14302 16.2134L3.3335 17.1658L4.28588 13.4096L13.3373 4.31247C13.6941 3.95397 14.1726 3.74272 14.6779 3.72067C15.1832 3.69861 15.6783 3.86737 16.0649 4.19342L16.1906 4.30866Z"
        stroke="#37352F"
        strokeOpacity={props.strokeOpacity || '0.3'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
