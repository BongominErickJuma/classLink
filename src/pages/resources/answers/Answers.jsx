import React, { useState, useEffect } from "react";
import useFetch from "../../../hooks/useFetch";
import { Link } from "react-router-dom";

const Answers = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [fetchUrl, setFetchUrl] = useState({
    url: import.meta.env.VITE_GET_COURSE_ASSIGNMENTS, // Update this to your assignments endpoint
    options: {},
  });

  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  useEffect(() => {
    document.title = "Class Link | Answers";
    if (data) {
      setAssignments(data.assignments);
      setCourses(data.courses);
    }
  }, [data]);
  return (
    <div className="container my-4">
      <h2 className="my-4">Answers</h2>
      {loading && <p>Loading Answers ...</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}
      {!loading && !error && courses.length > 0 ? (
        <div className="row">
          {courses.map((course, idx) => (
            <div key={idx} className="col-md-4 mb-4">
              <Link to={`/answers/${course.unit_code}`}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{course.course_title}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No Answers available</p>
      )}
    </div>
  );
};

export default Answers;
