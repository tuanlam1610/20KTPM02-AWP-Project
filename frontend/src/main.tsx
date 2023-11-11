import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import SignInView from "./views/SignInView.tsx";
import SignUpView from "./views/SignUpView.tsx";
import HomePage from "./views/HomePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <SignInView />
  },
  {
    path: "/register",
    element: <SignUpView />
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "*",
    element: <h1>404</h1>,
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
