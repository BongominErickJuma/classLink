import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import useFetch from "../../../hooks/useFetch";
import { Link } from "react-router-dom";

const Courses = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [addCourse, setAddCourse] = useState({
    courseTitle: "",
    description: "",
    level: "",
    semester: "",
    unitCode: "",
    creditUnits: "",
    prerequisites: "",
    assessment: "",
    deliveryMode: "",
    lecturer: "",
  });
  const [fetchUrl, setFetchUrl] = useState({
    url: import.meta.env.VITE_GET_COURSES, // Update this to your courses endpoint
    options: {},
  });

  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = (e) => {
    e.preventDefault();

    setFetchUrl({
      url: `${import.meta.env.VITE_ADD_COURSE}`,
      options: {
        method: "POST",
        body: addCourse,
        headers: { "Content-Type": "application/json" },
      },
    });

    window.location.reload();
  };

  useEffect(() => {
    document.title = "Class Link | Courses";
    if (data) {
      setCourses(data.courses);
      setTeachers(data.teachers);
    }
  }, [data]);

  return (
    <div className="container my-4">
      <h2 className="my-4">Computer Engineering</h2>
      {userRole === "admin" && teachers && teachers.length > 0 && (
        <button
          className="btn btn-sm btn-outline-primary view-btn w-100 my-3"
          data-bs-toggle="collapse"
          href="#addSubject"
        >
          Add Subject
        </button>
      )}

      <div className="collapse col-lg-12" id="addSubject">
        <div className="my-3">
          <form onSubmit={handleAddCourse}>
            <div className="row">
              <div className="form-group col-lg-4">
                <label htmlFor="courseTitle">Course Title</label>
                <input
                  type="text"
                  name="courseTitle"
                  id="courseTitle"
                  className="form-control mt-2"
                  value={addCourse.courseTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group col-lg-4">
                <label htmlFor="lecturer">Lecturer</label>
                <select
                  name="lecturer"
                  id="lecturer"
                  className="form-control mt-2"
                  value={addCourse.lecturer} // Value will be the selected lecturer's ID
                  onChange={handleInputChange}
                >
                  <option value="0">Select Lecturer</option>
                  {teachers &&
                    teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group col-lg-4">
                <label htmlFor="prerequisites">Prerequisites</label>
                <input
                  type="text"
                  name="prerequisites"
                  id="prerequisites"
                  className="form-control mt-2"
                  value={addCourse.prerequisites}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="deliveryMode">Delivery Mode</label>
                <input
                  type="text"
                  name="deliveryMode"
                  id="deliveryMode"
                  className="form-control mt-2"
                  value={addCourse.deliveryMode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="assessment">Assessment</label>
                <input
                  type="text"
                  name="assessment"
                  id="assessment"
                  className="form-control mt-2"
                  value={addCourse.assessment}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group col-lg-4">
                <label htmlFor="semester">Semester</label>
                <input
                  type="text"
                  name="semester"
                  id="semester"
                  className="form-control mt-2"
                  value={addCourse.semester}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group col-lg-4">
                <label htmlFor="level">Level</label>
                <input
                  type="text"
                  name="level"
                  id="level"
                  className="form-control mt-2"
                  value={addCourse.level}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group col-lg-2">
                <label htmlFor="creditUnits">Credit Units</label>
                <input
                  type="text"
                  name="creditUnits"
                  id="creditUnits"
                  className="form-control mt-2"
                  value={addCourse.creditUnits}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group col-lg-2">
                <label htmlFor="unitCode">Unit Code</label>
                <input
                  type="text"
                  name="unitCode"
                  id="unitCode"
                  className="form-control mt-2"
                  value={addCourse.unitCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  id="description"
                  className="form-control mt-2"
                  value={addCourse.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row g-2 w-100">
              <div className="col-lg-6">
                <button
                  type="button"
                  className="btn btn-sm btn-primary w-100"
                  data-bs-toggle="collapse"
                  href={`#addSubject`}
                >
                  Cancel
                </button>
              </div>
              <div className="col-lg-6">
                <button
                  type="submit"
                  className="btn btn-sm btn-info w-100 text-white"
                >
                  Add Subject
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {loading && <p>Loading Courses ...</p>}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}
      {!loading && !error && courses.length > 0 ? (
        <div className="row">
          {courses.map((course) => (
            <div key={course.unit_code} className="col-md-4 mb-4">
              <Link to={`/classLink/courses/${course.unit_code}`}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{course.course_title}</h5>
                    <p>
                      <strong>Lecturer:</strong>{" "}
                      {teachers &&
                        teachers.map(
                          (teacher) =>
                            teacher.id === course.teacher_id && teacher.name
                        )}
                    </p>
                    <p>
                      <strong>Unit Code:</strong> {course.unit_code}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <>
          {!loading && <p>No courses available</p>}
          {!error && !loading && teachers.length === 0 && (
            <>
              <p>
                <i className="bi bi-patch-question"></i> Create Teachers in
                order to add Courses
              </p>
              <Link to={"/classLink/teachers"} className="btn btn-sm view-btn">
                Create Teachers
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Courses;
