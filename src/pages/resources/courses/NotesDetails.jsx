import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";

const NotesDetails = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const { unitCode, id } = useParams();
  const [note, setNote] = useState(null);
  const [editNote, setEditNote] = useState(null);
  const [fetchUrl, setFetchUrl] = useState({
    url: `${import.meta.env.VITE_GET_NOTE}/${unitCode}/${id}`,
    options: {},
  });

  const noteDetail = useLocation();

  const noteId = parseInt(noteDetail.state.id, 10);
  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditNote((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditNote = (e) => {
    e.preventDefault();

    // Make sure to check if the question exists before proceeding
    if (editNote) {
      setFetchUrl({
        url: `${import.meta.env.VITE_UPDATE_NOTE}/${noteId}`,
        options: {
          method: "PATCH",
          body: editNote, // Stringify the updated question
          headers: { "Content-Type": "application/json" },
        },
      });
    }
  };

  const handleDeleteNote = (e) => {
    e.preventDefault();
    setFetchUrl({
      url: `${import.meta.env.VITE_DELETE_NOTE}/${noteId}`,
      options: {
        method: "DELETE",
      },
    });

    setTimeout(() => {
      navigate(`/classLink/courses/${unitCode}`);
    }, 1000);
  };
  useEffect(() => {
    document.title = "Class Link | Notes";
    if (data) {
      setNote(data.chapter);
      setEditNote(data.chapter);
    }
  }, [data]);

  return (
    <>
      {loading && !note && !error && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && !loading && !note && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}

      {note && (
        <div>
          <h3>Chapter {note.chapter}</h3>
          <h4>{note.title}</h4>
          <div className="row my-3">
            {userRole !== "student" && (
              <>
                <div className="col-lg-3">
                  <button
                    className="btn btn-sm btn-outline-primary view-btn w-100"
                    data-bs-toggle="collapse"
                    href={`#editNote`}
                  >
                    Edit
                  </button>
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-sm btn-outline-danger view-btn w-100"
                    data-bs-toggle="collapse"
                    href={`#deleteNote`}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
            <div className="col-lg-3">
              <Link
                to={`/classLink/courses/${unitCode}`}
                className="btn btn-sm btn-outline-primary view-btn w-100"
              >
                Back
              </Link>
            </div>
          </div>
          <div className="collapse col-lg-12" id={`editNote`}>
            <div className="w-75 my-3">
              <form onSubmit={handleEditNote}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="form-control mt-2"
                    value={editNote.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="content">Content</label>
                  <textarea
                    name="content"
                    id="content"
                    className="form-control mt-2"
                    value={editNote.content}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="row g-2 w-100">
                  <div className="col-lg-6">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary w-100"
                      data-bs-toggle="collapse"
                      href="#editNote"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="col-lg-6">
                    <button
                      type="submit"
                      className="btn btn-sm btn-info w-100 text-white"
                    >
                      Edit Note
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="collapse col-lg-12" id={`deleteNote`}>
            <div className="w-75 my-3">
              <form>
                <div className="form-group">
                  <p>Are you sure you want to delete Chapter {note.chapter}?</p>
                </div>

                <div className="row g-2 w-100">
                  <div className="col-lg-6">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary w-100"
                      data-bs-toggle="collapse"
                      href={`#deleteNote`}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="col-lg-6">
                    <button
                      type="submit"
                      className="btn btn-sm btn-danger w-100 text-white"
                      onClick={handleDeleteNote}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <p>{note.content}</p>
        </div>
      )}
    </>
  );
};

export default NotesDetails;
