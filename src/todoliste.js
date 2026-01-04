import { useState,useEffect } from "react";
function Todoliste(){
  const [tasks,settasks]=useState([])
  const [newtask,setnewtask]=useState('')
  const [editid,seteditid]=useState(null)
  const [newtitle,setnewtitle]=useState('')
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
const startedit=(task)=>{
  seteditid(task.id)
  setnewtitle(task.title)
}
const saveedit=()=>{
  fetch(`http://localhost:3001/tasks/${editid}`,{
    method:'PUT',
  headers:{'Content-Type':'application/json'},
body:JSON.stringify({id:editid,title:newtitle})
}
)
  .then(res=>res.json())
  .then(updated=>{settasks(tasks.map((t)=>t.id===updated.id?updated:t));
  seteditid(null);
  setnewtitle("");})
}





return(
  <div></div>
)
  
}export default Todoliste;