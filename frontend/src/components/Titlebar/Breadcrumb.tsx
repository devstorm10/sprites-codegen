import React from 'react'
import clsx from 'clsx'
import { useAppDispatch } from '@/store/store'
import { createActiveTab } from '@/store/slices'

interface Route {
  id: string
  title: string
}

interface BreadcrumbProps {
  routes: Route[]
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ routes }) => {
  const dispatch = useAppDispatch()

  const handleRedirect = (route: Route) => () => {
    dispatch(
      createActiveTab({
        id: route.id,
        title: route.title,
      })
    )
  }

  return (
    <div className="flex gap-2">
      {routes.map((route, index) => (
        <React.Fragment key={route.id}>
          <span
            className={clsx(
              'w-fit font-medium cursor-pointer',
              index === routes.length - 1 ? '' : 'text-secondary-100/50'
            )}
            onClick={handleRedirect(route)}
          >
            {route.title}
          </span>
          {index < routes.length - 1 && (
            <span className="text-secondary-100/50 font-medium">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
