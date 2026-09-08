import { Link } from "react-router-dom";
import '../style/navbar.css';

function NavBar() {
    return (
        <div className="navbar">
            <div className="logo"> To Do App </div>
            <ul className="nav-links">
                <li> <Link to="/"> List </Link> </li>
                <li> <Link to="/add"> Add Task </Link> </li>
            </ul>
        </div>
    )
}

export default NavBar;