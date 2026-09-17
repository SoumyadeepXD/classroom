'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch, ApiError } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import {
  GraduationCap,
  Plus,
  KeyRound,
  BookOpen,
  Users,
  ChevronRight,
  Sparkles,
  X,
  LogOut,
} from 'lucide-react';

interface ClassroomItem {
  id: string;
  name: string;
  courseCode: string;
  joinCode: string;
  syllabus?: string;
  role: string;
  archived: boolean;
}

export default function DashboardHomePage() {
  const { user, logout } = useAuth();
  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Forms
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [modalError, setModalError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadClassrooms();
  }, []);

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<ClassroomItem[]>('/classrooms');
      setClassrooms(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setActionLoading(true);

    try {
      await apiFetch('/classrooms', {
        method: 'POST',
        body: JSON.stringify({ name: courseName, courseCode, syllabus }),
      });
      setShowCreateModal(false);
      setCourseName('');
      setCourseCode('');
      setSyllabus('');
      await loadClassrooms();
    } catch (err: any) {
      setModalError(err.message || 'Failed to create classroom');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setActionLoading(true);

    try {
      await apiFetch('/classrooms/join', {
        method: 'POST',
        body: JSON.stringify({ joinCode: joinCode.trim().toUpperCase() }),
      });
      setShowJoinModal(false);
      setJoinCode('');
      await loadClassrooms();
    } catch (err: any) {
      setModalError(err.message || 'Failed to join classroom');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto p-8">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-brand-500" />
            Your Academic Hub
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse your enrolled courses, participate in real-time discussions, and manage your assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-[#2b2d31] rounded-xl border border-gray-700/50 text-xs">
            <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-[11px]">
              {user?.displayName?.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-white truncate max-w-[140px]">{user?.displayName}</span>
          </div>

          <button
            onClick={() => {
              setModalError('');
              setShowJoinModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2b2d31] hover:bg-[#35373c] text-white rounded-xl text-sm font-medium transition-colors border border-gray-700/50"
          >
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Join with Code</span>
          </button>

          <button
            onClick={() => {
              setModalError('');
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-brand-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>

          <button
            onClick={logout}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-2.5 bg-[#2b2d31] hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded-xl text-sm font-medium transition-colors border border-gray-700/50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Classroom Cards Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading your courses...</div>
        ) : classrooms.length === 0 ? (
          <div className="text-center py-20 bg-[#2b2d31]/50 rounded-2xl border border-gray-800 p-8 max-w-lg mx-auto">
            <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No courses enrolled yet</h3>
            <p className="text-sm text-gray-400 mt-1 mb-6">
              Create a new course or use a 7-character join code from your teacher.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-4 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-xl text-sm font-medium"
              >
                Enter Join Code
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-brand-600 text-white hover:bg-brand-500 rounded-xl text-sm font-medium"
              >
                Create First Course
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((cls) => (
              <Link
                key={cls.id}
                href={`/classrooms/${cls.id}/stream`}
                className="group bg-[#2b2d31] hover:bg-[#35373c] border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all duration-200 shadow-md hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold bg-brand-600/20 text-brand-400 px-2.5 py-1 rounded-lg border border-brand-500/20">
                      {cls.courseCode}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        cls.role === 'TEACHER'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {cls.role}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                    {cls.name}
                  </h3>

                  {cls.syllabus && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {cls.syllabus}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1 font-mono">
                    <KeyRound className="w-3.5 h-3.5 text-gray-500" />
                    <span>Code: {cls.joinCode}</span>
                  </div>
                  <div className="flex items-center text-brand-400 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Enter</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CREATE COURSE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2b2d31] rounded-2xl border border-gray-800 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Create New Course</h3>
              <button
                onClick={() => setShowCreateModal(false)}
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

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Distributed Operating Systems"
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CS-401"
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Syllabus / Description
                </label>
                <textarea
                  rows={3}
                  value={syllabus}
                  onChange={(e) => setSyllabus(e.target.value)}
                  placeholder="Brief course overview and prerequisites..."
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium shadow-md shadow-brand-600/30 disabled:opacity-50"
                >
                  {actionLoading ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOIN COURSE MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2b2d31] rounded-2xl border border-gray-800 max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Join Course</h3>
              <button
                onClick={() => setShowJoinModal(false)}
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

            <form onSubmit={handleJoinCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  7-Character Course Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g. 7K4MZ9A"
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2.5 px-3 text-center font-mono text-lg tracking-widest text-brand-400 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium shadow-md shadow-brand-600/30 disabled:opacity-50"
                >
                  {actionLoading ? 'Joining...' : 'Join'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
