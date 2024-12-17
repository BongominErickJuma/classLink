import React from "react";
import { Link } from "react-router-dom";

const QuickLinks = () => (
  <div className="card mb-3">
    <div className="card-body">
      <h3 className="card-title">Quick Links</h3>
      <ul className="d-flex">
        <li>
          <Link to="/classLink/todayschedule" className="me-2">
            Today's Schedules |
          </Link>
        </li>
        <li>
          <Link to="/classLink/admin/courses" className="me-2">
            Course Management |
          </Link>
        </li>
        <li>
          <Link to="/classLink/admin/announcements">Manage Announcements</Link>
        </li>
      </ul>
    </div>
  </div>
);

export default QuickLinks;
