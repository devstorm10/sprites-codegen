import type { SVGProps } from 'react'

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12.6668 14.6663V14.9997C12.6668 15.9197 11.9202 16.6663 11.0002 16.6663H5.00016C4.08016 16.6663 3.3335 15.9197 3.3335 14.9997V8.99967C3.3335 8.07967 4.08016 7.33301 5.00016 7.33301H5.3335M9.00016 3.33301H15.0002C15.9206 3.33301 16.6668 4.0792 16.6668 4.99967V10.9997C16.6668 11.9201 15.9206 12.6663 15.0002 12.6663H9.00016C8.07969 12.6663 7.3335 11.9201 7.3335 10.9997V4.99967C7.3335 4.0792 8.07969 3.33301 9.00016 3.33301Z"
        stroke="black"
        strokeOpacity={props.strokeOpacity || '0.3'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
