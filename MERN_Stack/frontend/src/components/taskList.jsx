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
        let list = await fetch("http://localhost:3200/tasks");
        list = await list.json();
        if(list.success) {
            setTaskList(list.taskList);
        }
    }


    // To delete single task
    async function deleteTask(id) {
        let resp = await fetch("http://localhost:3200/delete-task/"+id, {method: 'delete'});
        resp = await resp.json();
        if(resp.success) {
            getListData();
        }
    }


    // To update task, we will navigate to update page and pass the data of that task to update page
    async function updateTask(id) {
        let data = await fetch("http://localhost:3200/update-task/"+id);
        data = await data.json();
        navigate("/update", { state: { data: data.task }});
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
            let response = await fetch("http://localhost:3200/multi-delete", {
                method: 'delete',
                body: JSON.stringify(selectedTask),
                headers: {
                    "Content-Type": "Application/json"
                }
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