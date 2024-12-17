const dropdown = [
  {
    label: "Dashboard",
    linkTo: "/classLink/dashboard",
    icon: "bi bi-house-door",
  },
  {
    label: "Classes",
    linkTo: "#",
    icon: "bi bi-journals",
    chevron: "bi bi-chevron-down",
    children: [
      {
        label: "Today",
        linkTo: "/classLink/todayschedule",
        icon: "bi bi-calendar-day",
      },
      {
        label: "Time Table",
        linkTo: "/classLink/timetable",
        icon: "bi bi-table",
      },
    ],
  },
  {
    label: "Statistics",
    linkTo: "#",
    icon: "bi bi-bar-chart-line",
    chevron: "bi bi-chevron-down",
    children: [
      {
        label: "Performance",
        linkTo: "/classLink/performance",
        icon: "bi bi-graph-up",
      },
      {
        label: "Courses",
        linkTo: "/classLink/course_progress",
        icon: "bi bi-flag",
      },
      {
        label: "Attendance",
        linkTo: "/classLink/attendance",
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
      { label: "Subjects", linkTo: "/classLink/courses", icon: "bi bi-book" },
      {
        label: "Assignments",
        linkTo: "/classLink/assignments",
        icon: "bi bi-pencil-square",
      },
      {
        label: "Answers",
        linkTo: "/classLink/answers",
        icon: "bi bi-check-square",
      },
    ],
  },
  {
    label: "Members",
    linkTo: "#",
    icon: "bi bi-people",
    chevron: "bi bi-chevron-down",
    children: [
      {
        label: "Students",
        linkTo: "/classLink/students",
        icon: "bi bi-person",
      },
      {
        label: "Teachers",
        linkTo: "/classLink/teachers",
        icon: "bi bi-person-badge",
      },
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
        linkTo: "/classLink/timetable_assignments",
        icon: "bi bi-clipboard-check",
      },
      {
        label: "Exams",
        linkTo: "/classLink/timetable_exams",
        icon: "bi bi-journal-check",
      },
      {
        label: "Meetings",
        linkTo: "/classLink/meetings",
        icon: "bi bi-chat-dots",
      },
    ],
  },
];
export default dropdown;
