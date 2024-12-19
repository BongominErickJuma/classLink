import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";

const Profile = () => {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const loggedOutUser = {
    id: user?.id,
    role: user?.role,
  };
  const handleLogOut = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_LOGOUT}`, {
        method: "POST",
        body: JSON.stringify(loggedOutUser), // Body should be stringified
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem("user");

        // Navigate after successful logout
        navigate("/classLink");
      } else {
        console.error("Failed to log out.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
      <li className="dropdown-header">
        <h6>{user?.name || ""}</h6>
      </li>
      <li>
        <hr className="dropdown-divider" />
      </li>

      <li>
        <Link
          className="dropdown-item d-flex align-items-center"
          to={"/classLink/profile"}
        >
          <i className="bi bi-person"></i>
          <span>My Profile</span>
        </Link>
      </li>
      <li>
        <hr className="dropdown-divider" />
      </li>

      <li>
        <Link
          className="dropdown-item d-flex align-items-center"
          onClick={handleLogOut}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Sign Out</span>
        </Link>
      </li>
    </ul>
  );
};

export default Profile;
