import React, { useState, useEffect, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import { UserContext } from "../../contexts/UserContext";

const Students = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [students, setStudents] = useState(null);
  const [addingStudent, setAddingStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [addStudent, setAddStudent] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    password: "",
    role: "student",
  });
  const [fetchUrl, setFetchUrl] = useState({
    url: import.meta.env.VITE_GET_STUDENTS,
    options: {},
  });

  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  useEffect(() => {
    document.title = "Class Link | Students";
    if (data) {
      setStudents(data.students);
    }
  }, [data]);

  const openModal = (item, action) => {
    action === "add-student"
      ? setAddingStudent(item)
      : setSelectedStudent(item);
    setEditingStudent(null);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setEditingStudent(null);
    setAddingStudent(null);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setFetchUrl({
      url: `${import.meta.env.VITE_ADD_STUDENT}`,
      options: {
        method: "POST",
        body: addingStudent,
        headers: { "Content-Type": "application/json" },
      },
    });
    closeModal();
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    setFetchUrl({
      url: `${import.meta.env.VITE_UPDATE_STUDENT}/${editingStudent.id}`,
      options: {
        method: "PATCH",
        body: editingStudent,
        headers: { "Content-Type": "application/json" },
      },
    });
    closeModal();
  };

  const handleDelete = () => {
    setFetchUrl({
      url: `${import.meta.env.VITE_DELETE_STUDENT}/${selectedStudent.id}`,
      options: {
        method: "DELETE",
      },
    });
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddingStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Filter students based on search query
  const filteredStudents = students
    ? students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="container mt-4">
      <div className="flex-r mb-3">
        <h2 className="">Students List</h2>
        <form className="search-form">
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search Students..."
          />
          <button className="search-btn">Search</button>
        </form>
        {userRole === "admin" && (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => openModal(addStudent, "add-student")}
          >
            Create More
          </button>
        )}
      </div>
      {loading && <p>Loading Students ...</p>}
      {error && (
        <div className="alert alert-danger " role="alert">
          {error.message}
        </div>
      )}

      {!loading && !error && students && filteredStudents.length > 0 ? (
        <table className="table table-primary">
          <thead>
            <tr>
              <th scope="col">
                <div className="text-start ms-1">Image</div>
              </th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              {userRole === "admin" && (
                <th scope="col">
                  <div className="text-end me-2"> Action</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="text-start">
                  <img
                    src={student.image}
                    alt={`${student.name}'s photo`}
                    width="32"
                    height="32"
                    className="rounded-circle"
                  />
                </td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                {userRole === "admin" && (
                  <td className="text-end">
                    <a
                      className="btn btn-sm btn-outline-primary view-btn"
                      onClick={() => openModal(student, "view")}
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
        !loading && <p>No Student Available</p>
      )}

      {(selectedStudent || addingStudent) && (
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
                  {addingStudent
                    ? "Add Student"
                    : `${selectedStudent.name}'s Details`}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body">
                {selectedStudent && !addingStudent && (
                  <div className="student-details-card">
                    <img
                      src={selectedStudent.image}
                      alt={`${selectedStudent.name}'s photo`}
                      className="student-image-modal w-25 d-block"
                    />
                    <div className="student-info-modal mt-3">
                      <h4>{selectedStudent.name}</h4>
                      <p>
                        <strong>Email:</strong> {selectedStudent.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {selectedStudent.phone}
                      </p>
                    </div>
                  </div>
                )}

                {editingStudent && !addingStudent && (
                  <form onSubmit={handleUpdate} id="editForm">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editingStudent.name}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editingStudent.email}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={editingStudent.phone}
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

                {!editingStudent && !addingStudent && (
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
                          onClick={() => setEditingStudent(selectedStudent)}
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
                          delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {addingStudent && (
                  <form onSubmit={handleAddStudent}>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={addingStudent.name}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={addingStudent.email}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={addingStudent.phone}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group" hidden>
                      <label>Role</label>
                      <input
                        type="text"
                        name="role"
                        value={addingStudent.role}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        type="text"
                        name="password"
                        value={addingStudent.password}
                        onChange={handleAddChange}
                        className="form-control"
                      />
                    </div>

                    <div className="form-group">
                      <label>Image URL</label>
                      <input
                        type="text"
                        name="image"
                        value={addingStudent.image}
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
                            Add Student
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
      {(selectedStudent || addingStudent) && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default Students;
