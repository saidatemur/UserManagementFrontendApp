import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://usermanagementbackendapp-4.onrender.com/api/User", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Sunucudan geçersiz yanıt");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Yanıt beklenmeyen formatta:", data);
          setUsers([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setUsers([]);
      });
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBlock = async () => {
    try {
      const res = await fetch(
        "https://usermanagementbackendapp-4.onrender.com/api/User/block",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userIds: selected }),
        }
      );
      if (res.ok) {
        setStatusMessage("Seçilen kullanıcılar engellendi.");
      } else {
        setStatusMessage("Engelleme işlemi başarısız oldu.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Bir hata oluştu.");
    }
  };

  const handleUnblock = async () => {
    try {
      const res = await fetch(
        "https://usermanagementbackendapp-4.onrender.com/api/User/unblock",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userIds: selected }),
        }
      );
      if (res.ok) {
        setStatusMessage("Seçilen kullanıcıların engeli kaldırıldı.");
      } else {
        setStatusMessage("Engel kaldırma işlemi başarısız oldu.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Bir hata oluştu.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Kullanıcı Listesi</h1>
      {statusMessage && (
        <div className="mb-4 text-green-600 font-medium">{statusMessage}</div>
      )}
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 border rounded flex justify-between items-center ${
              selected.includes(user.id) ? "bg-blue-100" : ""
            }`}
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Durum: {user.status}, Kayıt Tarihi:{" "}
                {new Date(user.registeredAt).toLocaleString()}
              </p>
            </div>
            <button
              className="text-sm px-3 py-1 border rounded"
              onClick={() => toggleSelect(user.id)}
            >
              {selected.includes(user.id) ? "Vazgeç" : "Seç"}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 space-x-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleBlock}
        >
          Engelle
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleUnblock}
        >
          Engeli Kaldır
        </button>
      </div>
    </div>
  );
};

export default UserList;
