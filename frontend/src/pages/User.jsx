import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات کاربر:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const usersMap = {};
        response.data.forEach((user) => {
          usersMap[user._id] = user;
        });
        setUsers(usersMap);
      } catch (error) {
        console.error("خطا در دریافت کاربران:", error);
      }
    };

    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/expenses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setExpenses(response.data);
      } catch (error) {
        console.error("خطا در دریافت هزینه‌ها:", error);
      }
    };

    fetchUser();
    fetchUsers();
    fetchExpenses();
  }, [id, token]);

  if (!user) {
    return <p>در حال بارگذاری...</p>;
  }

  const userExpenses = expenses.filter(
    (expense) =>
      expense.paid_by._id === id || expense.split_between.includes(id)
  );
  const totalPaid = userExpenses.reduce(
    (sum, expense) => (expense.paid_by._id === id ? sum + expense.amount : sum),
    0
  );
  const totalOwed = userExpenses.reduce((sum, expense) => {
    const userShare = expense.amount_per_user.find(
      (share) => share.user_id === id
    );
    return userShare ? sum + userShare.amount : sum;
  }, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">جزئیات کاربر</h1>
      <div className="mb-4">
        <p>
          <strong>نام کاربری:</strong> {user.username}
        </p>
        <p>
          <strong>تاریخ عضویت:</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">خلاصه</h2>
      <p>
        <strong>کل پرداختی:</strong> {totalPaid.toFixed(2)}
      </p>
      <p>
        <strong>کل بدهی:</strong> {totalOwed.toFixed(2)}
      </p>

      <h2 className="text-xl font-bold mt-6 mb-4">هزینه‌ها</h2>
      <table className="table table-auto w-full">
        <thead>
          <tr>
            <th>توضیحات</th>
            <th>مبلغ</th>
            <th>پرداخت شده توسط</th>
            <th>تقسیم بین</th>
            <th>مبلغ برای هر کاربر</th>
            <th>تاریخ</th>
          </tr>
        </thead>
        <tbody>
          {userExpenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
              <td>{users[expense.paid_by._id]?.username}</td>
              <td>
                {expense.split_between
                  .map((userId) => users[userId]?.username)
                  .join(", ")}
              </td>
              <td>
                {expense.amount_per_user
                  .find((share) => share.user_id === id)
                  ?.amount.toFixed(2)}
              </td>
              <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
