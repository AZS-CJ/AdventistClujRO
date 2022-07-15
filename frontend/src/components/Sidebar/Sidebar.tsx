import { useNavigationContext } from '../../contexts/navigation'
import logo from '../../assets/logo.svg'

const Sidebar = () => {
  const { toggleSidebar } = useNavigationContext()

  return (
    <div className="logo-column" onClick={toggleSidebar}>
      <img className="church-logo" src={logo} alt="Logo" />
    </div>
  )
}

export default Sidebar
