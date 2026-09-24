import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [userData, setUserData] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('login')) {
            navigate("/");
        }
    }, [])

    async function handleLoginForm(event) {
        event.preventDefault();
        let response = await fetch(`${import.meta.env.VITE_API_url}/login`, {
            method: "post",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "Application/json"
            },
            credentials: "include"
        })
        response = await response.json();
        if(response.success) {
            //document.cookie = "token="+response.token;
            localStorage.setItem('login', userData.email);
            window.dispatchEvent(new Event("localStorage-change"));
            navigate("/")
        }
        else {
            alert("Login not done");
        }
    }
    return (
        <>
            <div className="container">
                <h1> Login </h1>
                
                <form onSubmit={handleLoginForm}>
                    <label htmlFor="email"> Email : </label>
                    <input type="text" placeholder="Enter your email" name="email" id="email" onChange={(ev) => setUserData({...userData, email: ev.target.value})} />

                    <label htmlFor="password"> Password : </label>
                    <input type="password" placeholder="Enter your password" name="password" id="pass" onChange={(ev) => setUserData({...userData, password: ev.target.value})} />

                    <button type="submit" className="btn"> Login </button>
                </form>
                <Link to="/signup" className="link"> Signup </Link>
            </div>
        </>
    )
}