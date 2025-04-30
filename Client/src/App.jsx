// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Register from "./Components/Register";
// import Login from "./Components/Login";
// import Profile from "./Components/Profile";

// export default function App() {
//   const [user, setUser] = useState(null);

//   return (
//     <Router>
//       <nav className="p-4 bg-blue-500 text-white flex justify-center gap-4">
//         <Link to="/">Register</Link>
//         <Link to="/login">Login</Link>
//         <Link to="/profile">Profile</Link>
//       </nav>

//       <Routes>
//         <Route path="/" element={<Register />} />
//         <Route path="/login" element={<Login setUser={setUser} />} />
//         <Route path="/profile" element={<Profile user={user} />} />
//       </Routes>
//     </Router>
//   );
// }
