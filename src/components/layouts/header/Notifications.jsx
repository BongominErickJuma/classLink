import React from "react";
import notifications from "./notifications";

const timeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) {
    return `${diff} sec. ago`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)} min. ago`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)} hr. ago`;
  } else {
    return `${Math.floor(diff / 86400)} day(s) ago`;
  }
};

const Notifications = () => {
  return (
    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
      <li className="dropdown-header">
        You have {notifications.length} new notifications
        <a href="#">
          <span className="badge rounded-pill bg-primary p-2 ms-2">
            View all
          </span>
        </a>
      </li>
      <li>
        <hr className="dropdown-divider" />
      </li>
      {notifications.map((notification) => (
        <React.Fragment key={notification.id}>
          <li className="notification-item">
            <i
              className={`${notification.icon} ${notification.icon_color}`}
            ></i>
            <div>
              <h4>{notification.title}</h4>
              <p>{notification.content}</p>
              <blockquote>{timeAgo(notification.createdAt)}</blockquote>
            </div>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
        </React.Fragment>
      ))}
    </ul>
  );
};

export default Notifications;
