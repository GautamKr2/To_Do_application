import { useState } from "react";
import "../style/addtask.css";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
    const [taskData, setTaskData] = useState();
    const navigate = useNavigate();  // use to navigate on another router

    const handleTaskData = async (event) => {
        event.preventDefault();

        let response = await fetch("http://localhost:3200/add-task", {
            method: "post",
            body: JSON.stringify(taskData),
            headers: {
                "Content-Type": "Application/json"
            }
        })
        const result = await response.json();
        if(result.success) {
            navigate("/");
            console.log("New task Added")
        }
    }

    return (
        <>
            <div className="container">
                <h1> Add new Task </h1>
                <form onSubmit={handleTaskData}>
                    <label htmlFor="title"> Title : </label>
                    <input onChange={(ev) => setTaskData({...taskData, title:ev.target.value})} type="text" placeholder="Enter task title" name="title" id="title"/>
                    
                    <label htmlFor="desc"> Description : </label>
                    <textarea onChange={(ev) => setTaskData({...taskData, description:ev.target.value})} rows={5} type="text" placeholder="Enter task description" name="description" id="desc"></textarea>
                    
                    <button /*onClick={handleTaskData}*/ className="btn" type="submit"> Add task </button>
                </form>
            </div>
        </>
    )
}