import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../contexts/UserContext";
import useFetch from "../../../hooks/useFetch";
import Pindividual from "./Pindividual";
import Pgeneral from "./Pgeneral";

const Performance = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const userId = parseInt(user?.id);
  const [performance, setPerformance] = useState(null);
  const [courses, setCourses] = useState(null);

  const { data, error, loading } = useFetch(
    `${import.meta.env.VITE_PERFORMANCE}/${user?.id}`,
    {}
  );

  useEffect(() => {
    document.title = "Class Link | Performance";
    if (data) {
      setPerformance(data.performance);
      setCourses(data.courses);
    }
  }, [data]);

  // If user is a teacher, don't fetch or show performance data, show Pgeneral instead
  if (userRole !== "student") {
    return (
      <div>
        <h2>Performances</h2>
        <Pgeneral />
      </div>
    );
  }

  // If user is a student, fetch and display performance data
  return (
    <div>
      <h2>Performances</h2>
      {loading && <p>Loading Performance ...</p>}
      {error && (
        <div className="alert alert-danger " role="alert">
          {error.message}
        </div>
      )}
      {!loading && performance && performance.length > 0 ? (
        <Pindividual
          courses={courses}
          performance={performance}
          userId={userId}
        />
      ) : (
        !loading && <p>Performance data not found</p>
      )}
    </div>
  );
};

export default Performance;
