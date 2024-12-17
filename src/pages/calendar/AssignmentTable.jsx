import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { UserContext } from "../../contexts/UserContext";

const AssignmentTable = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [courses, setCourses] = useState(null);
  const [addingAssignment, setAddingAssignment] = useState(null);
  const [addAssignment, setAddAssignment] = useState({
    name: "",
    duedate: "",
    location: "",
    description: "",
  });
  const [fetchUrl, setFetchUrl] = useState({
    url: import.meta.env.VITE_GET_ASSIGNMENTS,
    options: {},
  });

  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  useEffect(() => {
    document.title = "Class Link | Assignments Timetable";
    if (data) {
      setAssignments(data.assignments);
      setCourses(data.courses);
    }
  }, [data]);

  const openModal = (item, action) => {
    action === "add-assignment"
      ? setAddingAssignment(item)
      : setSelectedAssignment(item);
    setEditingAssignment(null);
  };

  const closeModal = () => {
    setSelectedAssignment(null);
    setEditingAssignment(null);
    setAddingAssignment(null);
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    setFetchUrl({
      url: `${import.meta.env.VITE_ADD_ASSIGNMENT}`,
      options: {
        method: "POST",
        body: addingAssignment,
        headers: { "Content-Type": "application/json" },
      },
    });
    window.location.reload();
    closeModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    setFetchUrl({
      url: `${import.meta.env.VITE_UPDATE_ASSIGNMENT}/${editingAssignment.id}`,
      options: {
        method: "PATCH",
        body: editingAssignment,
        headers: { "Content-Type": "application/json" },
      },
    });
    window.location.reload();
    closeModal();
  };

  const handleDelete = () => {
    console.log(selectedAssignment);
    setFetchUrl({
      url: `${import.meta.env.VITE_DELETE_ASSIGNMENT}/${selectedAssignment.id}`,
      options: {
        method: "DELETE",
      },
    });
    window.location.reload();
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddingAssignment((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mt-4">
      <div className="flex-r mb-3">
        <h2 className="">Assignments Timetable</h2>
        {userRole !== "student" && courses && courses.length > 0 && (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => openModal(addAssignment, "add-assignment")}
          >
            Create More
          </button>
        )}
      </div>
      {loading && <p>Loading Assignments Timetable ...</p>}
      {error && (
        <div className="alert alert-danger " role="alert">
          {error.message}
        </div>
      )}
      {!loading && !error && assignments && assignments.length > 0 ? (
        <table className="table table-primary">
          <thead>
            <tr>
              <th scope="col">
                <div className="text-start ms-1">Subject</div>
              </th>
              <th scope="col">Due Date</th>
              <th scope="col">Location</th>
              <th scope="col">Description</th>
              {userRole === "admin" && (
                <th scope="col">
                  <div className="text-end me-2"> Action</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {assignments &&
              assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>
                    {courses.map((c) => (
                      <div key={c.id}>
                        {c.unit_code == assignment.unit_code && c.course_title}
                      </div>
                    ))}
                  </td>
                  <td>{assignment.duedate.split("T")[0]}</td>
                  <td>{assignment.location}</td>
                  <td className="font-small">{assignment.description}</td>
                  {userRole === "admin" && (
                    <td className="text-end">
                      <a
                        className="btn btn-sm btn-outline-primary view-btn"
                        onClick={() => openModal(assignment, "view")}
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

      {(selectedAssignment || addingAssignment) && (
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
                  {addingAssignment ? "Add Assignment" : `Assignment Details`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body">
                {selectedAssignment && !addingAssignment && (
                  <div className="assignment-details-card">
                    <div className="assignment-info-modal mt-3">
                      <h5>
                        {courses.map((c) => (
                          <div key={c.id}>
                            {c.unit_code == selectedAssignment.unit_code &&
                              c.course_title}
                          </div>
                        ))}
                      </h5>
                      <p>
                        <strong>Due Date:</strong>
                        {selectedAssignment.duedate.split("T")[0]}
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedAssignment.location}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedAssignment.description}
                      </p>
                      <hr />
                    </div>
                  </div>
                )}

                {editingAssignment && !addingAssignment && (
                  <form onSubmit={handleUpdate} id="editForm">
                    <div className="form-group">
                      <label>Due Date</label>
                      <input
                        type="date"
                        name="duedate"
                        value={editingAssignment.duedate.split("T")[0]}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editingAssignment.location}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={editingAssignment.description}
                        onChange={handleInputChange}
                        className="form-control"
                      ></textarea>
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

                {!editingAssignment && !addingAssignment && (
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
                          onClick={() =>
                            setEditingAssignment(selectedAssignment)
                          }
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

                {addingAssignment && (
                  <form onSubmit={handleAddAssignment}>
                    <div className="form-group">
                      <label>Subject</label>
                      <select
                        name="unit_code"
                        id="unit_code"
                        className="form-control mt-2"
                        value={addingAssignment.unit_code}
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
                      <label>Due Date</label>
                      <input
                        type="date"
                        name="duedate"
                        value={addingAssignment.duedate}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={addingAssignment.location}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={addingAssignment.description}
                        onChange={handleAddChange}
                        className="form-control"
                      ></textarea>
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
                            Add Assignment
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
      {(selectedAssignment || addingAssignment) && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default AssignmentTable;
