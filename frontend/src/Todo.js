import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const apiUrl = "http://localhost:8000";
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description })
      })
        .then((res) => {
          if (res.ok) {
            // add item to listt
            setTodos([...todos, { title, description }]);
            setTitle("");
            setDescription("");
            setMessage("Item Added Successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000)
          } else {
            // set error
            setError("Unable to create Todo item")
          }
        })
        .catch(() => {
          setError("Unable to create Todo item")
        })
    }
  };


  useEffect(()=> {
    getItems()
  },[])
  const getItems = () => {
    fetch (apiUrl+'/todos').then((res)=> res.json()).then((res)=> {
      setTodos(res)
    })
  }
  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>Todo Project With MERN</h1>
      </div>
      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        <div className="form-group d-flex gap-2">
          <input
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="form-control"
            value={title}
            type="text"
          />
          <input
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="form-control"
            value={description}
            type="text"
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
          {error && <p className="text-danger">{error}</p>}
        </div>
      </div>
      <div className="row mt-3">
        <h3>Tasks</h3>
        <ul className="list-group">
        {
          todos.map((item)=> 
             <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
            <div className="d-flex flex-column">
              <span className="fw-bold">{item.title}</span>
              <span>{item.description}</span>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-warning" onClick={()=> setEditId(item._id)}>Edit</button>
              <button className="btn btn-danger">Delete</button>
            </div>
          </li>
          )
        }
         
        </ul>
      </div>
    </>
  );
}
