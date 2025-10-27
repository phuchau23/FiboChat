// Thông tin hồ sơ người dùng
export interface ProfileData {
  fullName: string;
  username: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  dob: string;
  bio: string;
  status: "online" | "offline";
  avatarUrl: string;
  backgroundUrl: string;
}

// Hồ sơ giả lập
export const mockProfile: ProfileData = {
  fullName: "Nguyễn Văn A",
  username: "nguyenvana",
  email: "nguyenvana@example.com",
  emailVerified: true,
  phone: "+84 123 456 789",
  phoneVerified: true,
  dob: "1990-01-01",
  bio: "Đam mê công nghệ và phát triển phần mềm. Yêu thích học hỏi những điều mới mỗi ngày.",
  status: "online",
  avatarUrl: "/professional-avatar.png",
  backgroundUrl: "/abstract-gradient.png",
};

// === Thêm phần dữ liệu giả cho Class Members ===
export interface ClassMember {
  id: number;
  fullName: string;
  username: string;
  role: string;
  avatarUrl: string;
  status: "online" | "offline";
}

export const mockClassMembers: ClassMember[] = [
  {
    id: 1,
    fullName: "Trần Thị B",
    username: "tranthib",
    role: "Leader",
    avatarUrl: "/avatars/member1.png",
    status: "online",
  },
  {
    id: 2,
    fullName: "Lê Văn C",
    username: "levanc",
    role: "Member",
    avatarUrl: "/avatars/member2.png",
    status: "offline",
  },
  {
    id: 3,
    fullName: "Phạm Minh D",
    username: "phamminhd",
    role: "Member",
    avatarUrl: "/avatars/member3.png",
    status: "online",
  },
];

// export async function changePasswordApi(
//   currentPassword: string,
//   newPassword: string
// ): Promise<{ success: boolean; message: string }> {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       if (currentPassword === "123456") {
//         resolve({ success: true, message: "Đổi mật khẩu thành công!" });
//       } else {
//         resolve({ success: false, message: "Mật khẩu hiện tại không đúng." });
//       }
//     }, 1000);
//   });
// }

// // utils/profileService.ts
// import { ProfileData, ClassMember, mockProfile, mockClassMembers } from "./data";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND || "http://localhost:5094";

// // --- Lấy thông tin hồ sơ ---
// export async function fetchProfile(): Promise<ProfileData> {
//   // # API thật
//   // const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
//   //   method: "GET",
//   //   credentials: "include",
//   // });
//   // if (!res.ok) throw new Error("Lỗi khi tải hồ sơ");
//   // return await res.json();

//   // mock
//   return new Promise((resolve) => setTimeout(() => resolve(mockProfile), 600));
// }

// // --- Cập nhật hồ sơ (FormData) ---
// export async function updateProfile(data: Partial<ProfileData>): Promise<{ success: boolean; message: string }> {
//   const formData = new FormData();
//   for (const key in data) {
//     const value = (data as any)[key];
//     if (value !== undefined && value !== null) {
//       formData.append(key, value);
//     }
//   }

//   // # API thật
//   // const res = await fetch(`${API_BASE_URL}/api/profile/update`, {
//   //   method: "POST",
//   //   body: formData,
//   //   credentials: "include",
//   // });
//   // if (!res.ok) throw new Error("Cập nhật hồ sơ thất bại");
//   // return await res.json();

//   // mock
//   return new Promise((resolve) =>
//     setTimeout(() => resolve({ success: true, message: "Cập nhật hồ sơ thành công!" }), 800)
//   );
// }

// // --- Upload ảnh (FormData) ---
// export async function uploadImage(file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append("file", file);

//   // # API thật
//   // const res = await fetch(`${API_BASE_URL}/api/upload`, {
//   //   method: "POST",
//   //   body: formData,
//   //   credentials: "include",
//   // });
//   // if (!res.ok) throw new Error("Upload thất bại");
//   // const data = await res.json();
//   // return data.url;

//   // mock: convert to base64 để hiển thị
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result as string);
//     reader.readAsDataURL(file);
//   });
// }

