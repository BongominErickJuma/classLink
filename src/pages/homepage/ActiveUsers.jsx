import React from "react";

const ActiveUsers = ({ activeUsers }) => (
  <div className="active-users">
    <h3>Active Users</h3>
    <p>{activeUsers} users online</p>
  </div>
);

export default ActiveUsers;
