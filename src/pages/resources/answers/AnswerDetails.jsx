import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";

const AnswerDetails = () => {
  const { user } = useContext(UserContext);
  const userRole = user?.role;
  const [answers, setAnswers] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [course, setCourse] = useState(null);
  const [editAnswers, setEditAnswers] = useState({});
  const [marking, setMarking] = useState({});
  const { unitCode } = useParams();

  const [fetchUrl, setFetchUrl] = useState({
    url: `${import.meta.env.VITE_GET_ANSWER}/${unitCode}`,
    options: {},
  });
  const { data, error, loading } = useFetch(fetchUrl.url, fetchUrl.options);

  const handleEditChange = (e, id) => {
    const { name, value } = e.target;
    setEditAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: value },
    }));
  };

  const handleEditAnswer = (e, id) => {
    e.preventDefault();

    const updatedAnswer = editAnswers[id];
    if (updatedAnswer) {
      setFetchUrl({
        url: `${import.meta.env.VITE_UPDATE_ANSWER}/${id}`,
        options: {
          method: "PATCH",
          body: JSON.stringify(updatedAnswer),
          headers: { "Content-Type": "application/json" },
        },
      });
      window.location.reload();
    }
  };

  const handleMarking = (e, id) => {
    const { name, value } = e.target;
    setMarking((prev) => ({
      ...prev,
      [id]: { ...prev[id], [name]: value },
    }));
  };

  const handleAddMarks = (e, id, sid, aid) => {
    e.preventDefault();

    const markedAnswer = {
      id: parseInt(aid, 10),
      unit_code: unitCode,
      student_id: sid,
      assignments_id: id,
      marks: parseInt(marking[aid].mark),
      course_name: course.course_title,
    };

    if (markedAnswer) {
      setFetchUrl({
        url: import.meta.env.VITE_ADD_PERFORMANCE,
        options: {
          method: "POST",
          body: JSON.stringify(markedAnswer),
          headers: { "Content-Type": "application/json" },
        },
      });
    }

    window.location.reload();
  };

  useEffect(() => {
    document.title = "Class Link | Answer";
    if (data) {
      setQuestions(data.questions);
      setCourse(data.course);
      const studentAnswers = data.answers.filter(
        (answer) => answer.student_id === user?.id
      );
      userRole === "student"
        ? setAnswers(studentAnswers)
        : setAnswers(data.answers);
    }
  }, [data]);

  return (
    <div className="container my-4">
      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error.message}
        </div>
      )}
      {questions && (
        <div>
          <h3>
            {course.unit_code} - {course.course_title}
          </h3>
          {questions.map((qtn, idx) => (
            <div key={qtn.id}>
              <h5>Question {idx + 1}.</h5>
              <p className="w-75">{qtn.question}</p>
              {answers.map(
                (ans) =>
                  ans.assignments_id === qtn.id &&
                  ans.status !== "marked" && (
                    <div key={ans.id}>
                      {(user?.id === course.teacher_id ||
                        userRole === "student") && (
                        <>
                          <h6>Answer</h6>
                          <p className="w-75">{ans.answer}</p>
                        </>
                      )}

                      <div className="row my-3">
                        <div className="row g-2 w-75">
                          {userRole === "student" && (
                            <>
                              <div className="col-lg-6">
                                <button
                                  className="btn btn-sm btn-outline-primary view-btn w-100"
                                  data-bs-toggle="collapse"
                                  href={`#editAnswer${ans.id}`}
                                >
                                  Edit
                                </button>
                              </div>
                            </>
                          )}
                          {user?.id === course.teacher_id &&
                            userRole !== "student" && (
                              <div className="col-lg-6">
                                <button
                                  className="btn btn-sm view-btn w-100"
                                  data-bs-toggle="collapse"
                                  href={`#mark${ans.id}`}
                                >
                                  Mark
                                </button>
                              </div>
                            )}
                        </div>

                        <div
                          className="collapse col-lg-12"
                          id={`editAnswer${ans.id}`}
                        >
                          <div className="w-75 my-3">
                            <form onSubmit={(e) => handleEditAnswer(e, ans.id)}>
                              <div className="form-group">
                                <label>Answer</label>
                                <textarea
                                  name="answer"
                                  className="form-control mt-2"
                                  value={
                                    editAnswers[ans.id]?.answer || ans.answer
                                  } // Show edited value if exists
                                  onChange={(e) => handleEditChange(e, ans.id)}
                                />
                              </div>

                              <div className="row g-2 w-50">
                                <div className="col-lg-6">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary w-100"
                                    data-bs-toggle="collapse"
                                    href={`#editAnswer${ans.id}`}
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <div className="col-lg-6">
                                  <button
                                    type="submit"
                                    className="btn btn-sm btn-info w-100 text-white"
                                  >
                                    Save Answer
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div
                          className="collapse col-lg-12"
                          id={`mark${ans.id}`}
                        >
                          <div className="w-75 my-3">
                            <form
                              onSubmit={(e) =>
                                handleAddMarks(
                                  e,
                                  qtn.id,
                                  ans.student_id,
                                  ans.id
                                )
                              }
                            >
                              <div className="form-group w-50">
                                <label>Mark</label>
                                <input
                                  type="number"
                                  name="mark"
                                  value={marking[ans.id]?.mark || ""}
                                  min={1}
                                  max={100}
                                  onChange={(e) => handleMarking(e, ans.id)}
                                  className="form-control"
                                />
                              </div>

                              <div className="row g-2 w-50">
                                <div className="col-lg-6">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary w-100"
                                    data-bs-toggle="collapse"
                                    href={`#mark${ans.id}`}
                                  >
                                    Cancel
                                  </button>
                                </div>
                                <div className="col-lg-6">
                                  <button
                                    type="submit"
                                    className="btn btn-sm btn-info w-100 text-white"
                                  >
                                    Mark
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnswerDetails;
