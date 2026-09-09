'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { apiFetch } from '@/lib/api-client';
import {
  GraduationCap,
  Plus,
  Compass,
  Hash,
  Volume2,
  Radio,
  BookOpen,
  Award,
  Users,
  LogOut,
  Sparkles,
  Settings,
} from 'lucide-react';

interface ClassroomItem {
  id: string;
  name: string;
  courseCode: string;
  joinCode: string;
  role: string;
}

interface ChannelItem {
  id: string;
  name: string;
  type: string;
  categoryName?: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [classrooms, setClassrooms] = useState<ClassroomItem[]>([]);
  const [activeClassroom, setActiveClassroom] = useState<ClassroomItem | null>(null);
  const [channels, setChannels] = useState<ChannelItem[]>([]);

  // Parse current classroom ID from route: /classrooms/[id]/...
  const match = pathname.match(/\/classrooms\/([^\/]+)/);
  const currentClassroomId = match ? match[1] : null;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadClassrooms();
    }
  }, [user]);

  useEffect(() => {
    if (currentClassroomId && classrooms.length > 0) {
      const cls = classrooms.find((c) => c.id === currentClassroomId);
      if (cls) {
        setActiveClassroom(cls);
        loadChannels(cls.id);
      }
    } else {
      setActiveClassroom(null);
      setChannels([]);
    }
  }, [currentClassroomId, classrooms]);

  const loadClassrooms = async () => {
    try {
      const data = await apiFetch<ClassroomItem[]>('/classrooms');
      setClassrooms(data || []);
    } catch (e) {
      console.error('Failed to load classrooms', e);
    }
  };

  const loadChannels = async (classroomId: string) => {
    try {
      const data = await apiFetch<ChannelItem[]>(`/classrooms/${classroomId}/channels`);
      setChannels(data || []);
    } catch (e) {
      console.error('Failed to load channels', e);
    }
  };

  if (loading || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1e1f22]">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#313338] text-gray-200 overflow-hidden font-sans">
      {/* 1. LEFT RAIL (Icon Strip) */}
      <aside className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 select-none flex-shrink-0 z-20 space-y-2">
        {/* Home / Discovery Button */}
        <Link
          href="/"
          className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center transition-all duration-200 group relative ${
            pathname === '/' ? 'rounded-[16px] bg-brand-600 text-white' : 'bg-[#313338] hover:bg-brand-600 text-gray-300 hover:text-white'
          }`}
          title="Classroom Overview"
        >
          <GraduationCap className="w-6 h-6" />
          {pathname === '/' && (
            <span className="absolute left-0 w-1 h-10 bg-white rounded-r-full -translate-x-3" />
          )}
        </Link>

        <div className="w-8 h-[2px] bg-gray-700/50 rounded my-1" />

        {/* Classroom Server Badges */}
        <div className="flex-1 w-full overflow-y-auto space-y-2 px-3 no-scrollbar">
          {classrooms.map((c) => {
            const isActive = currentClassroomId === c.id;
            const initials = c.courseCode.slice(0, 3).toUpperCase();

            return (
              <Link
                key={c.id}
                href={`/classrooms/${c.id}/channels/${channels[0]?.id || ''}`}
                className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center transition-all duration-200 relative font-bold text-sm tracking-wider ${
                  isActive
                    ? 'rounded-[16px] bg-brand-600 text-white'
                    : 'bg-[#313338] hover:bg-brand-600 text-gray-300 hover:text-white'
                }`}
                title={c.name}
              >
                {initials}
                {isActive && (
                  <span className="absolute left-0 w-1 h-10 bg-white rounded-r-full -translate-x-3" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Plus / Add Classroom */}
        <Link
          href="/"
          className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all duration-200"
          title="Create or Join Course"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </aside>

      {/* 2. SUB-SIDEBAR (Channel Tree & Academic Navigation) */}
      {activeClassroom ? (
        <nav className="w-60 bg-[#2b2d31] flex flex-col flex-shrink-0 select-none z-10 border-r border-[#1f2023]">
          {/* Header Banner */}
          <div className="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between font-bold text-white shadow-sm">
            <span className="truncate text-[15px]">{activeClassroom.name}</span>
            <span className="text-[10px] bg-brand-600/30 text-brand-400 px-2 py-0.5 rounded font-mono">
              {activeClassroom.courseCode}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {/* Academic Section */}
            <div>
              <div className="px-2 mb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Academic Hub
              </div>
              <Link
                href={`/classrooms/${activeClassroom.id}/assignments`}
                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname.includes('/assignments')
                    ? 'bg-[#35373c] text-white'
                    : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Classwork & Tasks</span>
              </Link>
              <Link
                href={`/classrooms/${activeClassroom.id}/grades`}
                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname.includes('/grades')
                    ? 'bg-[#35373c] text-white'
                    : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Gradebook</span>
              </Link>
            </div>

            {/* Channels Tree */}
            <div>
              <div className="px-2 mb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Communication Channels
              </div>
              <div className="space-y-0.5">
                {channels.map((ch) => {
                  const isChActive = pathname.includes(`/channels/${ch.id}`);
                  let Icon = Hash;
                  if (ch.type === 'VOICE') Icon = Volume2;
                  if (ch.type === 'STAGE') Icon = Radio;

                  return (
                    <Link
                      key={ch.id}
                      href={`/classrooms/${activeClassroom.id}/channels/${ch.id}`}
                      className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isChActive
                          ? 'bg-[#35373c] text-white'
                          : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{ch.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Join Code Display */}
            <div className="p-3 bg-[#1e1f22]/60 rounded-xl border border-gray-800 text-xs">
              <div className="text-gray-400 mb-1">Course Join Code</div>
              <div className="font-mono font-bold text-brand-400 tracking-wider text-sm">
                {activeClassroom.joinCode}
              </div>
            </div>
          </div>

          {/* User Status Bar */}
          <div className="h-14 bg-[#232428] px-3 flex items-center justify-between border-t border-[#1f2023]">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-xs relative flex-shrink-0">
                {user.displayName.charAt(0).toUpperCase()}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#232428]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.displayName}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider">{activeClassroom.role}</div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </nav>
      ) : null}

      {/* 3. MAIN APP CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#313338]">
        {children}
      </main>
    </div>
  );
}
