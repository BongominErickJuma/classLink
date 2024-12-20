const platformNotifications = [
  {
    id: 1,
    title: "New message received",
    content: "User John Doe sent you a message",
    createdAt: new Date("2024-08-12 23:40:00"),
    icon: "bi bi-envelope",
    icon_color: "text-primary", // Bootstrap primary color (blue)
  },
  {
    id: 2,
    title: "Assignment due soon",
    content: "Your assignment for Math 101 is due tomorrow.",
    createdAt: new Date("2024-08-12 23:44:00"),
    icon: "bi bi-exclamation-circle",
    icon_color: "text-warning", // Bootstrap warning color (orange/yellow)
  },
  {
    id: 3,
    title: "New course added",
    content: "You have been enrolled in the course History 202.",
    createdAt: new Date("2024-08-12 23:20:00"),
    icon: "bi bi-journals",
    icon_color: "text-success", // Bootstrap success color (green)
  },
  {
    id: 4,
    title: "System update available",
    content: "A new system update is ready to be installed.",
    createdAt: new Date("2024-08-12 23:00:00"),
    icon: "bi bi-arrow-up-circle",
    icon_color: "text-info", // Bootstrap info color (light blue)
  },
];

export default platformNotifications;
