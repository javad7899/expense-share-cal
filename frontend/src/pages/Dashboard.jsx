import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [formValues, setFormValues] = useState({
    amount: "",
    description: "",
    paid_by: "",
    split_between: [],
  });

  const token = localStorage.getItem("token");

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const usersMap = {};
      response.data.forEach((user) => {
        usersMap[user._id] = user.fullname;
      });
      setUsers(usersMap);
    } catch (error) {
      console.error("خطا در دریافت کاربران:", error);
    }
  }, [token]);

  const fetchExpenses = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    fetchUsers();
    fetchExpenses();
  }, [fetchUsers, fetchExpenses]);

  const handleDeleteExpense = async (expenseId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/expenses/${expenseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
      toast.success("هزینه با موفقیت حذف شد!");
    } catch (error) {
      console.error("خطا در حذف هزینه.", error);
      toast.error("حذف هزینه ناموفق بود.");
    }
  };

  const handleEditExpense = (expense) => {
    setCurrentExpense(expense);
    setFormValues({
      amount: expense.amount,
      description: expense.description,
      paid_by: expense.paid_by._id,
      split_between: expense.split_between.map((userId) => ({
        value: userId,
        label: users[userId],
      })),
    });
    setEditMode(true);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    try {
      const updatedExpense = {
        ...formValues,
        amount: parseFloat(formValues.amount),
        split_between: formValues.split_between.map((user) => user.value),
      };
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/expenses/${currentExpense._id}`,
        updatedExpense,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchExpenses();
      toast.success("هزینه با موفقیت ویرایش شد!");
      setEditMode(false);
      setCurrentExpense(null);
    } catch (error) {
      console.error("خطا در ویرایش هزینه:", error);
      toast.error("ویرایش هزینه ناموفق بود.");
    }
  };

  const userOptions = Object.entries(users).map(([userId, fullname]) => ({
    value: userId,
    label: fullname,
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">داشبورد</h1>
      <table className="table table-auto w-full">
        <thead>
          <tr>
            <th>توضیحات</th>
            <th>مبلغ</th>
            <th>پرداخت شده توسط</th>
            <th>تقسیم بین</th>
            <th>مبلغ هر کاربر</th>
            <th>تاریخ</th>
            <th>اقدامات</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.description}</td>
              <td>{expense.amount}</td>
              <td>{expense.paid_by?.fullname}</td>
              <td>
                {expense.split_between
                  .map((userId) => users[userId])
                  .join(", ")}
              </td>
              <td>{expense.amount_per_user[0].amount.toFixed(2)}</td>
              <td>
                {expense.createdAt
                  ? new Date(expense.createdAt).toLocaleDateString("fa-IR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "تاریخ نامعتبر"}
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm ml-1"
                  onClick={() => handleEditExpense(expense)}
                >
                  ویرایش
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDeleteExpense(expense._id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editMode && (
        <div className="mt-8 max-w-lg">
          <form onSubmit={handleUpdateExpense}>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700">
                مبلغ
              </label>
              <input
                type="number"
                id="amount"
                value={formValues.amount}
                onChange={(e) =>
                  setFormValues({ ...formValues, amount: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700">
                توضیحات
              </label>
              <input
                type="text"
                id="description"
                value={formValues.description}
                onChange={(e) =>
                  setFormValues({ ...formValues, description: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="paidBy" className="block text-gray-700">
                پرداخت شده توسط
              </label>
              <select
                id="paidBy"
                value={formValues.paid_by}
                onChange={(e) =>
                  setFormValues({ ...formValues, paid_by: e.target.value })
                }
                className="select select-bordered w-full"
                required
              >
                <option value="" disabled>
                  انتخاب کاربر
                </option>
                {userOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="splitBetween" className="block text-gray-700">
                تقسیم بین
              </label>
              <Select
                placeholder="انتخاب کاربران"
                id="splitBetween"
                isMulti
                options={userOptions}
                value={formValues.split_between}
                onChange={(selected) =>
                  setFormValues({ ...formValues, split_between: selected })
                }
                className="w-full"
                classNamePrefix="select"
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              ذخیره تغییرات
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
