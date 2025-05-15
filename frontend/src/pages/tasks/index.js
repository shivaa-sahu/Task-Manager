import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API, authHeaders } from "@/utils/auth"; // your API setup

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [username, setUsername] = useState("");
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

    const fetchTasks = async () => {
      const res = await fetch(`${API}/tasks?page=${page}&limit=${limit}`, authHeaders(storedToken));
      const data = await res.json();
      setTasks(data);
      setHasMore(data.length === limit);
    };

    fetchTasks();
  }, [page]);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const handleLogout = () => {
  const confirmLogout = confirm("You want to logout?");
  if (confirmLogout) {
    localStorage.removeItem("token");
    alert("Logged out.");
    router.push("/");
  }
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center gap-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          <span className="text-orange-500">{username}'s</span> Tasks
        </h1>
        <div
          onClick={()=>router.push("/tasks/completed-task")}
         className="mb-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
        >
          Completed Task
        </div>
        <div
          onClick={()=>router.push("/tasks/created-by-me")}
         className="mb-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer"
        >
          Created By Me
        </div>
        <button
          onClick={() => router.push("/tasks/create")}
          className="mb-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 "
        >
          + Create Task
        </button>
        <div
          onClick={handleLogout}
          className="mb-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
        >
          Log-Out
        </div>
      </div>

    {
      tasks.length > 0 ?
      <>
       <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition duration-300 flex flex-col justify-between"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {task.title}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Due:{" "}
                <span className="font-medium">
                  {task.dueDate?.split("T")[0]}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                    task.status === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 text-white"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push(`/tasks/${task._id}`)}
              className="mt-auto bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {
        tasks.length >= 0 && (
        <div className="mt-8 flex justify-center items-center space-x-4 ">
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
        )
          
      }
      </>
      :
      <div className="text-2xl font-bold text-center">No task</div>
    }
     
    </div>
  );
}
