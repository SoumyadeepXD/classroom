'use client';

import React, { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { ShieldCheck, GraduationCap, Mail, MessageSquare, X, Check } from 'lucide-react';

interface Member {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  role: string;
  enrolledAt?: string;
}

interface DiscordMemberSidebarProps {
  classroomId: string;
  currentUserId?: string;
  onClose?: () => void;
}

export default function DiscordMemberSidebar({
  classroomId,
  currentUserId,
  onClose,
}: DiscordMemberSidebarProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (!classroomId) return;
    loadRoster();
  }, [classroomId]);

  const loadRoster = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Member[]>(`/classrooms/${classroomId}/roster`);
      setMembers(data || []);
    } catch (err) {
      console.error('Failed to load classroom roster', err);
    } finally {
      setLoading(false);
    }
  };

  const instructors = members.filter((m) => m.role === 'TEACHER' || m.role === 'TA');
  const students = members.filter((m) => m.role === 'STUDENT');

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <aside className="w-60 bg-[#2b2d31] border-l border-[#1f2023] flex flex-col h-full select-none relative flex-shrink-0">
      {/* Header */}
      <div className="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
        <span>Members — {members.length}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#35373c] rounded text-gray-400 hover:text-white transition-colors"
            title="Close Member List"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Member List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-xs text-gray-500">Loading members...</div>
        ) : (
          <>
            {/* Instructors Group */}
            {instructors.length > 0 && (
              <div>
                <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1 px-2">
                  Instructors — {instructors.length}
                </div>
                <div className="space-y-0.5">
                  {instructors.map((m) => {
                    const isMe = m.userId === currentUserId;
                    const initial = m.displayName.charAt(0).toUpperCase();

                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMember(m)}
                        className="w-full flex items-center space-x-2.5 px-2 py-1.5 rounded-lg hover:bg-[#35373c] transition-colors text-left group"
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow">
                            {initial}
                          </div>
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#2b2d31]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-amber-300 truncate">
                              {m.displayName}
                            </span>
                            <span className="px-1 py-0.2 bg-amber-500/20 text-amber-300 text-[9px] font-bold rounded">
                              STAFF
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 truncate">
                            {isMe ? 'You' : 'Office Hours Available'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Students Group */}
            <div>
              <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1 px-2">
                Online Students — {students.length}
              </div>
              <div className="space-y-0.5">
                {students.map((m) => {
                  const isMe = m.userId === currentUserId;
                  const initial = m.displayName.charAt(0).toUpperCase();

                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      className="w-full flex items-center space-x-2.5 px-2 py-1.5 rounded-lg hover:bg-[#35373c] transition-colors text-left group"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-xs shadow">
                          {initial}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#2b2d31]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-200 truncate group-hover:text-white">
                          {m.displayName}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">
                          {isMe ? 'You' : 'Student'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Member Profile Popover Card */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-80 bg-[#232428] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 animate-in fade-in zoom-in-95 duration-150">
            {/* Banner */}
            <div
              className={`h-20 w-full relative ${
                selectedMember.role === 'TEACHER'
                  ? 'bg-gradient-to-r from-amber-600 to-indigo-700'
                  : 'bg-gradient-to-r from-brand-600 to-emerald-600'
              }`}
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar & Content */}
            <div className="px-5 pb-5 relative">
              <div className="relative -mt-10 mb-3 inline-block">
                <div className="w-20 h-20 rounded-full bg-[#1e1f22] p-1 shadow-xl">
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                      selectedMember.role === 'TEACHER' ? 'bg-amber-600' : 'bg-brand-600'
                    }`}
                  >
                    {selectedMember.displayName.charAt(0).toUpperCase()}
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-[#232428]" />
              </div>

              <div className="bg-[#111214] p-3 rounded-xl border border-gray-800/80 mb-4">
                <h4 className="text-lg font-bold text-white leading-tight">
                  {selectedMember.displayName}
                </h4>
                <span className="text-xs text-gray-400 font-mono block mt-0.5">
                  {selectedMember.email}
                </span>

                <div className="mt-3 pt-3 border-t border-gray-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Roles
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                        selectedMember.role === 'TEACHER'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                      }`}
                    >
                      {selectedMember.role === 'TEACHER' ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                      )}
                      <span>{selectedMember.role}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 text-xs font-medium border border-gray-700">
                      Enrolled
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyEmail(selectedMember.email)}
                  className="flex-1 py-2 bg-[#2b2d31] hover:bg-[#35373c] text-white text-xs font-medium rounded-xl transition-colors border border-gray-700 flex items-center justify-center gap-1.5"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-brand-600/30"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
