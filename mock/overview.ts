// Mock data for overview statistics
// Replace with real API: /api/v1/overview

export interface OverviewStats {
  totalUsers: number
  totalLecturers: number
  totalClasses: number
  totalTopics: number
  activeSemester: string
  systemStatus: "operational" | "maintenance" | "degraded"
  recentActivities: Activity[]
}

export interface Activity {
  ActivityID: string
  Type: string
  Description: string
  Timestamp: string
  UserID: string
}

export const mockOverviewStats: OverviewStats = {
  totalUsers: 4,
  totalLecturers: 2,
  totalClasses: 3,
  totalTopics: 2,
  activeSemester: "Spring 2024",
  systemStatus: "operational",
  recentActivities: [
    {
      ActivityID: "1",
      Type: "User Created",
      Description: "New user Alice Johnson created",
      Timestamp: "2024-01-04T10:30:00Z",
      UserID: "1",
    },
    {
      ActivityID: "2",
      Type: "Class Created",
      Description: "New class Data Structures created",
      Timestamp: "2024-06-01T09:00:00Z",
      UserID: "1",
    },
  ],
}
