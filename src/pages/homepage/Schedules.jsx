import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";

const Schedules = () => {
  const [assignments, setAssignments] = useState(null);
  const [courses, setCourses] = useState(null);

  const { data, error, loading } = useFetch(
    import.meta.env.VITE_GET_EVENTS,
    {}
  );

  useEffect(() => {
    if (data) {
      setAssignments(data.assignments);
      setCourses(data.courses);
    }
  }, [data]);

  return (
    <div className="schedules card">
      <div className="flex-r mb-2 p-2">
        <h3 className="mb-0">Assignments</h3>
        <Link to={"/timetable_assignments"}>View All</Link>
      </div>
      <ul
        className="list-group"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        {assignments &&
          assignments.map((assignment, index) => (
            <li key={index} className="list-group-item border-0">
              <h5>
                {courses.map(
                  (c) => c.unit_code == assignment.unit_code && c.course_title
                )}
              </h5>
              <small>Location: {assignment.location}</small>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Schedules;
