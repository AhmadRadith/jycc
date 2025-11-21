export type UserRole =
  | "pusat"
  | "daerah"
  | "sekolah"
  | "system"
  | "murid"
  | "mitra";

export type TicketStatus = "pending" | "escalated" | "resolved" | "open";

export interface TicketComment {
  id: number | string;
  author: string;
  role: UserRole;
  time: string;
  message: string;
}

export interface StudentReport {
  id: string;
  studentName: string;
  summary: string;
  time: number;
}

export interface Ticket {
  id: string;
  title: string;
  schoolName: string;
  category: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  created: string;
  description: string;
  assignedMitra: string[];
  comments: TicketComment[];
  studentReports: StudentReport[];
}

export interface Advice {
  summary: string;
  insights: string[];
  guidance: string;
  nextSteps: string[];
  draftReply: string;
  statusAdvice: string;
}
