import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <>
    <nav>
      <ul>
        <li><Link to="/">בית</Link></li>
        <li><Link to="/about">אודות</Link></li>
      </ul>
    </nav>
        </>
    )
}
export default Navbar