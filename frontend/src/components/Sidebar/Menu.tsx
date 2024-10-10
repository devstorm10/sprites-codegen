import { PropsWithChildren } from 'react'
import { HiOutlineDatabase } from 'react-icons/hi'
import { BiCategory } from 'react-icons/bi'
import { LuLifeBuoy } from 'react-icons/lu'

const MenuItem: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <button className="flex items-center gap-2 p-3 border-t w-full hover:bg-muted transition-all">
      {children}
    </button>
  )
}

const Menu = () => {
  return (
    <div>
      <MenuItem>
        <HiOutlineDatabase size={20} /> Knowledge base
      </MenuItem>
      <MenuItem>
        <BiCategory size={20} /> Templates
      </MenuItem>
      <MenuItem>
        <LuLifeBuoy size={20} /> Support
      </MenuItem>
    </div>
  )
}

export default Menu
