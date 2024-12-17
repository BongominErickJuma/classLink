const dropdown = [
  {
    label: "Dashboard",
    linkTo: "/dashboard",
    icon: "bi bi-house-door",
  },
  {
    label: "Classes",
    linkTo: "#",
    icon: "bi bi-journals",
    chevron: "bi bi-chevron-down",
    children: [
      { label: "Today", linkTo: "/todayschedule", icon: "bi bi-calendar-day" },
      { label: "Time Table", linkTo: "/timetable", icon: "bi bi-table" },
    ],
  },
  {
    label: "Statistics",
    linkTo: "#",
    icon: "bi bi-bar-chart-line",
    chevron: "bi bi-chevron-down",
    children: [
      { label: "Performance", linkTo: "/performance", icon: "bi bi-graph-up" },
      {
        label: "Courses",
        linkTo: "/course_progress",
        icon: "bi bi-flag",
      },
      {
        label: "Attendance",
        linkTo: "/attendance",
        icon: "bi bi-check2-circle",
      },
    ],
  },
  {
    label: "Resources",
    linkTo: "#",
    icon: "bi bi-box",
    chevron: "bi bi-chevron-down",
    children: [
      { label: "Subjects", linkTo: "/courses", icon: "bi bi-book" },
      {
        label: "Assignments",
        linkTo: "/assignments",
        icon: "bi bi-pencil-square",
      },
      { label: "Answers", linkTo: "/answers", icon: "bi bi-check-square" },
    ],
  },
  {
    label: "Members",
    linkTo: "#",
    icon: "bi bi-people",
    chevron: "bi bi-chevron-down",
    children: [
      { label: "Students", linkTo: "/students", icon: "bi bi-person" },
      { label: "Teachers", linkTo: "/teachers", icon: "bi bi-person-badge" },
    ],
  },
  {
    label: "Calendar",
    linkTo: "#",
    icon: "bi bi-calendar",
    chevron: "bi bi-chevron-down",
    children: [
      {
        label: "Assignments",
        linkTo: "/timetable_assignments",
        icon: "bi bi-clipboard-check",
      },
      {
        label: "Exams",
        linkTo: "/timetable_exams",
        icon: "bi bi-journal-check",
      },
      {
        label: "Meetings",
        linkTo: "/meetings",
        icon: "bi bi-chat-dots",
      },
    ],
  },
];
export default dropdown;
