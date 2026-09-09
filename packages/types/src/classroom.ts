export type ClassroomRole = 'TEACHER' | 'TA' | 'STUDENT' | 'OBSERVER';

export type ChannelType = 'TEXT' | 'VOICE' | 'ANNOUNCEMENT' | 'STAGE';

export interface Classroom {
  id: string;
  institutionId: string;
  termId?: string;
  name: string;
  courseCode: string;
  joinCode: string;
  syllabus?: string;
  archived: boolean;
  createdAt: string;
}

export interface Channel {
  id: string;
  classroomId: string;
  categoryId?: string;
  name: string;
  type: ChannelType;
  position: number;
  createdAt: string;
}

export interface ChannelCategory {
  id: string;
  classroomId: string;
  name: string;
  position: number;
}
