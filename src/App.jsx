import React, { useState } from "react";
import { match } from "path-to-regexp"; // Import the matching function
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/layouts/header/Header";
import Sidebar from "./components/layouts/sidebar/Sidebar";
import Footer from "./components/layouts/footer/Footer";
import Homepage from "./pages/homepage/Homepage";
import TodaySchedule from "./pages/schedule/Today/TodaySchedule";
import Timetable from "./pages/schedule/timetable/Timetable";
import Students from "./pages/members/Students";
import Teachers from "./pages/members/Teachers";
import ExamsTable from "./pages/calendar/ExamsTable";
import AssignmentsTable from "./pages/calendar/AssignmentTable";
import Courses from "./pages/resources/courses/Courses";
import Assignments from "./pages/resources/assignments/Assignments";
import AssignmentDetail from "./pages/resources/assignments/AssignmentDetail";
import Answers from "./pages/resources/answers/Answers";
import AnswerDetails from "./pages/resources/answers/AnswerDetails";
import CourseDetails from "./pages/resources/courses/CourseDetails";
import NotesDetails from "./pages/resources/courses/NotesDetails";
import Meetings from "./pages/calendar/Meetings";
import Login from "./pages/Login/Login";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./protect/ProtectedRoute";
import Performance from "./pages/statistics/performances/Performance";
import Cprogress from "./pages/statistics/courses/Cprogress";
import Attendance from "./pages/statistics/attendance/Attendance";

// Define your valid paths
const validPaths = [
  "/dashboard",
  "/todayschedule",
  "/timetable",
  "/students",
  "/teachers",
  "/timetable_exams",
  "/timetable_assignments",
  "/courses",
  "/courses/:unitCode",
  "/notes/:unitCode/:id",
  "/assignments",
  "/assignments/:unitCode",
  "/answers",
  "/answers/:unitCode",
  "/meetings",
  "/profile",
  "/performance",
  "/course_progress",
  "/attendance",
];

// Function to check if the current path is valid, including dynamic segments
const isPathValid = (currentPath) => {
  return validPaths.some((path) => {
    const matcher = match(path, { decode: decodeURIComponent });
    return matcher(currentPath); // Returns true if the path matches
  });
};

const App = () => {
  const [isSidebarToggled, setIsSidebarToggled] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const handleToggleSidebar = () => {
    setIsSidebarToggled(!isSidebarToggled);
    if (!isSidebarToggled) {
      setIsSidebarHovered(false);
    }
  };

  // Show sidebar and header only for valid paths
  const showHeaderAndSidebar = isPathValid(currentPath);

  return (
    <div
      className={`${
        isSidebarToggled && !isSidebarHovered ? "toggle-sidebar" : ""
      } ${isSidebarHovered ? "hover-sidebar" : ""}`}
    >
      {showHeaderAndSidebar && (
        <>
          <Header handleToggleSidebar={handleToggleSidebar} />
          <Sidebar />
        </>
      )}

      <div className="min-vh-100 main" id={`${showHeaderAndSidebar && "main"}`}>
        <Routes>
          {/* Public route */}
          <Route exact path="/" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todayschedule"
            element={
              <ProtectedRoute>
                <TodaySchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timetable"
            element={
              <ProtectedRoute>
                <Timetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timetable_exams"
            element={
              <ProtectedRoute>
                <ExamsTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timetable_assignments"
            element={
              <ProtectedRoute>
                <AssignmentsTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:unitCode"
            element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes/:unitCode/:id"
            element={
              <ProtectedRoute>
                <NotesDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments"
            element={
              <ProtectedRoute>
                <Assignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assignments/:unitCode"
            element={
              <ProtectedRoute>
                <AssignmentDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/answers"
            element={
              <ProtectedRoute>
                <Answers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/answers/:unitCode"
            element={
              <ProtectedRoute>
                <AnswerDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meetings"
            element={
              <ProtectedRoute>
                <Meetings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <Performance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course_progress"
            element={
              <ProtectedRoute>
                <Cprogress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
