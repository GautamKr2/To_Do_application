import { Link } from "react-router-dom";
import '../style/navbar.css';
import { useState } from "react";

function NavBar() {
    const [login, setLogin] = useState(localStorage.getItem('login'))

    return (
        <div className="navbar">
            <div className="logo"> To Do App </div>
            <ul className="nav-links">
                {
                    login ?
                        <>
                            <li> <Link to="/"> List </Link> </li>
                            <li> <Link to="/add"> Add Task </Link> </li>
                            <li> <Link to="/add"> Logout </Link> </li>
                        </>
                    :
                        <li> <Link to="/login"> Login/SignUp </Link> </li>
                }
                
            </ul>
        </div>
    )
}

export default NavBar;