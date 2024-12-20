import React from "react";
import "./sidebar.css";
import SidebarDropdowns from "./SidebarDropdowns";
import dropdown from "./dropdown.js";

const Sidebar = () => {
  return (
    <div>
      <aside id="sidebar" className="sidebar">
        <div className="sidebar-logo mb-2">
          <a
            href="#"
            className="d-flex align-items-center justify-content-center lg-screen-logo"
          >
            <span className="d-lg-block  h4 text-white">
              Class<span className="designed">Link</span>
            </span>
          </a>
          <a
            href="#"
            className="d-flex align-items-center justify-content-center d-none sm-screen-logo"
          >
            <span className="d-lg-block text-primary fs-6 py-1 px-2 rounded-circle border">
              Cl
            </span>
          </a>
        </div>
        <ul className="sidebar-nav" id="sidebar-nav">
          {dropdown.map((item, index) => (
            <SidebarDropdowns
              key={index}
              linkTo={item.linkTo}
              icon={item.icon}
              label={item.label}
              chevron={item.chevron}
              children={item.children}
            />
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
