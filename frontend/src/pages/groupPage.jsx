import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

const API_URL = "https://backend-umci.onrender.com";

const GroupPage = () => {
  const { groupId } = useParams();
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [joinRequested, setJoinRequested] = useState(false);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user, groupId]);

  const fetchData = async () => {
    try {
      const groupsRes = await fetch(`${API_URL}/api/groups`, {
        credentials: "include",
      });

      let foundGroup = null;
      if (!groupsRes.ok) {
        console.error("Failed to fetch groups for details", groupsRes.statusText);
      } else {
        const groups = await groupsRes.json();
        foundGroup = groups.find((g) => String(g.id) === String(groupId));
        setGroup(foundGroup || null);
      }

      const membersRes = await fetch(`${API_URL}/api/groups/${groupId}/members`, {
        credentials: "include",
      });

      if (!membersRes.ok) {
        console.error("Failed to fetch group members", membersRes.statusText);
        setMembers([]);
      } else {
        const data = await membersRes.json();
        setMembers(data);
        if (user) {
          const found = data.find((m) => String(m.user_id) === String(user.id));
          if (found) setJoinRequested(true);
        }
      }

      if (user && foundGroup && String(user.id) === String(foundGroup.owner_id)) {
        const requestsRes = await fetch(`${API_URL}/api/groups/${groupId}/join-requests`, {
          credentials: "include",
        });

        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setPendingRequests(requestsData);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  if (!user) {
    return <div style={{ margin: 60 }}>You must be signed in to view group details.</div>;
  }

  return (
    <div style={{ margin: 60 }}>
      <h2>Group Details</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h3 style={{ margin: 0 }}>
          {group ? group.name : `Group ${groupId}`}
        </h3>

        {String(user?.id) === String(group?.owner_id) && (
          <button
            onClick={async () => {
              if (!confirm(`Delete group "${group.name}" permanently?`)) return;

              try {
                const res = await fetch(`${API_URL}/api/groups/${groupId}`, {
                  method: "DELETE",
                  credentials: "include",
                });

                if (!res.ok) {
                  const text = await res.text();
                  console.error("Delete group error:", res.status, text);
                  alert("Failed to delete group.");
                } else {
                  alert("Group deleted successfully.");
                  window.location.href = "/groups";
                }
              } catch (err) {
                console.error("Fetch error:", err);
                alert("Failed to delete group: " + err.message);
              }
            }}
            style={{
              background: "#cc0000",
              color: "white",
              border: "none",
              padding: "6px 10px",
              cursor: "pointer",
              borderRadius: 4,
            }}
          >
            Delete Group
          </button>
        )}
      </div>
      {group && <p>Owner ID: {group.owner_id}</p>}

      <h4>Members</h4>
      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <ul>
          {members.map((m) => (
            <li key={`${m.group_id}-${m.user_id}`} style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{m.email} ({m.user_id}) {m.role ? `- ${m.role}` : ""}</span>
              <div>
                {String(user?.id) === String(group?.owner_id) && String(user?.id) !== String(m.user_id) && (
                  <button
                    onClick={async () => {
                      if (!confirm(`Remove ${m.email} from the group?`)) return;
                      try {
                        const res = await fetch(`${API_URL}/api/groups/${groupId}/members/${m.user_id}`, {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                          body: JSON.stringify({ memberId: m.user_id }),
                        });

                        if (!res.ok) {
                          const text = await res.text();
                          console.error("Remove error:", res.status, text);
                          alert("Failed to remove member.");
                        } else {
                          alert(`${m.email} has been removed from the group.`);
                          fetchData();
                        }
                      } catch (err) {
                        console.error("Fetch error:", err);
                        alert("Failed to remove member: " + err.message);
                      }
                    }}
                    style={{ marginRight: 8, background: "#ff4444", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", borderRadius: "3px" }}
                  >
                    Remove
                  </button>
                )}
                {String(user?.id) === String(m.user_id) && String(user?.id) !== String(group?.owner_id) && (
                  <button
                    onClick={async () => {
                      if (!confirm(`Leave ${group?.name}?`)) return;
                      try {
                        const res = await fetch(`${API_URL}/api/groups/${groupId}/members/leave`, {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          credentials: "include",
                        });

                        if (!res.ok) {
                          const text = await res.text();
                          console.error("Leave error:", res.status, text);
                          alert("Failed to leave group.");
                        } else {
                          alert("You have left the group.");
                          window.location.href = "/groups";
                        }
                      } catch (err) {
                        console.error("Fetch error:", err);
                        alert("Failed to leave group: " + err.message);
                      }
                    }}
                    style={{ background: "#ff9944", color: "white", border: "none", padding: "4px 8px", cursor: "pointer", borderRadius: "3px" }}
                  >
                    Leave
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 16 }}>
        {String(user?.id) === String(group?.owner_id) ? (
          <em>You are the owner of this group.</em>
        ) : joinRequested ? (
          <em>Join request sent or already a member.</em>
        ) : (
          <button
            onClick={async () => {
              if (!user) {
                alert("You must be signed in to join a group.");
                return;
              }
              setRequestInProgress(true);
              try {
                const res = await fetch(`${API_URL}/api/groups/${groupId}/join-requests`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  credentials: "include",
                  body: JSON.stringify({ userId: user.id }),
                });

                if (!res.ok) {
                  const text = await res.text();
                  console.error("Join request error:", res.status, text);
                  alert("Failed to send join request.");
                } else {
                  setJoinRequested(true);
                  alert("Join request sent!");
                }
              } catch (err) {
                console.error("Fetch error:", err);
                alert("Failed to send join request: " + err.message);
              } finally {
                setRequestInProgress(false);
              }
            }}
            disabled={requestInProgress}
          >
            {requestInProgress ? "Sending..." : "Join Group"}
          </button>
        )}
      </div>

      {String(user?.id) === String(group?.owner_id) && (
        <div style={{ marginTop: 32, padding: 16, border: "1px solid #ccc", borderRadius: 4 }}>
          <h4>Pending Join Requests ({pendingRequests.length})</h4>
          {pendingRequests.length === 0 ? (
            <p>No pending join requests.</p>
          ) : (
            <ul>
              {pendingRequests.map((req) => (
                <li key={req.id} style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{req.email} ({req.user_id})</span>
                  <div>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`${API_URL}/api/groups/join-requests/${req.id}/accept`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            credentials: "include",
                          });

                          if (!res.ok) {
                            const text = await res.text();
                            console.error("Accept error:", res.status, text);
                            alert("Failed to accept request.");
                          } else {
                            alert(`${req.email} has been added to the group!`);
                            setPendingRequests(pendingRequests.filter((r) => r.id !== req.id));
                            fetchData();
                          }
                        } catch (err) {
                          console.error("Fetch error:", err);
                          alert("Failed to accept request: " + err.message);
                        }
                      }}
                      style={{ marginRight: 8 }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`${API_URL}/api/groups/join-requests/${req.id}/reject`, {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            credentials: "include",
                          });

                          if (!res.ok) {
                            const text = await res.text();
                            console.error("Reject error:", res.status, text);
                            alert("Failed to reject request.");
                          } else {
                            setPendingRequests(pendingRequests.filter((r) => r.id !== req.id));
                            alert("Request rejected.");
                          }
                        } catch (err) {
                          console.error("Fetch error:", err);
                          alert("Failed to reject request: " + err.message);
                        }
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupPage;
