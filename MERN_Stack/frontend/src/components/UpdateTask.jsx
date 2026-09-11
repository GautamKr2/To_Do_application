import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function UpdateTask() {
    const navigate = useNavigate();

    const locData = useLocation();
    let [datas, setDatas] = useState(locData.state.data);
    useEffect(() => {
        setDatas = locData.state;
    }, [])
    setDatas = locData.state.data;
    console.log(datas);

    const [taskData, setTaskData] = useState(datas);

    async function handleUpdate() {
        let resp = await fetch("http://localhost:3200/update-task/"+taskData._id, {
            method: "put",
            body: JSON.stringify(taskData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        resp = await resp.json();
        console.log(resp);
        if(resp.success) {
            console.log("Task updated successfully");
            navigate('/');
        }
        else {
            console.log("Error in updating task");
            navigate('/add');
        }
    }

    return (
        <div className="container">
            <h1> Update Task </h1>

            <form onSubmit={handleUpdate}>
                <label htmlFor="title"> Title : </label>
                <input type="text" placeholder="Enter task title" name="title" id="title" value={taskData.title} onChange={(ev) => setTaskData({...taskData, title: ev.target.value})} />

                <label htmlFor="description"> Description : </label>
                <textarea rows={5} type="text" placeholder="Enter task description" name="description" id="description" value={taskData.description} onChange={(ev) => setTaskData({...taskData, description: ev.target.value})} />

                <button className="btn"> Update task </button>
            </form>
        </div>
    )
}