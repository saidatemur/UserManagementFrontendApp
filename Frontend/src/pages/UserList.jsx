import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://user-management-backend-app.vercel.app/api/User", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)
        );
        setUsers(sorted);

        // Eğer tüm kullanıcılar bloklanmışsa yönlendir
        const allBlocked = sorted.length > 0 && sorted.every((u) => u.isBlocked);
        if (allBlocked) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  }, []);

  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAction = (action) => {
    if (selected.length === 0) return;

    const url = {
      block: "https://user-management-backend-app.vercel.app/api/User/block",
      unblock: "https://user-management-backend-app.vercel.app/api/User/unblock",
      delete: "https://user-management-backend-app.vercel.app/api/User/delete",
    }[action];

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ userIds: selected }),
    })
      .then((res) => res.text())
      .then((msg) => {
        setStatusMessage(msg);

        // Yeni verileri al
        fetch("https://user-management-backend-app.vercel.app/api/User", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((res) => res.json())
          .then((usersData) => {
            const sorted = usersData.sort(
              (a, b) => new Date(b.lastLogin) - new Date(a.lastLogin)
            );
            setUsers(sorted);
            setSelected([]);

            // Eğer kendini blokladıysan veya tüm kullanıcılar bloklandıysa yönlendir
            const token = localStorage.getItem("token");
            const parseJwt = (t) => {
              try {
                return JSON.parse(atob(t.split(".")[1]));
              } catch {
                return null;
              }
            };
            const currentUser = parseJwt(token);

            const currentUserBlocked = sorted.some(
              (u) => u.id === currentUser?.id && u.isBlocked
            );

            const allBlocked = sorted.length > 0 && sorted.every((u) => u.isBlocked);

            if (currentUserBlocked || allBlocked) {
              localStorage.removeItem("token");
              navigate("/");
            }

            // Eğer tüm kullanıcılar silindiyse yönlendir
            if (usersData.length === 0) {
              localStorage.removeItem("token");
              navigate("/");
            }
          });
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">User Management</h2>
      {statusMessage && <div className="alert alert-info">{statusMessage}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Select</th>
            <th>Email</th>
            <th>Blocked</th>
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
                  onChange={() => handleCheckboxChange(u.id)}
                />
              </td>
              <td>{u.email}</td>
              <td>{u.isBlocked ? "Yes" : "No"}</td>
              <td>{new Date(u.lastLogin).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3">
        <button className="btn btn-warning me-2" onClick={() => handleAction("block")}>
          Block
        </button>
        <button className="btn btn-success me-2" onClick={() => handleAction("unblock")}>
          Unblock
        </button>
        <button className="btn btn-danger" onClick={() => handleAction("delete")}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserList;
