import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const API_URL = "http://localhost:5050";

const Groups = () => {
  const [lists, setLists] = useState([]);
  const [groupName, setGroupName] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
      if (user) {
        fetchGroups();
      }
  }, [user]);

  const fetchGroups = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/api/groups`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Failed to fetch groups:", response.statusText);
        return;
      }

      const data = await response.json();
      setLists(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleCreateGroup = async () => {
    if (!user) {
      alert("You must be signed in to create a group.");
      return;
    }

    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ name: groupName }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Response status:", response.status);
        console.error("Response body:", errorData);
        alert(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      setLists([...lists, data]);
      setGroupName("");
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to create group: " + err.message);
    }
  };

  return (
    <div style={{ margin: 60 }}>
      <h2>Groups</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <button onClick={handleCreateGroup}>Create Group</button>
      </div>

      <h3>All Groups</h3>
      <ul>
        {lists.map((group) => (
          <li key={group.id} style={{ marginBottom: "10px" }}>
            <strong>
              <Link to={`/groups/${group.id}`}>{group.name}</Link>
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Groups;
