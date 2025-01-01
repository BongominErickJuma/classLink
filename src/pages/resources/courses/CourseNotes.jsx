import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";

const CourseNotes = () => {
  const { unitCode } = useParams();
  const [notes, setNotes] = useState(null);

  const { data, error, loading } = useFetch(
    `${import.meta.env.VITE_GET_NOTES}/${unitCode}`,
    {}
  );

  useEffect(() => {
    document.title = "Class Link | Course Notes";
    if (data) {
      setNotes(data);
    }
  }, [data]);
  return (
    <>
      {loading && !notes && !error && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && !loading && !notes && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}
      <h3>Course Notes</h3>
      <div className="row">
        {notes &&
          notes.map((note) => (
            <div key={note.chapter} className="col-md-4 mb-4">
              <Link
                to={`/classLink/notes/${unitCode}/${note.chapter}`}
                state={note}
              >
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Chapter {note.chapter}</h5>
                    <p>{note.title}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </>
  );
};

export default CourseNotes;
