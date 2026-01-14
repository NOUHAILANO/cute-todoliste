import { useState, useEffect } from "react";

function Todoliste() {
  const [tasks, settasks] = useState([]);
  const [newtask, setnewtask] = useState("");
  const [editid, seteditid] = useState(null);
  const [newtitle, setnewtitle] = useState("");
  const [loading, setLoading] = useState(true);

  const API = "https://6967a08ebbe157c088b28cd8.mockapi.io/tasks";

  // FETCH TASKS
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => settasks(data))
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ADD TASK
  const addtask = () => {
    if (newtask.trim() === "") return;

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newtask, completed: false }),
    })
      .then((res) => res.json())
      .then((task) => {
        settasks([...tasks, task]);
        setnewtask("");
      })
      .catch((err) => console.error("Add task error:", err));
  };

  // START EDIT
  const startedit = (task) => {
    seteditid(task.id);
    setnewtitle(task.title);
  };

  // SAVE EDIT
  const saveedit = () => {
    const currentTask = tasks.find((t) => t.id === editid);
    if (!currentTask) return;

    fetch(`${API}/${editid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newtitle,
        completed: currentTask.completed,
      }),
    })
      .then((res) => res.json())
      .then((updated) => {
        settasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
        seteditid(null);
        setnewtitle("");
      })
      .catch((err) => console.error("Save edit error:", err));
  };

  // DELETE TASK
  const deletetask = (id) => {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(() => settasks(tasks.filter((t) => t.id !== id)))
      .catch((err) => console.error("Delete task error:", err));
  };

  // TOGGLE DONE
  const toggleDone = (task) => {
    fetch(`${API}/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    })
      .then((res) => res.json())
      .then((updated) =>
        settasks(tasks.map((t) => (t.id === updated.id ? updated : t)))
      )
      .catch((err) => console.error("Toggle done error:", err));
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
        <div className="text-center mb-3">
          <h2 className="fw-bold" style={{ color: "#ff4da6" }}>
            🌸 My Cute Todo
          </h2>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-8 col-sm-9">
            <input
              type="text"
              className="form-control rounded-pill border-0 shadow-sm"
              placeholder="Add a new task ✨"
              value={newtask}
              onChange={(e) => setnewtask(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.8)",
                padding: "12px 20px",
              }}
            />
          </div>
          <div className="col-4 col-sm-3">
            <button
              className="btn w-100 rounded-pill fw-bold shadow-sm border-0"
              style={{
                background: "linear-gradient(45deg, #ff6b9d, #ff8fab)",
                color: "white",
                padding: "12px 0",
                fontSize: "16px",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
              onClick={addtask}
            >
              🌟 Add
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-pink" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2" style={{ color: "#ff69b4" }}>
              Loading cute tasks...
            </p>
          </div>
        ) : (
          <ul
            className="list-group list-group-flush overflow-auto p-2"
            style={{ maxHeight: "50vh" }}
          >
            {tasks.map((t) => (
              <li
                key={t.id}
                className="list-group-item rounded-4 mb-3 border-0 shadow-sm"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  borderLeft: `5px solid ${t.completed ? "#98fb98" : "#ffb6c1"}`,
                }}
              >
                {editid === t.id ? (
                  <div className="d-flex flex-column gap-2">
                    <input
                      className="form-control rounded-pill border-0 shadow-sm"
                      value={newtitle}
                      onChange={(e) => setnewtitle(e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        padding: "10px 15px",
                      }}
                    />
                    <button
                      className="btn rounded-pill fw-bold border-0 shadow-sm"
                      style={{
                        background: "linear-gradient(45deg, #5dff9d, #00e6a9)",
                        color: "white",
                        padding: "8px 20px",
                        transition: "all 0.3s",
                      }}
                      onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                      onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                      onClick={saveedit}
                    >
                      💾 Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="d-flex align-items-start mb-2">
                      <span
                        className="flex-grow-1"
                        style={{
                          textDecoration: t.completed ? "line-through" : "none",
                          color: t.completed ? "#999" : "#d63384",
                          fontSize: "16px",
                          fontWeight: "500",
                        }}
                      >
                        {t.completed ? "✅ " : "📝 "}
                        {t.title}
                      </span>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn rounded-pill flex-fill fw-bold border-0 shadow-sm"
                        style={{
                          background: "linear-gradient(45deg, #ffd166, #ffb347)",
                          color: "white",
                          padding: "8px 15px",
                          fontSize: "14px",
                          transition: "all 0.3s",
                        }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                        onClick={() => startedit(t)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn rounded-pill flex-fill fw-bold border-0 shadow-sm"
                        style={{
                          background: "linear-gradient(45deg, #ff6b6b, #ff8e8e)",
                          color: "white",
                          padding: "8px 15px",
                          fontSize: "14px",
                          transition: "all 0.3s",
                        }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                        onClick={() => deletetask(t.id)}
                      >
                        🗑️ Delete
                      </button>
                      <button
                        className="btn rounded-pill flex-fill fw-bold border-0 shadow-sm"
                        style={{
                          background: t.completed 
                            ? "linear-gradient(45deg, #a8e6cf, #dcedc1)"
                            : "linear-gradient(45deg, #84fab0, #8fd3f4)",
                          color: t.completed ? "#555" : "white",
                          padding: "8px 15px",
                          fontSize: "14px",
                          transition: "all 0.3s",
                        }}
                        onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                        onClick={() => toggleDone(t)}
                      >
                        {t.completed ? "↩️ Undo" : "✓ Done"}
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {!loading && tasks.length === 0 && (
          <div className="text-center mt-4">
            <div style={{ fontSize: "48px" }}>📝</div>
            <p style={{ color: "#ff69b4", fontWeight: "500" }}>
              No tasks yet! Add your first cute task!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Todoliste;