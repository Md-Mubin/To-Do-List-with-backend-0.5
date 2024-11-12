import React, { useEffect, useState } from 'react'
import './List.css'
import { FaCheck, FaEdit, FaPlus, FaSave, FaTrash } from 'react-icons/fa'
import { getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database'

const List = () => {

  // All Hooks
  const [todo, setTodo] = useState("") // input todo data catch
  const [allToDo, setAllToDo] = useState([])
  const [todoError, setTodoError] = useState("") // input todo data error

  const [startEdit, setStartEdit] = useState(false) 
  const [editedData, setEditedData] = useState("")

  const [check, setCheck] = useState(false)

  const db = getDatabase(); // database variable

  // for input empty
  const handleInput = () => {
    if (!todo) {
      setTodoError("Please Enter Something")
    } else {

      set(push(ref(db, 'allToDoLists/')), { // to write data in firebase function
        allToDoData: todo
      }).then(() => {
        setTodo("")
      })
    }
  }

  // reading data 
  useEffect(() => { // to read data from database
    onValue(ref(db, 'allToDoLists/'), (snapshot) => {

      const array = [] // to turn objects into array

      snapshot.forEach((items) => {
        array.push({ ...items.val(), keys: items.key })
        console.log(items.key)
      })

      setAllToDo(array)
    })
  }, [])

  // to delete data
  const handleDelete=(deletedData)=>{
    remove(ref(db, 'allToDoLists/' + deletedData.keys))
  }

  // for handling Enter
  const handleEnetr = (e) => {
    if (e.key == "Enter") {
      handleInput()
      handleEditedData()
    }
  }

  const handleEdit= (items)=>{
    setStartEdit(true)
    setEditedData(items)
  }
  
  const handleEditedData=()=>{
    update(ref(db, 'allToDoLists/' + editedData.keys),{
      allToDoData: editedData.allToDoData
    })
    
    setStartEdit(false)
    setTodoError("")
  }

  const handleCheck=(key)=>{
    setAllToDo(allToDo.map(item => 
      item.keys === key ? { ...item, checked: !item.checked } : item
    ));
  }

  return (
    <>
      <section className='listSection'>
        <div className="container">

          <ul className="inputPart">
            <input value={startEdit ? editedData.allToDoData : todo} onKeyDown={(e) => handleEnetr(e)} 
            
            onChange={startEdit ? (e)=>{ setEditedData({...editedData, allToDoData:e.target.value})} : (e) => { setTodo(e.target.value), setTodoError("") }} 
            
            type="text" placeholder='Add Tasks' />

            <p className='todoError'>{todoError}</p>
            {
              startEdit ? 
              <button onClick={handleEditedData}><FaSave/></button>
              :
              <button onClick={handleInput}><FaPlus /></button>
            }
          </ul>

          <ul className='tasksArea'>
            {
              allToDo.map((items) => (
                <li key={items.keys} className='mainTask'>
                  <h3 className='task'>{items.allToDoData}</h3>
                  <button onClick={()=>handleEdit(items)} className="editButton">
                    <FaEdit/>
                  </button>

                  <button onClick={()=>handleDelete(items)} className='deleteButton'><FaTrash/></button>
                  <button onClick={()=>handleCheck(items.keys)} className={items.checked ? "checkButton" : "uncheckButton"}><FaCheck /></button>
                </li>
              ))
            }

          </ul>
        </div>
      </section>
    </>
  )
}

export default List