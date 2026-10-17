import Todo from "./components/todo";
import Form from "./components/form";
import FilterButton from "./components/filterbutton";
import { useState, useRef, useEffect} from "react";
import { nanoid } from "nanoid";
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
 const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);
function App(props) {
  const [tasks, setTasks] = useState(props.tasks)
  const [filter, setFilter] = useState("All")
 
const tasklist = tasks?.filter(FILTER_MAP[filter]).map((task)=>(<Todo name = {task.name} id={task.id} key={task.id}completed={task.completed}toggleTaskComplete={toggleTaskComplete} deleteTask={deleteTask} editTask={editTask}/>))
const filterList = FILTER_NAMES.map((name) => (
  <FilterButton key={name} name={name} isPressed={name === filter} setFilter={setFilter}/>
));
function editTask(id, newName) {
  const editedTaskList = tasks.map((task) => {
    // if this task has the same ID as the edited task
    if (id === task.id) {
      // Copy the task and update its name
      return { ...task, name: newName };
    }
    // Return the original task if it's not the edited task
    return task;
  });
  setTasks(editedTaskList);
}

function addTask(name) {
  if(name === ""){
    alert("Please fill in the field")
    return
  }
  const newTask = {
    id:`todo-${nanoid()}`,
    name:name,
    completed:false
  }
  
  setTasks([...tasks,newTask])

}
function toggleTaskComplete(id) {
  const updatedTaskList = tasks.map((task)=>{
    if (id == task.id){
      return{...task, completed:!task.completed}
    }
    return task
  })
  setTasks(updatedTaskList)
  
}
function deleteTask(id) {
  const updatedTask = tasks.filter((task) =>{
    if (id !== task.id){
      return task
    }
  })
 setTasks(updatedTask)
}

const headingtText = `${tasklist.length} ${tasklist.length !==1 ? "tasks":"task"} remaining`;
const listHeadingRef = useRef(null);
const prevTaskLength = usePrevious(tasks.length);
useEffect(() => {
  if (tasks.length < prevTaskLength) {
    listHeadingRef.current.focus();
  }
}, [tasks.length, prevTaskLength]);
  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
        
      {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>{headingtText}</h2>
      <ul
  role="list"
  className="todo-list stack-large stack-exception"
  aria-labelledby="list-heading">
  {tasklist}
</ul>
    </div>
  );
}

export default App;