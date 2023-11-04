import { useCallback, useEffect, useState } from "react";
import { axiosInstance } from "../axios.config";
// import { data } from "jquery";
import debounce from "lodash/debounce";

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");

  const handleChange = (e) => {
    setTaskName(e.target.value);
  };

  function getTodos() {
    axiosInstance
      .get("/todos")
      .then((data) => setTodos(data.data))
      .catch((error) => alert(error.code, error.message));
  }

  useEffect(() => {
    getTodos();
  }, []);

  const handleDelete = (id) => {
    axiosInstance
      .delete(`todos/${id}`)
      .then(() => getTodos())
      .catch((error) => alert(error.code, error.message));
  };
  const handleEdit = (content) => {
    axiosInstance
      .patch(`/todos/${content.id}`, {
        ...content,
        isCompleted: !content.isCompleted,
      })
      .then(() => getTodos())
      .catch((error) => alert(error.code, error.message));
  };
  const handleDone = (status) => {
    axiosInstance
      .patch(`/todos/${status.id}`, {
        ...status,
        isCompleted: !status.isCompleted,
      })
      .then(() => getTodos())
      .catch((error) => alert(error.code, error.message));
  };

  const addTask = async (e) => {
    e.preventDefault();
    axiosInstance
      .post("/todos", {
        taskName,
        isCompleted: false,
      })
      .then(() => getTodos())
      .catch((error) => alert(error.code, error.message))
      .finally(() => setTaskName(""));
  };

  const handleSearch = (search) => {
    console.log(search);
    axiosInstance
      .get(`/todos`, {
        params: {
          q: search,
        },
      })
      .then((data) => setTodos(data.data))
      .catch((error) => alert(error.code, error.message));
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  return (
    <div className="todolist">
      <div className="search" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Search ex: todo 1"
          onChange={(e) => debouncedHandleSearch(e.target.value)}
        />
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Add a task........"
          value={taskName}
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div
            key={id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}
          >
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete"
              >
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit"
              >
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
