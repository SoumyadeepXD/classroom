'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import {
  BookOpen,
  Plus,
  Calendar,
  Award,
  ChevronRight,
  Clock,
  X,
} from 'lucide-react';

interface Assignment {
  id: string;
  classroomId: string;
  title: string;
  description?: string;
  dueDate: string;
  maxPoints: number;
}

export default function ClassworkAssignmentsPage() {
  const { classroomId } = useParams<{ classroomId: string }>();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxPoints, setMaxPoints] = useState('100');
  const [modalError, setModalError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (classroomId) {
      loadAssignments();
    }
  }, [classroomId]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Assignment[]>(`/classrooms/${classroomId}/assignments`);
      setAssignments(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setCreating(true);

    try {
      const isoDueDate = new Date(dueDate).toISOString();
      await apiFetch(`/classrooms/${classroomId}/assignments`, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          dueDate: isoDueDate,
          maxPoints: parseFloat(maxPoints),
        }),
      });

      setShowModal(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      setMaxPoints('100');
      await loadAssignments();
    } catch (err: any) {
      setModalError(err.message || 'Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto p-8 bg-[#313338]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-emerald-400" />
            Classwork & Assignments
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Access course projects, submission deadlines, and rubric evaluations.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError('');
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-emerald-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Assignments List */}
      <div className="mt-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-20 bg-[#2b2d31]/50 rounded-2xl border border-gray-800 p-8 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No assignments posted yet</h3>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Instructors have not assigned any tasks or homework for this course yet.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl text-sm font-medium"
            >
              Post First Assignment
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {assignments.map((asgn) => {
              const due = new Date(asgn.dueDate);
              const isOverdue = due.getTime() < Date.now();

              return (
                <Link
                  key={asgn.id}
                  href={`/classrooms/${classroomId}/assignments/${asgn.id}`}
                  className="group bg-[#2b2d31] hover:bg-[#35373c] rounded-2xl p-5 border border-gray-800 hover:border-emerald-500/40 transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {asgn.title}
                      </h3>
                      {asgn.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {asgn.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          <span className={isOverdue ? 'text-rose-400 font-semibold' : ''}>
                            Due {due.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 font-medium text-amber-400">
                          <Award className="w-3.5 h-3.5" />
                          <span>{asgn.maxPoints} pts</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2b2d31] rounded-2xl border border-gray-800 max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Create New Assignment</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lab 2: File System Inode Traversal"
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Instructions & Requirements
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed guidelines, test cases, and deliverable specs..."
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                    Due Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                    Maximum Points
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="1000"
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(e.target.value)}
                    className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium shadow-md shadow-emerald-600/30 disabled:opacity-50"
                >
                  {creating ? 'Publishing...' : 'Publish Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
