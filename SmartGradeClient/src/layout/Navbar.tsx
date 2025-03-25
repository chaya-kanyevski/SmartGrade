import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <>
    <nav>
      <ul>
        <li><Link to="/">בית</Link></li>
        <li><Link to="/about">אודות</Link></li>
        <li><Link to="/login">להתחברות</Link></li>
        <li><Link to="/register">להרשמה</Link></li>
        <li><Link to="/auth">כניסה</Link></li>
        <li><Link to="/exam-list">רשימת מבחנים</Link></li>
      </ul>
    </nav>
        </>
    )
}
export default Navbar