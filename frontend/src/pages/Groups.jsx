import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const API_URL = "http://localhost:5050";

const Groups = () => {
  const [lists, setLists] = useState([]);
  const [groupName, setGroupName] = useState("");
  const { user } = useContext(AuthContext);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
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

  const handleUpdateGroups = async () => {
    try {
      const response = await fetch(`${API_URL}/api/groups`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        alert(`Error: ${response.status} ${response.statusText}`);
        return;
      }

      alert("Groups updated successfully");
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to update groups: " + err.message);
    }
  };

  return (
    <div style={{margin: 60}}>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
      />
      <button onClick={handleCreateGroup}>
        Create Group
      </button>
      <button onClick={handleUpdateGroups}>
        Update Groups
      </button>
    </div>
  );
};

export default Groups;