import './style/App.css'
import NavBar from './components/NavBar'
import { Route, Routes } from 'react-router-dom'
import AddTask from './components/addTask'
import TaskList from './components/taskList'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<TaskList />} />
        <Route path='/add' element={<AddTask />} />
      </Routes>
    </>
  )
}

export default App
