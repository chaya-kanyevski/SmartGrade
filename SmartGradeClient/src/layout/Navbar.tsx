import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#f0f0f0",
            padding: "10px 0",
            zIndex: 100,
        }}>
            <ul style={{
                listStyleType: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "20px"
            }}>
                <li style={{ marginLeft: 20 }}>
                    <Link to="/" style={{ textDecoration: "none", color: "#333" }}>ראשי</Link>
                </li>
                <li style={{ marginLeft: 20 }}>
                    <Link to="/login" style={{ textDecoration: "none", color: "#333" }}>להתחברות</Link>
                </li>
                <li style={{ marginLeft: 20 }}>
                    <Link to="/AI" style={{ textDecoration: "none", color: "#333" }}>עוזר חכם</Link>
                </li>
                <li style={{ marginLeft: 20 }}>
                    <Link to="/dashboard" style={{ textDecoration: "none", color: "#333" }}>dashboard</Link>
                </li>
                <li style={{ marginLeft: 20 }}>
                    <Link to="/files" style={{ textDecoration: "none", color: "#333" }}>הקבצים שלי</Link>
                </li>
                <li style={{ marginLeft: 20 }}>
                    <Link to="/chat" style={{ textDecoration: "none", color: "#333" }}>צאט מורים</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;