// // --- Lấy danh sách thành viên lớp ---
// export async function fetchClassMembers(): Promise<ClassMember[]> {
//   // # API thật
//   // const res = await fetch(`${API_BASE_URL}/api/class/members`, { credentials: "include" });
//   // if (!res.ok) throw new Error("Không thể tải danh sách thành viên");
//   // return await res.json();

//   // mock
//   return new Promise((resolve) => setTimeout(() => resolve(mockClassMembers), 600));
// }

// // --- Đổi mật khẩu ---
// export async function changePassword(
//   currentPassword: string,
//   newPassword: string
// ): Promise<{ success: boolean; message: string }> {
//   const formData = new FormData();
//   formData.append("currentPassword", currentPassword);
//   formData.append("newPassword", newPassword);

//   // # API thật
//   // const res = await fetch(`${API_BASE_URL}/api/profile/change-password`, {
//   //   method: "POST",
//   //   body: formData,
//   //   credentials: "include",
//   // });
//   // if (!res.ok) throw new Error("Đổi mật khẩu thất bại");
//   // return await res.json();

//   // mock
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       if (currentPassword === "123456") resolve({ success: true, message: "Đổi mật khẩu thành công!" });
//       else resolve({ success: false, message: "Mật khẩu hiện tại không đúng." });
//     }, 800);
//   });
// }

// Dữ liệu mẫu cho dashboard lecturer
export const overviewData = {
  totalTopics: 12,
  totalClasses: 4,
  totalStudents: 120,
  totalReports: 5,
};

export interface Student {
  id: string;
  name: string;
  email: string;
}
export interface Class {
  id: string;
  name: string;
  students: Student[];
}
export const classes: Class[] = [
  {
    id: "c1",
    name: "CS101",
    students: [
      { id: "s1", name: "Nguyen Van A", email: "a@example.com" },
      { id: "s2", name: "Tran Thi B", email: "b@example.com" },
    ],
  },
  {
    id: "c2",
    name: "CS102",
    students: [{ id: "s3", name: "Le Van C", email: "c@example.com" }],
  },
];

export interface QAPair {
  key: string;
  answer: string;
  tag: string;
}
export const qaPairs: QAPair[] = [
  { key: "What is AI?", answer: "AI stands for Artificial Intelligence...", tag: "AI" },
  { key: "What is Cloud?", answer: "Cloud is a technology...", tag: "Cloud" },
];

export interface DocumentDetail {
  topicId: string;
  title: string;
  content: string;
}
export const documentDetails: DocumentDetail[] = [
  { topicId: "t1", title: "AI Overview", content: "Detailed info about AI..." },
  { topicId: "t4", title: "Cloud Basics", content: "Cloud introduction..." },
];

export interface StudentReport {
  studentName: string;
  topic: string;
  answer: string;
  status: "done" | "not yet";
  note?: string;
}
export const reports: StudentReport[] = [
  { studentName: "Nguyen Van A", topic: "AI Fundamentals", answer: "AI is...", status: "done", note: "Good answer" },
  { studentName: "Tran Thi B", topic: "Cloud Computing", answer: "Cloud is...", status: "not yet", note: "" },
];

export const reportedQAs = [{ key: "What is AI?", timesReported: 3, status: "auto" }];

export interface Feedback {
  studentName: string;
  answer: string;
  rating: number;
  comment?: string;
}
export const feedbacks: Feedback[] = [
  { studentName: "Nguyen Van A", answer: "AI is...", rating: 4, comment: "Clear explanation" },
];

export interface Tag {
  id: string;
  name: string;
}
export const tags: Tag[] = [
  { id: "tag1", name: "AI" },
  { id: "tag2", name: "Cloud" },
];

export interface ChatMessage {
  from: string;
  to: string;
  message: string;
  timestamp: string;
}
export const chatMessages: ChatMessage[] = [
  { from: "lecture1", to: "Nguyen Van A", message: "Bạn cần hỗ trợ gì không?", timestamp: "2025-10-15T08:00:00Z" },
];

export interface Topic {
  id: string;
  name: string;
  description: string;
  status: "active" | "pending" | "archived";
  context?: string;
  problem?: string;
  primaryActors?: string[];
  functionalRequirements?: string[];
}

