import { Link, Navigate, useNavigate } from "react-router-dom";
import '../style/navbar.css';
import { useEffect, useState } from "react";

function NavBar() {
    const [login, setLogin] = useState(localStorage.getItem('login'));
    const navigate = useNavigate();

    function Logout() {
        localStorage.removeItem('login');
        window.dispatchEvent(new Event("localStorage-change"));
        navigate("/login");
    }

    useEffect(() => {
        const handleStorage = () => {
            setLogin(localStorage.getItem('login'));
        }
        window.addEventListener("localStorage-change", handleStorage);
        return () => {
            window.removeEventListener("localStorage-change", handleStorage);
        }
    }, [])

    return (
        <div className="navbar">
            <div className="logo"> To Do App </div>
            <ul className="nav-links">
                {
                    login ?
                        <>
                            <li> <Link to="/"> List </Link> </li>
                            <li> <Link to="/add"> Add Task </Link> </li>
                            <li> <button className="logout-btn" onClick={Logout}> Logout </button> </li>
                        </>
                    :
                        <li> <Link to="/login"> Login/SignUp </Link> </li>
                }
                
            </ul>
        </div>
    )
}

export default NavBar;