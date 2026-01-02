import { useState,useEffect } from "react";
function Todoliste(){
  const [tasks,settasks]=useState([])
  const [newtask,setnewtask]=useState('')
  useEffect(()=>{
    fetch('http://localhost:3001/tasks')
    .then(res=>res.json())
    .then(data=>settasks(data))
  },[])
  


const addtask=()=>{
  if (newtask==="")return;
  fetch("http://localhost:3001/tasks",{
    method:'POST',
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({title:newtask})
  })
  .then(res=>res.json())
  .then(task=>{settasks([...tasks,task]);
setnewtask('')});
}

return(
  <div>
    <input type="text" value={newtask} /><button onClick={addtask}>add</button>
    {tasks.map((t)=>{return <div key={t.id}>{t.title}</div>})}
  </div>
)
  
}export default Todoliste;