import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { UserContext } from "../../contexts/UserContext";

const ExamTable = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const [selectedExam, setSelectedExam] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [exams, setExams] = useState(null);
  const [courses, setCourses] = useState(null);
  const [addingExam, setAddingExam] = useState(null);
  const [addExam, setAddExam] = useState({
    unit_code: "",
    date: "",
    start_time: "",
    duration: "",
    location: "",
  });
  const [fetchUrl, setFetchUrl] = useState({
    url: import.meta.env.VITE_GET_EXAMS,
    options: {},
  });

  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  useEffect(() => {
    document.title = "Class Link | Exams Timetable";
    if (data) {
      setExams(data.exams);
      setCourses(data.courses);
    }
  }, [data]);

  const openModal = (item, action) => {
    action === "add-exam" ? setAddingExam(item) : setSelectedExam(item);
    setEditingExam(null);
  };

  const closeModal = () => {
    setSelectedExam(null);
    setEditingExam(null);
    setAddingExam(null);
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddingExam((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExam = (e) => {
    e.preventDefault();
    setFetchUrl({
      url: `${import.meta.env.VITE_ADD_EXAM}`,
      options: {
        method: "POST",
        body: addingExam,
        headers: { "Content-Type": "application/json" },
      },
    });

    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingExam((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    setFetchUrl({
      url: `${import.meta.env.VITE_UPDATE_EXAM}/${editingExam.id}`,
      options: {
        method: "PATCH",
        body: editingExam,
        headers: { "Content-Type": "application/json" },
      },
    });

    closeModal();
  };

  const handleDelete = () => {
    setFetchUrl({
      url: `${import.meta.env.VITE_DELETE_EXAM}/${selectedExam.id}`,
      options: {
        method: "DELETE",
      },
    });

    closeModal();
  };

  return (
    <div className="container mt-4">
      <div className="flex-r mb-3">
        <h2 className="">Exams Timetable</h2>
        {userRole !== "student" && courses && courses.length > 0 && (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => openModal(addExam, "add-exam")}
          >
            Create More
          </button>
        )}
      </div>
      {loading && <p>Loading Exams Timetable ...</p>}
      {error && (
        <div className="alert alert-danger " role="alert">
          {error.message}
        </div>
      )}
      {!loading && !error && exams && exams.length > 0 ? (
        <table className="table table-primary">
          <thead>
            <tr>
              <th scope="col">
                <div className="text-start ms-1">Subject</div>
              </th>
              <th scope="col">Date</th>
              <th scope="col">Start Time</th>
              <th scope="col">Duration</th>
              <th scope="col">Location</th>
              {userRole === "admin" && (
                <th scope="col">
                  <div className="text-end me-2"> Action</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {exams &&
              exams.map((ex) => (
                <tr key={ex.id}>
                  <td>
                    {courses.map((c) => (
                      <div key={c.id}>
                        {c.unit_code == ex.unit_code && c.course_title}
                      </div>
                    ))}
                  </td>
                  <td>{ex.date.split("T")[0]}</td>
                  <td>{ex.start_time}</td>
                  <td>{ex.duration} hours</td>
                  <td>{ex.location}</td>
                  {userRole === "admin" && (
                    <td className="text-end">
                      <a
                        className="btn btn-sm btn-outline-primary view-btn"
                        onClick={() => openModal(ex, "view")}
                      >
                        View Details
                      </a>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <>
          {!loading && <p>No Timetable available</p>}
          {!error && !loading && courses && courses.length === 0 && (
            <>
              <p>
                <i className="bi bi-patch-question"></i> Create Courses in order
                to add Timetable
              </p>
              <Link to={"/classLink/courses"} className="btn btn-sm view-btn">
                Create Courses
              </Link>
            </>
          )}
        </>
      )}

      {(selectedExam || addingExam) && (
        <div
          className="modal fade show custom-modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content animate-modal">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {addingExam ? "Add Exam" : `Exam Details`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body">
                {selectedExam && !addingExam && (
                  <div className="assignment-details-card">
                    <div className="assignment-info-modal mt-3">
                      <h5>
                        {courses.map((c) => (
                          <div key={c.id}>
                            {c.unit_code == selectedExam.unit_code &&
                              c.course_title}
                          </div>
                        ))}
                      </h5>
                      <p>
                        <strong>Date:</strong> {selectedExam.date.split("T")[0]}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedExam.start_time}
                      </p>
                      <p>
                        <strong>Duration:</strong> {selectedExam.duration} hour
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedExam.location}
                      </p>
                      <hr />
                    </div>
                  </div>
                )}

                {editingExam && !addingExam && (
                  <form onSubmit={handleUpdate} id="editForm">
                    <p>Update Exams</p>
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={editingExam.date.split("T")[0]}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        name="start_time"
                        value={editingExam.start_time}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="number"
                        name="duration"
                        min={1}
                        value={editingExam.duration}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editingExam.location}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="modal-footer">
                      <div className="row g-2 w-100">
                        <div className="col-lg-6">
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="btn btn-info w-100 text-white"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {!editingExam && !addingExam && (
                  <div className="modal-footer">
                    <div className="row g-2 w-100">
                      <div className="col-lg-4">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="col-lg-4">
                        <button
                          type="button"
                          className="btn btn-info w-100 text-white"
                          onClick={() => setEditingExam(selectedExam)}
                        >
                          Update
                        </button>
                      </div>
                      <div className="col-lg-4">
                        <button
                          type="button"
                          className="btn btn-danger w-100"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {addingExam && (
                  <form onSubmit={handleAddExam}>
                    <div className="form-group">
                      <label>Subject</label>
                      <select
                        name="unit_code"
                        id="unit_code"
                        className="form-control mt-2"
                        value={addingExam.unit_code}
                        onChange={handleAddChange}
                      >
                        <option value="0">Select Subject</option>
                        {courses &&
                          courses.map((course) => (
                            <option key={course.id} value={course.unit_code}>
                              {course.course_title}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={addingExam.date}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        name="start_time"
                        value={addingExam.start_time}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        type="number"
                        name="duration"
                        value={addingExam.duration}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={addingExam.location}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>

                    <div className="modal-footer">
                      <div className="row g-2 w-100">
                        <div className="col-lg-6">
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="btn btn-info w-100 text-white"
                          >
                            Add Exam
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {(selectedExam || addingExam) && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default ExamTable;
