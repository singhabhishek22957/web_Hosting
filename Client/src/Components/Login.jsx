import React, { useState } from "react";
import { loginUser } from "../Services/UserService";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
    const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({
        email: form.email,
        password: form.password,
      })

      console.log("res: ", res);

      const data = res.data;
      if (data.success) {
        setUser(data.data.user); // Assuming server sends user info here
      } else {
        alert(data.message);
      }
      alert(data.message);
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="mb-3 w-full p-2 border rounded"
        />
        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Login</button>
      </form>
    </div>
  );
}
