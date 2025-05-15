import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API, authHeaders } from "../../utils/auth";

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [task, setTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [editData, setEditData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!storedToken || !storedUserId) {
      router.push("/"); // Redirect to login if not authenticated
      return;
    }

    setToken(storedToken);
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!token || !id) return;

    fetch(`${API}/tasks/${id}`, authHeaders(token))
      .then((res) => res.json())
      .then((data) => {
        setTask(data);
        setEditData({
          title: data.title,
          description: data.description,
          dueDate: data.dueDate?.split("T")[0],
          priority: data.priority,
        });
      });
  }, [id, token]);

  const updateStatus = async () => {
    await fetch(`${API}/tasks/${id}/status`, {
      method: "PUT",
      ...authHeaders(token),
      body: JSON.stringify({
        status: task.status === "pending" ? "completed" : "pending",
      }),
    });
    router.reload();
  };

  const deleteTask = async () => {
    if (!confirm("Delete task?")) return;
    await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      ...authHeaders(token),
    });
    router.push("/tasks");
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      ...authHeaders(token),
      body: JSON.stringify(editData),
    });
    setShowModal(false);
    router.reload();
  };

  if (!token || !userId) return <p className="text-center mt-10">Loading...</p>;
  if (!task) return <p className="text-center mt-10">Fetching task...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          {task.title}
        </h1>
        <div
          onClick={() => router.push("/tasks")}
          className="text-xl mb-4 p-2 px-4 text-white cursor-pointer bg-black rounded-full"
        >
          &lt;
        </div>
      </div>

      <p className="text-lg text-gray-700 mb-4">{task.description}</p>

      <p className="text-md text-gray-600 mb-2">
        <span className="font-semibold">Due:</span> {task.dueDate?.split("T")[0]}
      </p>

      <p className="text-md text-gray-600 mb-2">
        <span className="font-semibold">Status:</span> {task.status}
      </p>

      <p className="text-md text-gray-600 mb-4">
        <span className="font-semibold">Priority:</span> {task.priority}
      </p>

      <div className="flex space-x-4 mt-6">
        <button
          onClick={updateStatus}
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
        >
          Toggle Status
        </button>

        <button
          onClick={() => setShowModal(true)}
          disabled={task.status === "completed"}
          className={`px-4 py-2 rounded-md shadow-md text-white ${
            task.status === "completed"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          Edit
        </button>

        <button
          onClick={deleteTask}
          disabled={task.createdBy !== userId}
          className={`px-4 py-2 rounded-md shadow-md text-white ${
            task.createdBy !== userId
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          Delete
        </button>
        {task.createdBy !== userId && (
          <p className="text-sm text-gray-500 mt-1">
            You can only delete your own tasks.
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Title"
              />
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Description"
              />
              <input
                type="date"
                value={editData.dueDate}
                onChange={(e) =>
                  setEditData({ ...editData, dueDate: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
              <select
                value={editData.priority}
                onChange={(e) =>
                  setEditData({ ...editData, priority: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
