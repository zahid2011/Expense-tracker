import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const ProtectedLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 p-8 w-full">
        <Outlet /> 
      </main>
    </div>
  );
};

export default ProtectedLayout;