import Breadcrumb from './Breadcrumb'

const Titlebar = () => {
  return (
    <div className="px-5 py-3 border-b border-background-300 flex justify-between items-center">
      <span></span>
      <Breadcrumb routes={['Agent name', 'Default Context']} />
      <div>
        <button className="bg-secondary-100 text-text-100 px-3 py-1 rounded-full hover:bg-secondary">
          Publish
        </button>
      </div>
    </div>
  )
}

export default Titlebar
