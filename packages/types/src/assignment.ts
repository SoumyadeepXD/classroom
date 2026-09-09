export interface RubricCriterion {
  id: string;
  title: string;
  description?: string;
  maxPoints: number;
}

export interface Assignment {
  id: string;
  classroomId: string;
  title: string;
  description?: string;
  dueDate: string;
  lockDate?: string;
  maxPoints: number;
  rubricData: RubricCriterion[];
  createdAt: string;
}

export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'LATE' | 'GRADED';

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: SubmissionStatus;
  version: number;
  fileIds: string[];
  submittedAt: string;
}

export interface Grade {
  id: string;
  submissionId: string;
  gradedByUserId: string;
  score: number;
  rubricBreakdown: Record<string, number>;
  privateFeedback?: string;
  released: boolean;
  gradedAt: string;
}
