import React from 'react'

interface BreadcrumbProps {
  routes: string[]
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ routes }) => {
  return (
    <div className="flex gap-2">
      {routes.map((route, index) => (
        <React.Fragment key={route}>
          <span className={index === routes.length - 1 ? 'font-bold' : ''}>
            {route}
          </span>
          {index < routes.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Breadcrumb
