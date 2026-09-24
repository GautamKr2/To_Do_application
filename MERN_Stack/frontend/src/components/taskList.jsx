import { Fragment, useEffect, useState } from "react"
import "../style/tasklist.css";
import { useNavigate } from "react-router-dom";

export default function TaskList() {
    const [taskList, setTaskList] = useState();
    const navigate = useNavigate();  // used to navigate to another page
    const [selectedTask, setSelectedTask] = useState([]);


    // To get data from backend
    useEffect(() => {
        getListData();
    }, [])

    async function getListData() {
        let list = await fetch(`${import.meta.env.VITE_API_url}/tasks`, {
            credentials: 'include'
        });
        console.log(`${import.meta.env.VITE_API_url}`)
        list = await list.json();
        if(list.success) {
            setTaskList(list.taskList);
        }
        else {
            alert("Please login first")
        }
    }


    // To delete single task
    async function deleteTask(id) {
        let resp = await fetch(`${import.meta.env.VITE_API_url}/delete-task/`+id, {
            method: 'delete',
            credentials: 'include'
        });
        resp = await resp.json();
        if(resp.success) {
            getListData();
        }
        else {
            alert("Please login first")
        }
    }


    // To update task, we will navigate to update page and pass the data of that task to update page
    async function updateTask(id) {
        let data = await fetch(`${import.meta.env.VITE_API_url}/update-task/`+id, {
            credentials: 'include'
        });
        data = await data.json();
        if(data) {
            navigate("/update", { state: { data: data.task }});
        }
        else {
            alert("Please login first")
        }
    }


    // Function to handle selection of tasks
    const selectAllTask = (ev) => {
        if(ev.target.checked) {
            setSelectedTask(taskList.map((task) => task._id));
        }
        else {
            setSelectedTask([]);
        }
    }
    
    const handleSelectedTask = (id) => {
        if(selectedTask.includes(id)) {
            const tasks = selectedTask.filter((taskId) => taskId != id);
            setSelectedTask(tasks);
        }
        else {
            setSelectedTask([...selectedTask, id]);
        }
    }


    // To delete multiple task
    const deleteMultipleTasks = async () => {
        if(selectedTask?.length > 0) {
            let response = await fetch(`${import.meta.env.VITE_API_url}/multi-delete`, {
                method: 'delete',
                body: JSON.stringify(selectedTask),
                headers: {
                    "Content-Type": "Application/json"
                },
                credentials: 'include'
            })
            response = await response.json();
            if(response.success) {
                getListData();
            }
            else {
                console.log("Error in deleting multiple tasks");
            }
        }
    }
    

    return (
        <div>
            <h1 className="list-msg"> Your task list </h1>
            <button className="delete-btn multi-delete" onClick={deleteMultipleTasks}> Multi-Delete </button>
            <ul className="task-list">
                <li className="list-header"> <input type="checkbox" className="chk-box" onChange={selectAllTask} checked={selectedTask?.length === taskList?.length && taskList?.length > 0} /> </li>
                <li className="list-header"> S.No </li>
                <li className="list-header"> Title </li>
                <li className="list-header"> Description </li>
                <li className="list-header action"> Actions </li>
                {
                    taskList && taskList.map((item, index) => (
                        <Fragment key={item._id}>
                            <li className="list-item"> <input type="checkbox" className="chk-box" checked={selectedTask.includes(item._id)} onChange={() => handleSelectedTask(item._id)} /> </li>
                            <li className="list-item"> {index+1} </li>
                            <li className="list-item"> {item.title} </li>
                            <li className="list-item"> {item.description} </li>
                            <li className="list-item">
                                <button className="delete-btn" onClick={() => deleteTask(item._id)}> Delete </button>
                                <button className="edit-btn" onClick={() => updateTask(item._id)}> Update </button>
                            </li>
                        </Fragment>
                    ))
                }
            </ul>
        </div>
    )
}