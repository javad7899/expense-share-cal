import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { toast } from "react-toastify";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [adminId, setAdminId] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data);
    } catch (error) {
      toast.error("خطا در دریافت کاربران");
    }
  }, [token]);

  const fetchAdminId = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/admin/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdminId(response.data._id);
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات مدیر");
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
    fetchAdminId();
  }, [fetchUsers, fetchAdminId]); // Add functions to dependency array

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const newUser = { username, fullname, admin: adminId };
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users`,
        newUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers([...users, response.data]);
      setUsername("");
      setFullname("");
      toast.success("کاربر با موفقیت اضافه شد");
    } catch (error) {
      toast.error("خطا در اضافه کردن کاربر");
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { username, fullname, admin: adminId };
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/${editingUser._id}`,
        updatedUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? response.data : user
        )
      );
      setEditingUser(null);
      setUsername("");
      setFullname("");
      toast.success("کاربر با موفقیت به روز شد");
    } catch (error) {
      toast.error("خطا در به روز رسانی کاربر");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("کاربر با موفقیت حذف شد");
    } catch (error) {
      toast.error("خطا در حذف کاربر");
    }
  };

  const startEditUser = (user) => {
    setEditingUser(user);
    setUsername(user.username);
    setFullname(user.fullname);
  };

  const cancelEditUser = () => {
    setEditingUser(null);
    setUsername("");
    setFullname("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">مدیریت کاربران</h1>
      <form
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        className="mb-4 max-w-lg"
      >
        <div className="mb-2">
          <label className="block text-gray-700 mb-1">نام کاربری</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 mb-1">نام کامل</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary ml-2">
          {editingUser ? "ویرایش کاربر" : "اضافه کردن کاربر"}
        </button>
        {editingUser && (
          <button
            type="button"
            onClick={cancelEditUser}
            className="btn btn-warning mr-2"
          >
            لغو ویرایش
          </button>
        )}
      </form>

      <table className="table table-auto w-full">
        <thead>
          <tr>
            <th>نام کاربری</th>
            <th>نام کامل</th>
            <th>تاریخ عضویت</th>
            <th>اقدامات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.fullname}</td>
              <td>
                {new Date(user.createdAt).toLocaleDateString("fa-IR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td>
                <button
                  onClick={() => startEditUser(user)}
                  className="btn btn-sm btn-info"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="btn btn-sm btn-error mr-2"
                >
                  حذف
                </button>
                <button
                  onClick={() => navigate(`/users/${user._id}`)} // Navigate to user details
                  className="btn btn-sm btn-success mr-2"
                >
                  جزئیات
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
