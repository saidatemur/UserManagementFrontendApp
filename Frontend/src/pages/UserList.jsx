import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5199/api/User", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setCurrentUserEmail(data.currentUserEmail);
      });
  }, []);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const blockUsers = async () => {
    await fetch("http://localhost:5199/api/User/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userIds: selected }),
    });

    // Güncel kullanıcı hala aktif mi kontrol et
    const res = await fetch("http://localhost:5199/api/User", {
      credentials: "include",
    });
    const data = await res.json();

    const currentUserStillActive = data.users.some(
      (u: any) => u.email === data.currentUserEmail && !u.isBlocked
    );

    if (!currentUserStillActive) {
      navigate("/login");
    } else {
      setUsers(data.users);
      setSelected([]);
    }
  };

  const unblockUsers = async () => {
    await fetch("http://localhost:5199/api/User/unblock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userIds: selected }),
    });

    const res = await fetch("http://localhost:5199/api/User", {
      credentials: "include",
    });
    const data = await res.json();
    setUsers(data.users);
    setSelected([]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <ul className="space-y-2">
        {users.map((user: any) => (
          <li
            key={user.id}
            className={`flex items-center justify-between p-2 border rounded ${
              selected.includes(user.id) ? "bg-gray-200" : ""
            }`}
            onClick={() => toggleSelection(user.id)}
          >
            <span>{user.email}</span>
            <span
              className={`text-sm px-2 py-1 rounded ${
                user.isBlocked ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              {user.isBlocked ? "🔒" : "🔓"}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mt-4">
        <button
          onClick={blockUsers}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🔒 Block Selected
        </button>
        <button
          onClick={unblockUsers}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Unblock Selected
        </button>
      </div>
    </div>
  );
};

export default UserList;
