import React, { useState } from "react";
import { registerUser } from "../Services/UserService";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      })
      console.log("res: ", res);
      const data = res.data;
      alert(res.data.message);

      if (res.data.success) {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      console.log("err.response.data.data.message: ", err.response.data.message);
      
      alert(err.response.data.message);
      

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Register</h2>
        {["name", "email", "password", "confirmPassword"].map((field) => (
          <input
            key={field}
            type={field.includes("password") ? "password" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace("confirmPassword", "Confirm Password")}
            value={form[field]}
            onChange={handleChange}
            className="mb-3 w-full p-2 border rounded"
          />
        ))}
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Register</button>
      </form>
    </div>
  );
}
