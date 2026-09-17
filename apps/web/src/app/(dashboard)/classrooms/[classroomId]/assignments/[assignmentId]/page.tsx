'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Award,
  CheckCircle2,
  FileText,
  Upload,
  UserCheck,
  Send,
  Users,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  maxPoints: number;
}

interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  status: string;
  version: number;
  submittedAt: string;
  receipt?: {
    receiptCode: string;
    issuedAt: string;
  };
}

interface Grade {
  score: number;
  privateFeedback?: string;
  released: boolean;
}

interface ClassroomItem {
  id: string;
  role: string;
}

export default function AssignmentDetailPage() {
  const { classroomId, assignmentId } = useParams<{ classroomId: string; assignmentId: string }>();
  const { user } = useAuth();

  const [userRole, setUserRole] = useState<string>('STUDENT');
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [mySubmission, setMySubmission] = useState<Submission | null>(null);
  const [myGrade, setMyGrade] = useState<Grade | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);

  // Turn-in state
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Grading state (for teachers)
  const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
  const [awardScore, setAwardScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gradingLoading, setGradingLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [assignmentId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cls, asgn] = await Promise.all([
        apiFetch<ClassroomItem>(`/classrooms/${classroomId}`).catch(() => null),
        apiFetch<Assignment>(`/assignments/${assignmentId}`),
      ]);

      if (cls) setUserRole(cls.role);
      setAssignment(asgn);

      const isTeacher = cls?.role === 'TEACHER' || cls?.role === 'TA';

      if (isTeacher) {
        // Teacher fetches all student submissions
        const all = await apiFetch<Submission[]>(`/assignments/${assignmentId}/submissions`).catch(() => []);
        setAllSubmissions(all || []);
      } else {
        // Student fetches own submission & grade
        const sub = await apiFetch<Submission>(`/assignments/${assignmentId}/submissions/me`).catch(() => null);
        setMySubmission(sub);

        if (sub && sub.status === 'GRADED') {
          const gr = await apiFetch<Grade>(`/submissions/${sub.id}/grades`).catch(() => null);
          setMyGrade(gr);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTurnIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch<Submission>(`/assignments/${assignmentId}/submissions`, {
        method: 'POST',
        body: JSON.stringify({ studentNotes: notes }),
      });
      setMySubmission(res);
      setNotes('');
    } catch (e: any) {
      alert(e.message || 'Failed to submit work');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmissionId) return;

    setGradingLoading(true);
    try {
      await apiFetch(`/submissions/${gradingSubmissionId}/grades`, {
        method: 'POST',
        body: JSON.stringify({
          totalScore: parseFloat(awardScore),
          privateFeedback: feedback,
          releaseImmediately: true,
        }),
      });
      setGradingSubmissionId(null);
      setAwardScore('');
      setFeedback('');
      await loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to grade submission');
    } finally {
      setGradingLoading(false);
    }
  };

  if (loading || !assignment) {
    return <div className="p-8 text-gray-500">Loading assignment details...</div>;
  }

  const isInstructor = userRole === 'TEACHER' || userRole === 'TA';
  const due = new Date(assignment.dueDate);
  const gradedCount = allSubmissions.filter((s) => s.status === 'GRADED').length;

  return (
    <div className="h-full flex flex-col overflow-y-auto p-8 bg-[#313338]">
      {/* Back link */}
      <Link
        href={`/classrooms/${classroomId}/classwork`}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Classwork</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        {/* Left Column: Assignment Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#2b2d31] rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{assignment.title}</h1>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 border-b border-gray-800 pb-4 mb-4">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span>Due {due.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <Award className="w-3.5 h-3.5" />
                <span>{assignment.maxPoints} Points Possible</span>
              </span>
            </div>

            <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
              {assignment.description || 'No detailed instructions provided.'}
            </div>
          </div>

          {/* Teacher Submissions Grading Center */}
          {isInstructor && (
            <div className="bg-[#2b2d31] rounded-2xl p-6 border border-gray-800 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-brand-400" />
                  Student Submissions ({allSubmissions.length})
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    {gradedCount} Graded
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                    {allSubmissions.length - gradedCount} Pending
                  </span>
                </div>
              </div>

              {allSubmissions.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  No students have turned in deliverables for this assignment yet.
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {allSubmissions.map((sub) => (
                    <div key={sub.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">{sub.studentName}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <span>Status:</span>
                          <span
                            className={`font-medium ${
                              sub.status === 'GRADED'
                                ? 'text-emerald-400'
                                : sub.status === 'LATE'
                                ? 'text-rose-400'
                                : 'text-brand-400'
                            }`}
                          >
                            {sub.status}
                          </span>
                          <span>• v{sub.version}</span>
                          {sub.receipt && (
                            <span className="font-mono text-[11px] text-gray-500">
                              [{sub.receipt.receiptCode}]
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setGradingSubmissionId(sub.id);
                          setAwardScore(assignment.maxPoints.toString());
                        }}
                        className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-medium transition-colors shadow-md shadow-brand-600/30"
                      >
                        {sub.status === 'GRADED' ? 'Edit Evaluation' : 'Grade Submission'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Student Turn-In or Teacher Overview */}
        <div className="space-y-6">
          {isInstructor ? (
            /* TEACHER OVERVIEW CARD */
            <div className="bg-[#2b2d31] rounded-2xl p-6 border border-gray-800 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                Instructor Dashboard
              </h2>

              <p className="text-xs text-gray-400">
                You are viewing this assignment as course faculty. Student submissions and grade releases are managed from here.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#1e1f22] p-3 rounded-xl border border-gray-800 text-center">
                  <span className="text-2xl font-bold text-white">{allSubmissions.length}</span>
                  <span className="block text-[11px] text-gray-400 uppercase mt-0.5">Turned In</span>
                </div>
                <div className="bg-[#1e1f22] p-3 rounded-xl border border-gray-800 text-center">
                  <span className="text-2xl font-bold text-emerald-400">{gradedCount}</span>
                  <span className="block text-[11px] text-gray-400 uppercase mt-0.5">Evaluated</span>
                </div>
              </div>
            </div>
          ) : (
            /* STUDENT TURN-IN CARD */
            <div className="bg-[#2b2d31] rounded-2xl p-6 border border-gray-800 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-3">Your Work</h2>

              {mySubmission ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Turned In (v{mySubmission.version})</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Submitted on {new Date(mySubmission.submittedAt).toLocaleString()}
                    </div>
                    {mySubmission.receipt && (
                      <div className="mt-2 pt-2 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-300">
                        Permanent Receipt: {mySubmission.receipt.receiptCode}
                      </div>
                    )}
                  </div>

                  {/* Graded Card */}
                  {myGrade && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-300 font-semibold uppercase">Grade Awarded</span>
                        <span className="text-lg font-bold text-amber-400">
                          {myGrade.score} / {assignment.maxPoints}
                        </span>
                      </div>
                      {myGrade.privateFeedback && (
                        <p className="text-xs text-gray-300 italic pt-1 border-t border-amber-500/20">
                          "{myGrade.privateFeedback}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleTurnIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                      Submission Notes / Solution Link
                    </label>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter solution details, GitHub repository link, or notes..."
                      className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : 'Turn In Assignment'}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GRADING MODAL (Instructors Only) */}
      {isInstructor && gradingSubmissionId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2b2d31] rounded-2xl border border-gray-800 max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Grade Student Work</h3>

            <form onSubmit={handleGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Awarded Score (out of {assignment.maxPoints})
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  min="0"
                  max={assignment.maxPoints}
                  value={awardScore}
                  onChange={(e) => setAwardScore(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Private Instructor Feedback
                </label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Constructive feedback for the student..."
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmissionId(null)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={gradingLoading}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium shadow-md shadow-brand-600/30 disabled:opacity-50"
                >
                  {gradingLoading ? 'Saving...' : 'Save & Release Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
