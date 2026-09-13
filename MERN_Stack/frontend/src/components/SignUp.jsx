import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
    const [userData, setUserData] = useState();
    const navigate = useNavigate();

    const handleSignupForm = async (event) => {
        event.preventDefault();
        let response = await fetch("http://localhost:3200/signup",{
            method: "post",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "Application/json"
            }
        })
        response = await response.json();
        if(response.success) {
            document.cookie = "token="+response.token;
            navigate("/");
        }
        else {
            console.log(response.message)
        }
    }

    return (
        <>
            <div className="container">
                <h1> Sign Up </h1>
                <form onSubmit={handleSignupForm}>
                    <label htmlFor="name"> Name : </label>
                    <input type="text" placeholder="Enter name" name="name" id="name" onChange={(ev) => setUserData({...userData, name: ev.target.value})} />

                    <label htmlFor="email"> Email : </label>
                    <input type="text" placeholder="Enter email" name="email" id="email" onChange={(ev) => setUserData({...userData, email: ev.target.value})} />

                    <label htmlFor="pass"> Password : </label>
                    <input type="password" placeholder="Create password" autoComplete="new-password" name="passord" id="pass"onChange={(ev) => setUserData({...userData, password: ev.target.value})} />

                    <button type="submit" className="btn"> Sign Up </button>
                </form>
                <Link to="/login" className="link"> Login </Link>
            </div>
        </>
    )
}