import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Groups.css";

const API_URL = "http://localhost:5050";

const Groups = () => {
  const [yourGroups, setYourGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [discoverGroups, setDiscoverGroups] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/groups`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setYourGroups(data))
      .catch((err) => console.error("Fetch groups error:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/groups/discover`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setDiscoverGroups(data))
      .catch((err) => console.error("Discover groups error:", err));
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: newGroupName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create group failed:", errorText);
        alert("Failed to create group");
        return;
      }

      const data = await response.json();

      setYourGroups((prev) => [...prev, data]);

      setNewGroupName("");
    } catch (err) {
      console.error("Create group error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="groups-page">
      <section className="groups-section">
        <div className="groups-header">
          <h2>Your Groups</h2>

          <div className="groups-create">
            <input
              type="text"
              placeholder="Group name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <button onClick={handleCreateGroup}>Create Group</button>
          </div>
        </div>

        <div className="groups-grid">
          {yourGroups.length === 0 && <p>You are not in any groups yet.</p>}

          {yourGroups.map((group) => (
            <div key={group.id} className="group-card">
              <h3>{group.name}</h3>
              <p>{group.members} members</p>

              <Link to={`/groups/${group.id}`} className="group-btn">
                Group Page
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="groups-section">
        <h2>Discover Other Groups</h2>

        <div className="groups-grid">
          {discoverGroups.length === 0 && (
            <p>No groups to discover right now.</p>
          )}

          {discoverGroups.map((group) => (
            <div key={group.id} className="group-card">
              <h3>{group.name}</h3>
              <p>{group.members} members</p>

              <Link to={`/groups/${group.id}`} className="group-btn">
                View Group
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Groups;
