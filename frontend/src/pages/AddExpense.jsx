import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const AddExpense = ({ onAddExpense }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token"); // Retrieve the JWT token from local storage

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }, // Include token in headers
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("خطا در دریافت کاربران:", error));
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const expense = {
      amount: parseFloat(amount),
      description,
      paid_by: paidBy,
      split_between: splitBetween.map((user) => user.value),
    };
    // Add the expense with the token included in headers
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/expenses`, expense, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAmount("");
        setDescription("");
        setPaidBy("");
        setSplitBetween([]);
      })
      .catch((error) => console.error("خطا در اضافه کردن هزینه:", error));
  };

  const userOptions = users.map((user) => ({
    value: user._id,
    label: user.fullname,
  }));

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          اضافه کردن هزینه
        </h2>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-gray-700">
            مبلغ
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
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
            id="splitBetween"
            isMulti
            options={userOptions}
            value={splitBetween}
            onChange={setSplitBetween}
            className="w-full"
            classNamePrefix="select"
            placeholder="انتخاب کاربران"
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          اضافه کردن هزینه
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
