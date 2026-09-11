import { Fragment, useEffect, useState } from "react"
import "../style/tasklist.css";

export default function TaskList() {
    const [taskList, setTaskList] = useState();

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

    return (
        <div>
            <h1 className="list-msg"> Your task list </h1>
            <ul className="task-list">
                <li className="list-header"> S.No </li>
                <li className="list-header"> Title </li>
                <li className="list-header"> Description </li>
                <li className="list-header"> Actions </li>
                {
                    taskList && taskList.map((item, index) => (
                        <Fragment key={item._id}>
                            <li className="list-item"> {index+1} </li>
                            <li className="list-item"> {item.title} </li>
                            <li className="list-item"> {item.description} </li>
                            <li className="list-item">
                                <button className="delete-btn" onClick={() => deleteTask(item._id)}> Delete </button>
                                <button className="edit-btn"> Update </button>
                            </li>
                        </Fragment>
                    ))
                }
            </ul>
        </div>
    )
}