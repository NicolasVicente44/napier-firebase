import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  fetchTasks,
  updateTaskStatus,
  addTask,
  deleteTask,
  updateTask, // Import the updateTask function
} from "../../controllers/kanbanController";

Modal.setAppElement("#root");

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null); // State to track the task being edited
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    const unsubscribe = fetchTasks(setTasks);
    return () => unsubscribe();
  }, []);

  const handleDragStart = (event, id) => {
    event.dataTransfer.setData("taskId", id);
  };

  const handleDrop = async (event, status) => {
    const taskId = event.dataTransfer.getData("taskId");
    await updateTaskStatus(taskId, status);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewTask({ title: "", description: "", dueDate: "" });
    setIsEditMode(false); // Reset the edit mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleAddOrUpdateTask = async () => {
    if (newTask.title) {
      if (isEditMode) {
        await updateTask(currentTaskId, newTask); // Update task if in edit mode
      } else {
        await addTask({ ...newTask, status: "todo" });
      }
      closeModal();
    }
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
  };

  const handleEditTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
    });
    setCurrentTaskId(task.id);
    setIsEditMode(true);
    openModal();
  };

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white p-2 rounded-lg shadow"
        >
          Add Task
        </button>
      </div>
      <div className="flex justify-center space-x-4">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, column.id)}
            className="w-1/3 bg-gray-100 p-4 rounded-lg shadow-lg min-h-[400px]"
          >
            <h2 className="text-2xl font-semibold mb-4">{column.title}</h2>
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="bg-white p-4 mb-3 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                >
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Due: {task.dueDate || "No due date"}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-blue-500 text-sm hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 text-sm hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded shadow-lg max-w-md mx-auto"
        overlayClassName="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? "Edit Task" : "Add New Task"}
        </h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={newTask.dueDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="button"
            onClick={handleAddOrUpdateTask}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            {isEditMode ? "Update Task" : "Add Task"}
          </button>
        </form>
        <button onClick={closeModal} className="mt-4 text-gray-600">
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default KanbanBoard;
