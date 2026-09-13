import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
    const [userData, setUserData] = useState();

    async function handleLoginForm(event) {
        event.preventDefault();
        let response = await fetch("http://localhost:3200/login", {
            method: "post",
            body: JSON.stringify(userData),
            Headers: {
                "Content-Type": "Application/json"
            }
        })
        response = await response.json();
        if(response.success) {
            console.log("Login Successful")
        }
        else {
            console.log("Login not done");
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