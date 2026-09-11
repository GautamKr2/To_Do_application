import { Fragment, useEffect, useState } from "react"
import "../style/tasklist.css";
import { useNavigate } from "react-router-dom";

export default function TaskList() {
    const [taskList, setTaskList] = useState();
    const navigate = useNavigate();

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
    
    async function deleteTask(id) {
        let resp = await fetch("http://localhost:3200/delete-task/"+id, {method: 'delete'});
        resp = await resp.json();
        if(resp.success) {
            getListData();
        }
    }

    async function updateTask(id) {
        let data = await fetch("http://localhost:3200/update-task/"+id);
        data = await data.json();
        navigate("/update", { state: { data: data.task }});
    }

    return (
        <div>
            <h1 className="list-msg"> Your task list </h1>
            <ul className="task-list">
                <li className="list-header"> S.No </li>
                <li className="list-header"> Title </li>
                <li className="list-header"> Description </li>
                <li className="list-header action"> Actions </li>
                {
                    taskList && taskList.map((item, index) => (
                        <Fragment key={item._id}>
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