import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate(); // For redirecting after logout

  // Fetch the admin's username from the backend
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the JWT from local storage

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsername(response.data.username); // Assuming the username is returned in the response
      } catch (error) {
        console.error("Error fetching admin data", error);
      }
    };

    fetchAdminData();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT from local storage

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/admin/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token"); // Remove token from local storage
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">برنامه اشتراک هزینه</h1>
        <ul className="flex gap-3 items-center">
          <li>
            <Link to="/add" className="btn btn-accent">
              اضافه کردن هزینه
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className="hover:text-gray-400">
              داشبورد
            </Link>
          </li>
          <li>
            <Link to="/users" className="hover:text-gray-400">
              کاربران
            </Link>
          </li>
        </ul>
        {username && (
          <ul className="flex items-center gap-3">
            <li>
              <span className="ml-4">نام کاربری ادمین: {username}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-danger">
                خروج
              </button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
