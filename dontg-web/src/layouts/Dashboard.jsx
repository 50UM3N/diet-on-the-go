import React from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <main>
      <Outlet />
    </main>
  );
};

export default Dashboard;
