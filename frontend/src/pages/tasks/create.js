
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API, authHeaders } from '@/utils/auth';

export default function CreateTask() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push('/');
      return;
    }
    setToken(storedToken);

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API}/users`, authHeaders(storedToken));
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Token not found. Please login again.");

    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      ...authHeaders(token),
      body: JSON.stringify({
        title,
        description: desc,
        dueDate,
        priority,
        assignedTo: assignedTo || undefined,
      }),
    });

    const data = await res.json();
    if (res.ok) router.push('/tasks');
    else alert(data.message || 'Error creating task');
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 p-4 border rounded shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Create Task</h1>
          <div
            onClick={() => router.push("/tasks")}
            className="text-lg p-1 px-3 text-white cursor-pointer bg-black rounded-full"
          >
            &lt;
          </div>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {users.length > 0 && (
          <select
            value={assignedTo}
            required
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Assign To</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}
