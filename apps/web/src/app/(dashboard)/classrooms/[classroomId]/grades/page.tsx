'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import {
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  FileCheck,
  ChevronRight,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ClassroomItem {
  id: string;
  name: string;
  courseCode: string;
  role: string;
}

interface TeacherGradeItem {
  id: string;
  submissionId: string;
  score: number;
  privateFeedback?: string;
  released: boolean;
  gradedAt: string;
}

interface StudentGradeItem {
  assignmentId: string;
  title: string;
  dueDate?: string;
  maxPoints: number;
  status: string; // ASSIGNED, SUBMITTED, LATE, GRADED, MISSING
  submissionId?: string;
  submittedAt?: string;
  receiptCode?: string;
  score?: number;
  feedback?: string;
}

export default function GradebookPage() {
  const { classroomId } = useParams<{ classroomId: string }>();

  const [userRole, setUserRole] = useState<string>('STUDENT');
  const [teacherGrades, setTeacherGrades] = useState<TeacherGradeItem[]>([]);
  const [studentGrades, setStudentGrades] = useState<StudentGradeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (classroomId) {
      loadGradeData();
    }
  }, [classroomId]);

  const loadGradeData = async () => {
    try {
      setLoading(true);
      setError('');

      const cls = await apiFetch<ClassroomItem>(`/classrooms/${classroomId}`);
      if (cls) {
        setUserRole(cls.role);

        if (cls.role === 'TEACHER' || cls.role === 'TA') {
          const data = await apiFetch<TeacherGradeItem[]>(`/classrooms/${classroomId}/gradebook`);
          setTeacherGrades(data || []);
        } else {
          // Student personal report card
          const data = await apiFetch<StudentGradeItem[]>(`/classrooms/${classroomId}/grades/me`);
          setStudentGrades(data || []);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load grade records');
    } finally {
      setLoading(false);
    }
  };

  const isInstructor = userRole === 'TEACHER' || userRole === 'TA';

  // Calculate Student Metrics
  const gradedAssignments = studentGrades.filter((g) => g.score !== null && g.score !== undefined);
  const totalPointsEarned = gradedAssignments.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const totalPointsPossible = gradedAssignments.reduce((acc, curr) => acc + curr.maxPoints, 0);
  const gradePercentage =
    totalPointsPossible > 0
      ? ((totalPointsEarned / totalPointsPossible) * 100).toFixed(1)
      : null;

  return (
    <div className="h-full flex flex-col overflow-y-auto p-8 bg-[#313338]">
      {/* Header */}
      <div className="pb-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Award className="w-7 h-7 text-amber-400" />
          {isInstructor ? 'Course Gradebook Matrix' : 'View Your Work (Academic Report Card)'}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {isInstructor
            ? 'Review evaluated student submissions, score distributions, and private feedback.'
            : 'Track your personal grades, completion rates, submission receipts, and faculty feedback.'}
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading grade records...</div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-white mb-1">Failed to Load</h3>
            <p className="text-xs text-rose-300">{error}</p>
          </div>
        ) : !isInstructor ? (
          /* ========================================= */
          /* STUDENT "VIEW YOUR WORK" REPORT CARD      */
          /* ========================================= */
          <div className="space-y-6 max-w-5xl">
            {/* Student Grade Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#2b2d31] p-5 rounded-2xl border border-gray-800 flex flex-col justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Overall Course Grade
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-amber-400">
                    {gradePercentage ? `${gradePercentage}%` : 'N/A'}
                  </span>
                  {gradePercentage && (
                    <span className="text-xs text-gray-400">
                      ({totalPointsEarned} / {totalPointsPossible} pts)
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-[#2b2d31] p-5 rounded-2xl border border-gray-800 flex flex-col justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Graded Deliverables
                </span>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-emerald-400">
                    {gradedAssignments.length}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">of {studentGrades.length} tasks</span>
                </div>
              </div>

              <div className="bg-[#2b2d31] p-5 rounded-2xl border border-gray-800 flex flex-col justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Pending / In-Progress
                </span>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-brand-400">
                    {studentGrades.length - gradedAssignments.length}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">tasks</span>
                </div>
              </div>
            </div>

            {/* Assignments Breakdown List */}
            {studentGrades.length === 0 ? (
              <div className="text-center py-20 bg-[#2b2d31]/50 rounded-2xl border border-gray-800 p-8 max-w-lg mx-auto">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white">No coursework assigned yet</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Once your instructors publish assignments, your personal report card will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-[#2b2d31] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-[#1e1f22] text-xs uppercase font-semibold text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="py-3.5 px-5">Assignment</th>
                      <th className="py-3.5 px-4">Due Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Score</th>
                      <th className="py-3.5 px-5">Faculty Feedback</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {studentGrades.map((item) => {
                      const isGraded = item.score !== null && item.score !== undefined;
                      const isSubmitted = item.status === 'SUBMITTED' || item.status === 'LATE' || item.status === 'GRADED';
                      const isMissing = item.status === 'MISSING';

                      return (
                        <tr key={item.assignmentId} className="hover:bg-[#35373c] transition-colors">
                          <td className="py-4 px-5">
                            <div className="font-bold text-white">{item.title}</div>
                            {item.receiptCode && (
                              <div className="text-[11px] font-mono text-emerald-400/80 mt-0.5">
                                Receipt: {item.receiptCode}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs text-gray-400">
                            {item.dueDate
                              ? new Date(item.dueDate).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'No Due Date'}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                                isGraded
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : isSubmitted
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : isMissing
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : 'bg-brand-500/20 text-brand-300'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {isGraded ? (
                              <span className="font-bold text-white text-base">
                                {item.score}{' '}
                                <span className="text-xs text-gray-400 font-normal">
                                  / {item.maxPoints}
                                </span>
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">— / {item.maxPoints}</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-xs text-gray-300 italic max-w-xs truncate">
                            {item.feedback ? `"${item.feedback}"` : '—'}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Link
                              href={`/classrooms/${classroomId}/assignments/${item.assignmentId}`}
                              className="text-xs font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1"
                            >
                              <span>View</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* ========================================= */
          /* TEACHER GRADEBOOK MATRIX                  */
          /* ========================================= */
          teacherGrades.length === 0 ? (
            <div className="text-center py-20 bg-[#2b2d31]/50 rounded-2xl border border-gray-800 p-8 max-w-lg mx-auto">
              <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white">No grades recorded yet</h3>
              <p className="text-sm text-gray-400 mt-1">
                Once student submissions are graded, they will appear here in the gradebook.
              </p>
            </div>
          ) : (
            <div className="bg-[#2b2d31] rounded-2xl border border-gray-800 overflow-hidden shadow-xl max-w-5xl">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-[#1e1f22] text-xs uppercase font-semibold text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="py-3.5 px-4">Submission Reference</th>
                    <th className="py-3.5 px-4">Awarded Score</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Private Feedback</th>
                    <th className="py-3.5 px-4">Date Graded</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {teacherGrades.map((gr) => (
                    <tr key={gr.id} className="hover:bg-[#35373c] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-brand-400">
                        {gr.submissionId.slice(0, 8)}...
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white text-base">
                        {gr.score}
                      </td>
                      <td className="py-3.5 px-4">
                        {gr.released ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Released
                          </span>
                        ) : (
                          <span className="text-xs text-amber-400 font-medium">Draft</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-400 max-w-xs truncate">
                        {gr.privateFeedback || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500">
                        {new Date(gr.gradedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
