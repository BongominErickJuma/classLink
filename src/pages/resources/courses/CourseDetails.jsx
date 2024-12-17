import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import CourseNotes from "./CourseNotes";

const CourseDetails = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const { unitCode } = useParams();
  const [course, setCourse] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [teachers, setTeachers] = useState(null);
  const [addNote, setAddNotes] = useState({
    title: "",
    content: "",
  });
  const [editCourse, setEditCourse] = useState(null);

  const [fetchUrl, setFetchUrl] = useState({
    url: `${import.meta.env.VITE_GET_COURSE}/${unitCode}`,
    options: {},
  });
  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddNotes((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNote = (e) => {
    e.preventDefault();

    setFetchUrl({
      url: `${import.meta.env.VITE_ADD_NOTE}/${unitCode}`,
      options: {
        method: "POST",
        body: addNote,
        headers: { "Content-Type": "application/json" },
      },
    });

    window.location.reload();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCourse = (e) => {
    e.preventDefault();

    // Make sure to check if the Note exists before proceeding
    if (editCourse) {
      setFetchUrl({
        url: `${import.meta.env.VITE_UPDATE_COURSE}/${unitCode}`,
        options: {
          method: "PATCH",
          body: editCourse, // Stringify the updated Note
          headers: { "Content-Type": "application/json" },
        },
      });

      window.location.reload();
    }
  };

  const handleDeleteCourse = (e) => {
    e.preventDefault();
    setFetchUrl({
      url: `${import.meta.env.VITE_DELETE_COURSE}/${unitCode}`,
      options: {
        method: "DELETE",
      },
    });

    window.location.reload();
  };
  useEffect(() => {
    document.title = "Class Link | Course";
    if (data) {
      setCourse(data.course);
      setEditCourse({
        ...data.course,
        teacher_id: data.teacher.id,
      });
      setTeacher(data.teacher);
      setTeachers(data.teachers);
    }
  }, [data]);

  return (
    <div className="container my-4">
      {loading && !course && !error && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && !loading && !course && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}
      {course && (
        <div>
          <h3>
            {course.unit_code} - {course.course_title}
          </h3>
          <div className="row my-3">
            <div className="col-lg-3">
              <button
                className="btn btn-sm btn-outline-primary view-btn w-100"
                data-bs-toggle="collapse"
                href={`#viewNote`}
              >
                View
              </button>
            </div>
            {userRole !== "student" && (
              <>
                {userRole === "admin" && (
                  <div className="col-lg-3">
                    <button
                      className="btn btn-sm btn-outline-primary view-btn w-100"
                      data-bs-toggle="collapse"
                      href={`#editcourse`}
                    >
                      Edit
                    </button>
                  </div>
                )}
                {user?.id === course.teacher_id && (
                  <div className="col-lg-3">
                    <button
                      className="btn btn-sm btn-outline-primary view-btn w-100"
                      data-bs-toggle="collapse"
                      href="#addNote"
                    >
                      Add Note
                    </button>
                  </div>
                )}

                {userRole === "admin" && (
                  <div className="col-lg-3">
                    <button
                      className="btn btn-sm btn-outline-danger view-btn w-100"
                      data-bs-toggle="collapse"
                      href={`#deleteNote${course.id}`}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
            <div className="collapse col-lg-12" id={`viewNote`}>
              <div className="my-3">
                <p>{course.description}</p>
                <small className="me-2">
                  Turor:
                  <strong className="mx-2">{teacher && teacher.name}</strong>|
                </small>
                <small className="me-2">
                  Credi Units:
                  <strong className="mx-2">{course.credit_units}</strong>|
                </small>
                <small className="me-2">
                  Level:
                  <strong className="mx-2">{course.level}</strong>|
                </small>
                <small className="me-2">
                  Prerequisites:
                  <strong className="mx-2">{course.prerequisites}</strong>|
                </small>

                <button
                  className="btn btn-sm border view-btn"
                  data-bs-toggle="collapse"
                  href={`#viewNote`}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="collapse col-lg-12" id="editcourse">
              <div className="my-3">
                <form onSubmit={handleEditCourse}>
                  <div className="row">
                    <div className="form-group col-lg-4">
                      <label htmlFor="courseTitle">Course Title</label>
                      <input
                        type="text"
                        name="course_title"
                        id="courseTitle"
                        className="form-control mt-2"
                        value={editCourse.course_title}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="form-group col-lg-4">
                      <label htmlFor="lecturer">Lecturer</label>
                      <select
                        name="teacher_id"
                        id="lecturer"
                        className="form-control mt-2"
                        value={editCourse.teacher_id} // Value will be the selected lecturer's ID
                        onChange={handleInputChange}
                      >
                        <option value={teacher.id}>{teacher.name}</option>
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
                        value={editCourse.prerequisites}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <label htmlFor="deliveryMode">Delivery Mode</label>
                      <input
                        type="text"
                        name="delivery_mode"
                        id="deliveryMode"
                        className="form-control mt-2"
                        value={editCourse.delivery_mode}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <label htmlFor="assessment">Assessment</label>
                      <input
                        type="text"
                        name="assessment"
                        id="assessment"
                        className="form-control mt-2"
                        value={editCourse.assessment}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <label htmlFor="semester">Semester</label>
                      <input
                        type="text"
                        name="semester"
                        id="semester"
                        className="form-control mt-2"
                        value={editCourse.semester}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <label htmlFor="level">Level</label>
                      <input
                        type="text"
                        name="level"
                        id="level"
                        className="form-control mt-2"
                        value={editCourse.level}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group col-lg-2">
                      <label htmlFor="creditUnits">Credit Units</label>
                      <input
                        type="text"
                        name="credit_units"
                        id="creditUnits"
                        className="form-control mt-2"
                        value={editCourse.credit_units}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group col-lg-2">
                      <label htmlFor="unitCode">Unit Code</label>
                      <input
                        type="text"
                        name="unit_code"
                        id="unitCode"
                        className="form-control mt-2"
                        value={editCourse.unit_code}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        name="description"
                        id="description"
                        className="form-control mt-2"
                        value={editCourse.description}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                  <div className="row g-2 w-50">
                    <div className="col-lg-6">
                      <button
                        type="button"
                        className="btn btn-sm  btn-primary w-100"
                        data-bs-toggle="collapse"
                        href={`#editcourse`}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="col-lg-6">
                      <button
                        type="submit"
                        className="btn btn-sm  btn-info w-100 text-white"
                      >
                        Edit Course
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="collapse my-3" id="addNote">
              <form onSubmit={handleAddNote}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="form-control mt-2"
                    value={addNote.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="content">Content</label>
                  <textarea
                    name="content"
                    id="content"
                    className="form-control mt-2"
                    value={addNote.content}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="row g-2 w-50">
                  <div className="col-lg-6">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary w-100"
                      data-bs-toggle="collapse"
                      href="#addNote"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="col-lg-6">
                    <button
                      type="submit"
                      className="btn btn-sm  btn-info w-100 text-white"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="collapse col-lg-12" id={`deleteNote${course.id}`}>
              <div className="my-3">
                <form>
                  <div className="form-group">
                    <p>Are you sure you want to delete {course.courseTitle}?</p>
                  </div>

                  <div className="row g-2 w-50">
                    <div className="col-lg-6">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary w-100"
                        data-bs-toggle="collapse"
                        href={`#deleteNote${course.id}`}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="col-lg-6">
                      <button
                        type="submit"
                        className="btn btn-sm  btn-danger w-100 text-white"
                        onClick={handleDeleteCourse}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <CourseNotes />
    </div>
  );
};

export default CourseDetails;
