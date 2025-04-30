import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router/Router.jsx";
import { UserProvider } from "./Context/UserContext.jsx";
import { CharityProvider } from "./Context/CharityContext.jsx";

// const role = localStorage.getItem("role");

const AppProvider = ({ children }) => {
  const role = localStorage.getItem("role");

  if (role === "user") {
    return <UserProvider>{children}</UserProvider>;
  }

  if (role === "charity") {
    return <CharityProvider>{children}</CharityProvider>;
  }

  return <>{children}</>; // no provider
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <AppProvider>
      <RouterProvider router={router} />
    </AppProvider> */}
    <UserProvider>
      <CharityProvider>
        <RouterProvider router={router} />
      </CharityProvider>
    </UserProvider>
  </StrictMode>
);
