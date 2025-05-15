
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API, authHeaders } from "../../utils/auth";

export default function CreatedByMe() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const limit = 6;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (!storedToken) {
      router.push("/");
      return;
    }

    setToken(storedToken);
    setUsername(storedUsername);

    const fetchCreatedTasks = async () => {
      try {
        const res = await fetch(`${API}/tasks/created-by-me?page=${page}&limit=${limit}`, authHeaders(storedToken));
        const data = await res.json();
        setTasks(data);
        setHasMore(data.length === limit);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchCreatedTasks();
  }, [page]);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          <span className="text-blue-600">{username}'s</span> Created Tasks
        </h1>
        <div
          onClick={() => router.push("/tasks")}
          className="text-xl mb-4 p-2 px-4 text-white cursor-pointer bg-black rounded-full"
        >
          &lt;
        </div>
      </div>

      {tasks.length > 0 ? (
        <>
          <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">{task.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Due: <span className="font-medium">{task.dueDate?.split("T")[0]}</span>
                  </p>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Priority: {task.priority}</div>
                  {task.assignedTo && (
                    <div className="text-sm text-gray-600">
                      Assigned To:{" "}
                      <span className="font-medium">
                        {task.assignedTo.name} ({task.assignedTo.email})
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/tasks/${task._id}`)}
                  className="mt-4 bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  View Task
                </button>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              disabled={page === 1}
              onClick={prevPage}
              className={`px-4 py-2 rounded-md shadow-sm ${
                page === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700 text-white hover:bg-gray-800"
              }`}
            >
              Previous
            </button>
            <div className="text-gray-700 font-medium">Page {page}</div>
            <button
              disabled={!hasMore}
              onClick={nextPage}
              className={`px-4 py-2 rounded-md shadow-sm ${
                !hasMore
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700 text-white hover:bg-gray-800"
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-2xl font-bold text-center">No task</div>
      )}
    </div>
  );
}
