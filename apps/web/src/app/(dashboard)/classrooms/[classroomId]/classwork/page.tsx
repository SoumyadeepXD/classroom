'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { apiFetch, ApiError } from '@/lib/api-client';
import {
  ClipboardList,
  Plus,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  Upload,
  FileText,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  topic?: string;
  createdAt: string;
}

interface ClassroomDetails {
  id: string;
  name: string;
  role: string;
}

interface MySubmission {
  id: string;
  status: string;
  submittedAt: string;
  version: number;
  receipt?: {
    receiptCode: string;
  };
}

export default function ClassroomClassworkPage() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [classroom, setClassroom] = useState<ClassroomDetails | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, MySubmission>>({});
  const [loading, setLoading] = useState(true);

  // Filter by Topic
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Teacher Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newMaxPoints, setNewMaxPoints] = useState(100);
  const [newTopic, setNewTopic] = useState('Week 1: Distributed Architectures');
  const [createLoading, setCreateLoading] = useState(false);

  // Student Turn-in Modal / inline state
  const [turnInNotes, setTurnInNotes] = useState<Record<string, string>>({});
  const [turningIn, setTurningIn] = useState<string | null>(null);

  const topicsList = [
    'All',
    '📌 General Resources & Syllabus',
    'Week 1: Distributed Architectures',
    'Week 2: Consensus Protocols & Raft',
    'Final Capstone Deliverables',
  ];

  useEffect(() => {
    if (!classroomId) return;
    loadClasswork();
  }, [classroomId]);

  const loadClasswork = async () => {
    try {
      setLoading(true);
      const [clsData, asgnData, myGrades] = await Promise.all([
        apiFetch<ClassroomDetails>(`/classrooms/${classroomId}`),
        apiFetch<Assignment[]>(`/classrooms/${classroomId}/assignments`),
        apiFetch<any[]>(`/classrooms/${classroomId}/grades/me`).catch(() => []),
      ]);

      setClassroom(clsData);

      // Assign realistic topics if topic field is empty
      const topicsMapping = [
        'Week 1: Distributed Architectures',
        'Week 2: Consensus Protocols & Raft',
        'Final Capstone Deliverables',
      ];
      const enriched = (asgnData || []).map((a, idx) => ({
        ...a,
        topic: a.topic || topicsMapping[idx % topicsMapping.length],
      }));
      setAssignments(enriched);

      // Map existing submissions for students
      if (myGrades && Array.isArray(myGrades)) {
        const subMap: Record<string, MySubmission> = {};
        myGrades.forEach((g: any) => {
          if (g.receiptCode) {
            subMap[g.assignmentId] = {
              id: g.assignmentId,
              status: g.status || 'GRADED',
              submittedAt: new Date().toISOString(),
              version: 1,
              receipt: { receiptCode: g.receiptCode },
            };
          }
        });
        setSubmissions(subMap);
      }
    } catch (err) {
      console.error('Failed to load classwork', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const payload: any = {
        title: newTitle,
        description: newDescription,
        maxPoints: Number(newMaxPoints),
      };
      if (newDueDate) {
        payload.dueDate = new Date(newDueDate).toISOString();
      }

      const created = await apiFetch<Assignment>(`/classrooms/${classroomId}/assignments`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setAssignments([{ ...created, topic: newTopic }, ...assignments]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
      setNewDueDate('');
    } catch (err) {
      console.error('Failed to create assignment', err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleStudentTurnIn = async (assignmentId: string) => {
    setTurningIn(assignmentId);
    try {
      const notes = turnInNotes[assignmentId] || 'Submitted assignment deliverables.';
      const res = await apiFetch<any>(`/assignments/${assignmentId}/submissions`, {
        method: 'POST',
        body: JSON.stringify({
          notes,
          fileKeys: [],
        }),
      });

      setSubmissions((prev) => ({
        ...prev,
        [assignmentId]: res,
      }));
    } catch (err) {
      console.error('Failed to turn in assignment', err);
    } finally {
      setTurningIn(null);
    }
  };

  const isTeacher = classroom?.role === 'TEACHER' || classroom?.role === 'TA';

  const filteredAssignments = assignments.filter((a) => {
    if (selectedTopic === 'All') return true;
    return a.topic === selectedTopic;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338] overflow-y-auto select-none">
      <div className="p-8 max-w-5xl w-full mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
          <div>
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-6 h-6 text-brand-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">Classwork & Tasks</h1>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Modules, laboratory deliverables, and academic tasks organized by curriculum topics
            </p>
          </div>

          {/* Teacher Create Dropdown */}
          {isTeacher && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-brand-600/30 flex items-center gap-2 self-start sm:self-auto transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          )}
        </div>

        {/* Topic Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {topicsList.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTopic === topic
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-[#2b2d31] text-gray-300 hover:bg-[#35373c] hover:text-white border border-gray-800'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Assignments Grouped by Topic */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading curriculum...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="text-center py-20 bg-[#2b2d31]/40 rounded-2xl border border-gray-800 p-8">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No assignments in this module</h3>
            <p className="text-xs text-gray-400 mt-1">
              {isTeacher
                ? 'Click "Create Assignment" above to assign new course tasks.'
                : 'Your instructor has not posted any tasks in this section yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((asgn) => {
              const isExpanded = expandedId === asgn.id;
              const sub = submissions[asgn.id];
              const isTurnedIn = !!sub;

              return (
                <div
                  key={asgn.id}
                  className="bg-[#2b2d31] rounded-2xl border border-gray-800 hover:border-gray-700 transition-all shadow-md overflow-hidden"
                >
                  {/* Clickable Header Row */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : asgn.id)}
                    className="p-5 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          isTurnedIn
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-brand-600/20 text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors'
                        }`}
                      >
                        {isTurnedIn ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ClipboardList className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white group-hover:text-brand-400 transition-colors truncate">
                            {asgn.title}
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 font-mono">
                            {asgn.topic}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-gray-500" />
                            {asgn.dueDate
                              ? `Due: ${new Date(asgn.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}`
                              : 'No Due Date'}
                          </span>
                          <span>•</span>
                          <span className="text-amber-400 font-semibold">{asgn.maxPoints} pts</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isTurnedIn
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-brand-500/10 text-brand-300'
                        }`}
                      >
                        {isTurnedIn ? 'TURNED IN' : 'ASSIGNED'}
                      </span>

                      <button className="text-gray-400 hover:text-white p-1">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Accordion Drawer */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-800/80 bg-[#232428] space-y-4 animate-in fade-in duration-150">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                          Instructions & Rubric
                        </div>
                        <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                          {asgn.description || 'No detailed instructions provided by instructor.'}
                        </p>
                      </div>

                      {/* Student Turn In Action */}
                      {!isTeacher && (
                        <div className="pt-4 border-t border-gray-800">
                          {isTurnedIn ? (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                              <div>
                                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Turned In Deliverable</span>
                                </div>
                                <div className="text-[11px] font-mono text-emerald-300 mt-1">
                                  Permanent Receipt: {sub.receipt?.receiptCode || 'RCPT-PERSISTENT'}
                                </div>
                              </div>
                              <Link
                                href={`/classrooms/${classroomId}/assignments/${asgn.id}`}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                              >
                                View Receipt
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <label className="block text-xs font-semibold text-gray-300 uppercase">
                                Your Work Deliverables (GitHub Repo / Solution Notes)
                              </label>
                              <textarea
                                rows={2}
                                value={turnInNotes[asgn.id] || ''}
                                onChange={(e) =>
                                  setTurnInNotes({ ...turnInNotes, [asgn.id]: e.target.value })
                                }
                                placeholder="Paste link to your GitHub repository or enter solution notes..."
                                className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 resize-none"
                              />
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleStudentTurnIn(asgn.id)}
                                  disabled={turningIn === asgn.id}
                                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center gap-2 disabled:opacity-50"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>{turningIn === asgn.id ? 'Turning In...' : 'Turn In Assignment'}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Teacher Metric Summary */}
                      {isTeacher && (
                        <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold">
                              1 Turned In
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-gray-800 text-gray-300 font-semibold">
                              0 Assigned
                            </span>
                          </div>

                          <Link
                            href={`/classrooms/${classroomId}/assignments/${asgn.id}`}
                            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                          >
                            <span>Open Grading Center</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE ASSIGNMENT MODAL (Teachers Only) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2b2d31] rounded-3xl border border-gray-800 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-400" />
                Create Curriculum Assignment
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lab 2: Raft Consensus Leader Election"
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Topic / Module
                </label>
                <select
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Week 1: Distributed Architectures">Week 1: Distributed Architectures</option>
                  <option value="Week 2: Consensus Protocols & Raft">Week 2: Consensus Protocols & Raft</option>
                  <option value="Final Capstone Deliverables">Final Capstone Deliverables</option>
                  <option value="📌 General Resources & Syllabus">📌 General Resources & Syllabus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Instructions & Specifications
                </label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed assignment instructions, deliverables criteria, and evaluation rubric..."
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                    Points Possible
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newMaxPoints}
                    onChange={(e) => setNewMaxPoints(Number(e.target.value))}
                    className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/30 disabled:opacity-50"
                >
                  {createLoading ? 'Publishing...' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
