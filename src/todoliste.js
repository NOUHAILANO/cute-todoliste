import { useState, useEffect } from "react";

function Todoliste() {
  const [tasks, settasks] = useState([]);
  const [newtask, setnewtask] = useState("");
  const [editid, seteditid] = useState(null);
  const [newtitle, setnewtitle] = useState("");

  // FETCH TASKS
  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then((res) => res.json())
      .then((data) => settasks(data));
  }, []);

  // ADD TASK
  const addtask = () => {
    if (newtask.trim() === "") return;
    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newtask, completed: false }),
    })
      .then((res) => res.json())
      .then((task) => {
        settasks([...tasks, task]);
        setnewtask("");
      });
  };

  // START EDIT
  const startedit = (task) => {
    seteditid(task.id);
    setnewtitle(task.title);
  };

  // SAVE EDIT
  const saveedit = () => {
    fetch(`http://localhost:3001/tasks/${editid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editid,
        title: newtitle,
        completed: tasks.find((t) => t.id === editid)?.completed,
      }),
    })
      .then((res) => res.json())
      .then((updated) => {
        settasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
        seteditid(null);
        setnewtitle("");
      });
  };

  // DELETE TASK
  const deletetask = (id) => {
    fetch(`http://localhost:3001/tasks/${id}`, { method: "DELETE" }).then(() =>
      settasks(tasks.filter((t) => t.id !== id))
    );
  };

  // TOGGLE DONE
  const toggleDone = (task) => {
    fetch(`http://localhost:3001/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    })
      .then((res) => res.json())
      .then((updated) =>
        settasks(tasks.map((t) => (t.id === updated.id ? updated : t)))
      );
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-start px-2 px-sm-3 px-md-4 py-4"
      style={{
        background: "linear-gradient(135deg, #ffb6c1, #ffe4e1, #fbc2eb)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="card shadow-lg rounded-4 p-3 p-sm-4 w-100"
        style={{
          maxWidth: "420px",
          minHeight: "500px",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(15px)",
          border: "2px solid rgba(255,255,255,0.4)",
        }}
      >
        {/* HEADER */}
        <div className="text-center mb-3">
          <h2
            className="fw-bold"
            style={{
              color: "#ff4da6",
              textShadow: "0 2px 10px rgba(255,77,166,0.4)",
            }}
          >
            🌸 My Cute Todo
          </h2>
        </div>

        {/* INPUT */}
        <div className="row g-2 mb-3">
          <div className="col-8 col-sm-9">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Add a new task ✨"
              value={newtask}
              onChange={(e) => setnewtask(e.target.value)}
            />
          </div>
          <div className="col-4 col-sm-3">
            <button
              className="btn w-100 rounded-pill"
              style={{
                backgroundColor: "#ff69b4",
                color: "white",
                fontWeight: "bold",
              }}
              onClick={addtask}
            >
              Add
            </button>
          </div>
        </div>

        {/* EMPTY STATE */}
        {tasks.length === 0 && (
          <p className="text-center mt-4" style={{ color: "#d63384" }}>
            🌸 No tasks yet… add something cute!
          </p>
        )}

        {/* TASK LIST */}
        <ul
          className="list-group list-group-flush overflow-auto"
          style={{ maxHeight: "50vh" }}
        >
          {tasks.map((t) => (
            <li
              key={t.id}
              className="list-group-item rounded-4 mb-3"
              style={{
                background: "rgba(255,255,255,0.7)",
                boxShadow: "0 8px 20px rgba(255,105,180,0.25)",
                border: "1px solid rgba(255,105,180,0.3)",
              }}
            >
              {editid === t.id ? (
                <>
                  <input
                    className="form-control mb-2"
                    value={newtitle}
                    onChange={(e) => setnewtitle(e.target.value)}
                  />
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm rounded-pill"
                      onClick={saveedit}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm rounded-pill"
                      onClick={() => seteditid(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span
                    style={{
                      fontSize: "clamp(14px, 2.5vw, 16px)",
                      fontWeight: "600",
                      textDecoration: t.completed ? "line-through" : "none",
                      color: t.completed ? "#999" : "#d63384",
                      wordBreak: "break-word",
                    }}
                  >
                    {t.title}
                  </span>

                  <div className="d-flex flex-wrap justify-content-end gap-2 mt-2">
                    <button
                      className="btn btn-sm btn-outline-warning rounded-pill"
                      onClick={() => startedit(t)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill"
                      onClick={() => deletetask(t.id)}
                    >
                      🗑 Delete
                    </button>
                    <button
                      className={`btn btn-sm rounded-pill ${
                        t.completed ? "btn-outline-success" : "btn-success"
                      }`}
                      onClick={() => toggleDone(t)}
                    >
                      {t.completed ? "↩ Undone" : "✔ Done"}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todoliste;
