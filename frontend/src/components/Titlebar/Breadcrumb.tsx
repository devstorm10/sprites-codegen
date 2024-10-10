import EditableText from '@/common/EditableText'
import clsx from 'clsx'
import React, { useCallback } from 'react'

interface BreadcrumbProps {
  routes: string[]
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ routes }) => {
  const handleChange = useCallback(() => {}, [])

  return (
    <div className="flex gap-2">
      {routes.map((route, index) => (
        <React.Fragment key={route}>
          <EditableText
            text={route}
            className={clsx(
              'w-fit',
              index === routes.length - 1 ? 'font-bold' : ''
            )}
            onChange={handleChange}
          />
          {index < routes.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
