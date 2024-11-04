import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import clsx from 'clsx'

import { getAgentUrl } from '@/lib/utils'

interface Route {
  id: string
  title: string
}

interface BreadcrumbProps {
  routes: Route[]
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ routes }) => {
  const { project_id } = useParams()
  const navigate = useNavigate()

  const handleRedirect = (route: Route) => () => {
    navigate(getAgentUrl(project_id || '', route.id))
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
