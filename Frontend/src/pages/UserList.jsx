import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://usermanagementbackendapp-4.onrender.com/api/User", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) {
          navigate("/");
        } else {
          const data = await res.json();
          const sorted = data.sort(
            (a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)
          );
          setUsers(sorted);
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === users.length) {
      setSelected([]);
    } else {
      setSelected(users.map((u) => u.id));
    }
  };

  const parseJwt = (token) => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const handleAction = (action) => {
    fetch(`https://usermanagementbackendapp-4.onrender.com/api/User/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userIds: selected }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Operation failed");
        return res.text();
      })
      .then(async (message) => {
        setStatusMessage(message);

        // Kullanıcıları güncelle
        const usersRes = await fetch("https://usermanagementbackendapp-4.onrender.com/api/User", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const usersData = await usersRes.json();
        setUsers(usersData);
        setSelected([]);

        const currentUserEmail = parseJwt(localStorage.getItem("token"))?.email;
        const currentUser = usersData.find((u) => u.email === currentUserEmail);

        if (action === "block") {
          if (currentUser?.isBlocked) {
            localStorage.removeItem("token");
            navigate("/");
          }
        } else if (action === "delete") {
          if (usersData.length === 0) {
            localStorage.removeItem("token");
            navigate("/");
          }
        }
      })
      .catch(() => setStatusMessage("An error occurred during the operation."));
  };

  const handleLogout = async () => {
    try {
      await fetch("https://usermanagementbackendapp-4.onrender.com/api/Authentication/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      // hata loglama isteğe bağlı
    } finally {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">User Management</h3>
        <button className="btn btn-outline-dark" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {statusMessage && (
        <div className="alert alert-info p-2 py-1">{statusMessage}</div>
      )}

      <div className="mb-2 d-flex justify-content-between align-items-center">
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => handleAction("block")}
            disabled={selected.length === 0}
          >
            Block
          </button>
          <button
            className="btn btn-outline-secondary me-2"
            title="Unblock selected"
            onClick={() => handleAction("unblock")}
            disabled={selected.length === 0}
          >
            🔓
          </button>
          <button
            className="btn btn-outline-danger me-2"
            title="Delete selected"
            onClick={() => handleAction("delete")}
            disabled={selected.length === 0}
          >
            🗑
          </button>

          <button
            className="btn btn-outline-warning"
            title="Block all users"
            onClick={() => {
              setSelected(users.map((u) => u.id));
              setTimeout(() => handleAction("block"), 100);
            }}
            disabled={users.length === 0}
          >
            Block All
          </button>
        </div>
      </div>

      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={selected.length === users.length && users.length > 0}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(u.id)}
                  onChange={() => toggleSelect(u.id)}
                />
              </td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{new Date(u.lastLogin).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
