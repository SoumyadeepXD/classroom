'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { apiFetch } from '@/lib/api-client';
import {
  Users,
  ShieldCheck,
  GraduationCap,
  Mail,
  UserPlus,
  Search,
  KeyRound,
  Check,
  Copy,
  X,
} from 'lucide-react';

interface Member {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  role: string;
  enrolledAt: string;
}

interface ClassroomDetails {
  id: string;
  name: string;
  joinCode: string;
  role: string;
}

export default function ClassroomPeoplePage() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { user } = useAuth();

  const [classroom, setClassroom] = useState<ClassroomDetails | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!classroomId) return;
    loadPeople();
  }, [classroomId]);

  const loadPeople = async () => {
    try {
      setLoading(true);
      const [clsData, rosterData] = await Promise.all([
        apiFetch<ClassroomDetails>(`/classrooms/${classroomId}`),
        apiFetch<Member[]>(`/classrooms/${classroomId}/roster`),
      ]);

      setClassroom(clsData);
      setMembers(rosterData || []);
    } catch (err) {
      console.error('Failed to load roster', err);
    } finally {
      setLoading(false);
    }
  };

  const instructors = members.filter((m) => m.role === 'TEACHER' || m.role === 'TA');
  const students = members.filter((m) => m.role === 'STUDENT');

  const filteredStudents = students.filter(
    (s) =>
      s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyCode = () => {
    if (!classroom?.joinCode) return;
    navigator.clipboard.writeText(classroom.joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const isTeacher = classroom?.role === 'TEACHER' || classroom?.role === 'TA';

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#313338] text-gray-400 space-y-3">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs">Loading course roster...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338] overflow-y-auto select-none">
      <div className="p-8 max-w-4xl w-full mx-auto space-y-10">
        {/* Header Title */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-400" />
              <span>People & Roster</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Active course faculty, teaching assistants, and enrolled students
            </p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-[#2b2d31] hover:bg-[#35373c] text-white rounded-xl text-xs font-semibold border border-gray-700 transition-colors flex items-center gap-2 shadow"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>Invite Classmates</span>
          </button>
        </div>

        {/* Teachers Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-brand-500">
            <h2 className="text-xl font-bold text-brand-400 flex items-center gap-2">
              <span>Teachers</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-mono">
                {instructors.length}
              </span>
            </h2>
          </div>

          <div className="divide-y divide-gray-800/80">
            {instructors.map((teacher) => (
              <div
                key={teacher.id}
                className="py-3.5 px-2 flex items-center justify-between hover:bg-[#2b2d31]/50 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow">
                    {teacher.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{teacher.displayName}</span>
                      <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                        {teacher.role}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">{teacher.email}</span>
                  </div>
                </div>

                <a
                  href={`mailto:${teacher.email}`}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#35373c] rounded-xl transition-colors"
                  title="Email Teacher"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Classmates Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-emerald-500">
            <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              <span>Classmates</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {students.length} students
              </span>
            </h2>

            {/* Search filter */}
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full bg-[#2b2d31] border border-gray-700 rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs">
              {searchQuery ? 'No students matched your search filter.' : 'No students enrolled yet.'}
            </div>
          ) : (
            <div className="divide-y divide-gray-800/80">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="py-3 px-2 flex items-center justify-between hover:bg-[#2b2d31]/50 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-xs shadow">
                      {student.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-200">
                        {student.displayName}
                      </div>
                      <span className="text-xs text-gray-500">{student.email}</span>
                    </div>
                  </div>

                  <span className="text-xs text-gray-500">
                    Enrolled {new Date(student.enrolledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2b2d31] rounded-3xl border border-gray-800 max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <KeyRound className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Invite Classmates</h3>
            <p className="text-xs text-gray-400">
              Students can join this course instantly by entering the 7-character join code on their dashboard.
            </p>

            <div className="bg-[#1e1f22] p-4 rounded-2xl border border-gray-700">
              <span className="font-mono text-3xl font-extrabold text-emerald-300 tracking-widest">
                {classroom?.joinCode}
              </span>
            </div>

            <button
              onClick={copyCode}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center justify-center gap-2"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
