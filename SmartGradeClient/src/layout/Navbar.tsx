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
                    <Link to="/" style={{ textDecoration: "none", color: "#333" }}>בית</Link>
                </li>
                <li style={{ marginLeft: 20 }}>
                    <Link to="/about" style={{ textDecoration: "none", color: "#333" }}>אודות</Link>
                </li>
                <li style={{ marginLeft: 20 }}>
                    <Link to="/login" style={{ textDecoration: "none", color: "#333" }}>להתחברות</Link>
                </li>
                {/* <li style={{ marginLeft: 20 }}>
                    <Link to="/register" style={{ textDecoration: "none", color: "#333" }}>להרשמה</Link>
                </li> */}
                {/* <li style={{ marginLeft: 20 }}>
                    <Link to="/auth" style={{ textDecoration: "none", color: "#333" }}>כניסה</Link>
                </li> */}
                <li style={{ marginLeft: 20 }}>
                    <Link to="/exam-list" style={{ textDecoration: "none", color: "#333" }}>רשימת מבחנים</Link>
                </li>
                <li style={{ marginLeft: 20 }}>
                    <Link to="/add-exam" style={{ textDecoration: "none", color: "#333" }}>הוסף מבחן</Link>
                </li>
                {/* <li style={{ marginLeft: 20 }}>
                    <Link to="/exam-upload" style={{ textDecoration: "none", color: "#333" }}>העלה מבחן</Link>
                </li> */}
            </ul>
        </nav>
    );
};

export default Navbar;