import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HeaderSidebar from "../components/layouts/HeaderSidebar";
import Homepage from "../pages/homepage/Homepage";
import TodaySchedule from "../pages/schedule/Today/TodaySchedule";
import Timetable from "../pages/schedule/timetable/Timetable";
import Students from "../pages/members/Students";
import Teachers from "../pages/members/Teachers";
import ExamsTable from "../pages/calendar/ExamsTable";
import AssignmentsTable from "../pages/calendar/AssignmentTable";
import Courses from "../pages/resources/courses/Courses";
import Assignments from "../pages/resources/assignments/Assignments";
import AssignmentDetail from "../pages/resources/assignments/AssignmentDetail";
import Answers from "../pages/resources/answers/Answers";
import AnswerDetails from "../pages/resources/answers/AnswerDetails";
import CourseDetails from "../pages/resources/courses/CourseDetails";
import NotesDetails from "../pages/resources/courses/NotesDetails";
import Meetings from "../pages/calendar/Meetings";
import Login from "../pages/Login/Login";
import Profile from "../pages/profile/Profile";
// import ProtectedRoute from "../protect/ProtectedRoute";
import Performance from "../pages/statistics/performances/Performance";
import Cprogress from "../pages/statistics/courses/Cprogress";
import Attendance from "../pages/statistics/attendance/Attendance";

const AppRoutes = () => {
  const routesForPublic = [
    { path: "/classLink", element: <Login /> },
    {
      path: "/classLink/dashboard",
      element: (
        <HeaderSidebar>
          <Homepage />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/todayschedule",
      element: (
        <HeaderSidebar>
          <TodaySchedule />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/timetable",
      element: (
        <HeaderSidebar>
          <Timetable />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/students",
      element: (
        <HeaderSidebar>
          <Students />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/teachers",
      element: (
        <HeaderSidebar>
          <Teachers />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/timetable_exams",
      element: (
        <HeaderSidebar>
          <ExamsTable />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/timetable_assignments",
      element: (
        <HeaderSidebar>
          <AssignmentsTable />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/courses",
      element: (
        <HeaderSidebar>
          <Courses />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/assignments",
      element: (
        <HeaderSidebar>
          <Assignments />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/assignments/:unitCode",
      element: (
        <HeaderSidebar>
          <AssignmentDetail />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/answers",
      element: (
        <HeaderSidebar>
          <Answers />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/answers/:unitCode",
      element: (
        <HeaderSidebar>
          <AnswerDetails />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/courses/:unitCode",
      element: (
        <HeaderSidebar>
          <CourseDetails />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/notes/:unitCode/:id",
      element: (
        <HeaderSidebar>
          <NotesDetails />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/meetings",
      element: (
        <HeaderSidebar>
          <Meetings />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/profile",
      element: (
        <HeaderSidebar>
          <Profile />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/performance",
      element: (
        <HeaderSidebar>
          <Performance />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/course_progress",
      element: (
        <HeaderSidebar>
          <Cprogress />
        </HeaderSidebar>
      ),
    },
    {
      path: "/classLink/attendance",
      element: (
        <HeaderSidebar>
          <Attendance />
        </HeaderSidebar>
      ),
    },
  ];
  const router = createBrowserRouter([...routesForPublic]);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
