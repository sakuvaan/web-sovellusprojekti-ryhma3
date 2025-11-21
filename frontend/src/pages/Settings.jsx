import { useState } from "react";
import "../css/Settings.css";

const Settings = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  async function handleChangePassword() {

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      alert("All fields are required");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5050/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update password.");
        return;
      }

      alert("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  }

  async function handleDeleteAccount() {
    setDeleteError("");
    setDeleteSuccess("");

    if (!deletePassword) {
      setDeleteError("Password is required.");
      return;
    }

    setLoadingDelete(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5050/api/users/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.message || "Failed to delete account.");
        setLoadingDelete(false);
        return;
      }

      setDeleteSuccess("Account deleted successfully.");

      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
      }, 1000);

    } catch (err) {
      console.error(err);
      setDeleteError("Server error.");
    }

    setLoadingDelete(false);
  }

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      {}
      <div className="settings-section">
        <h3>Change Password</h3>

        <label>Old Password</label>
        <br />
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <br />
        <label>New Password</label>
        <br />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <br />
        <label>Confirm New Password</label>
        <br />
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />

        <button className="btn-primary" onClick={handleChangePassword}>
          Change Password
        </button>
      </div>

      {}
      <div className="settings-section delete-section">
        <h3>Delete Account</h3>

        <p className="warning-text">
          Note that all of your data will be deleted permanently.
          <br />
          To proceed, please enter your password below.
        </p>

        <label>Password</label>
        <br />
        <input
          type="password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
        />

        {deleteError && <p className="error-text">{deleteError}</p>}
        {deleteSuccess && <p className="success-text">{deleteSuccess}</p>}

        <button
          className="btn-danger"
          onClick={handleDeleteAccount}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default Settings;