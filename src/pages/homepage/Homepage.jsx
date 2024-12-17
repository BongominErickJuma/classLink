import React, { useContext, useEffect, useState } from "react";
import "./homepage.css";
import { UserContext } from "../../contexts/UserContext";
import WelcomeBanner from "./WelcomeBanner";
import QuickLinks from "./QuickLinks";
import Analytics from "./Analytics";
import Schedules from "./Schedules";
import useFetch from "../../hooks/useFetch";

const Homepage = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState(0);
  const [courses, setCourses] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);

  const { data } = useFetch(import.meta.env.VITE_ALL_STATS, {});

  useEffect(() => {
    document.title = "Class Link | Dashboard";
    if (data) {
      setCourses(data.courses);
      setUsers(data.users);
      setActiveUsers(data.active_users);
    }
  }, [data]);
  return (
    <div className="admin-dashboard">
      <div className="row gx-2">
        <WelcomeBanner
          currentUser={user}
          users={users}
          courses={courses}
          activeUsers={activeUsers}
        />
        <div className="col-lg-8">
          <QuickLinks />
          <Analytics />
        </div>
        <div className="col-lg-4">
          <Schedules />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
