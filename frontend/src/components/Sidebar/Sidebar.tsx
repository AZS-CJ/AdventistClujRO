import { useNavigationContext } from '../../contexts/navigation'
import logo from '../../assets/logo.svg'

const Sidebar = () => {
  const { openSidebar } = useNavigationContext()

  return (
    <div className="logo-column" onClick={openSidebar}>
      <img className="church-logo" src={logo} alt="Logo" />
    </div>
  )
}

export default Sidebar