export interface SuperTopic {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  superTopics: SuperTopic[];
}

export const domains: Domain[] = [
  {
    id: "d1",
    name: "SWP392 — Semester Fall 2025",
    description:
      "Danh sách các đề tài phát triển phần mềm cho môn SWP392. Các nhóm sẽ chọn 1 đề tài và thực hiện từ yêu cầu đến báo cáo cuối kỳ.",
    superTopics: [
      {
        id: "st1",
        name: "Health & Beauty Systems",
        description: "Các hệ thống liên quan đến chăm sóc sức khỏe, sắc đẹp, theo dõi sự phát triển.",
        topics: [
          {
            id: "t1",
            name: "Skincare Product Sales System",
            description:
              "Hệ thống quản lý bán hàng các sản phẩm chăm sóc da — từ xác định loại da, đề xuất sản phẩm đến quản lý đơn hàng.",
            status: "active",
            primaryActors: ["Guest", "Customer", "Staff", "Manager"],
            functionalRequirements: [
              "Trang chủ giới thiệu, blog, FAQ",
              "Trắc nghiệm loại da",
              "Đề xuất lộ trình chăm sóc",
              "So sánh sản phẩm",
              "Quản lý đơn hàng, thanh toán, khuyến mãi",
            ],
          },
          {
            id: "t2",
            name: "Skincare Booking System",
            description:
              "Phần mềm đặt dịch vụ chăm sóc da tại trung tâm — quản lý quy trình đặt, chỉ định chuyên viên, lịch làm việc.",
            status: "active",
            primaryActors: ["Guest", "Customer", "Skin Therapist", "Staff", "Manager"],
            functionalRequirements: [
              "Trắc nghiệm gợi ý dịch vụ",
              "Đặt dịch vụ + chọn chuyên viên",
              "Quy trình checkin - thực hiện - checkout",
              "Quản lý lịch làm việc, bảng giá",
            ],
          },
        ],
      },
      {
        id: "st2",
        name: "Family & Children Systems",
        description: "Các hệ thống phục vụ theo dõi phát triển thai kỳ, trẻ em, lịch tiêm chủng.",
        topics: [
          {
            id: "t3",
            name: "Pregnancy Growth Tracking System",
            description: "Theo dõi sự phát triển của thai nhi, biểu đồ tăng trưởng, nhắc lịch khám thai.",
            status: "pending",
            primaryActors: ["Guest", "Member", "Admin"],
          },
          {
            id: "t4",
            name: "Child Growth Tracking System",
            description: "Theo dõi tăng trưởng trẻ em, BMI, cảnh báo dinh dưỡng, chia sẻ dữ liệu với bác sĩ.",
            status: "active",
            primaryActors: ["Guest", "Member", "Doctor", "Admin"],
          },
          {
            id: "t5",
            name: "Child Vaccine Schedule Tracking System",
            description:
              "Quản lý & nhắc nhở lịch tiêm chủng cho trẻ em tại cơ sở y tế, hỗ trợ đặt lịch tiêm linh hoạt.",
            status: "active",
            primaryActors: ["Guest", "Customer", "Staff", "Admin"],
          },
        ],
      },
      {
        id: "st3",
        name: "Education & Mental Health",
        description: "Các hệ thống hỗ trợ giáo dục, tư vấn tiền hôn nhân, sức khỏe tâm lý học đường.",
        topics: [
          {
            id: "t6",
            name: "Pre-marital Counseling Platform",
            description: "Kết nối thành viên với chuyên gia tư vấn tiền hôn nhân, đặt lịch, đánh giá dịch vụ.",
            status: "archived",
            primaryActors: ["Guest", "Member", "Couples Therapist", "Admin"],
          },
          {
            id: "t7",
            name: "School Psychological Health Support System",
            description:
              "Hỗ trợ sức khỏe tâm lý học đường, khảo sát định kỳ, trắc nghiệm GAD-7, PHQ-9, đặt lịch với chuyên viên.",
            status: "active",
            primaryActors: ["Guest", "Student", "Parent", "Psychologist", "Manager"],
          },
        ],
      },
    ],
  },
];
