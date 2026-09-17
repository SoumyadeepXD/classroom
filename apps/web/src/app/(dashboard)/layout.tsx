'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { apiFetch } from '@/lib/api-client';
import UserSettingsModal from '@/components/user-settings-modal';
import {
  GraduationCap,
  Plus,
  Hash,
  Volume2,
  Radio,
  BookOpen,
  Award,
  Users,
  LogOut,
  Settings,
  Mic,
  MicOff,
  Headphones,
  VolumeX,
  PhoneOff,
  ChevronDown,
  ChevronRight,
  Megaphone,
  Sparkles,
  Layers,
  UserPlus,
  Bell,
  Check,
  Copy,
  X,
  Compass,
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

  // Discord UI States
  const [showSettings, setShowSettings] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // New Channel Form
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState('TEXT');
  const [channelCreating, setChannelCreating] = useState(false);

  // Audio Dock Quick Toggles
  const [micMuted, setMicMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const serverMenuRef = useRef<HTMLDivElement>(null);

  // Parse current classroom & channel from route
  const classroomMatch = pathname.match(/\/classrooms\/([^\/]+)/);
  const currentClassroomId = classroomMatch ? classroomMatch[1] : null;

  const channelMatch = pathname.match(/\/channels\/([^\/]+)/);
  const currentChannelId = channelMatch ? channelMatch[1] : null;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadClassrooms();
    }
  }, [user, pathname]);

  useEffect(() => {
    if (currentClassroomId) {
      const cls = classrooms.find((c) => c.id === currentClassroomId);
      if (cls) {
        setActiveClassroom(cls);
        loadChannels(cls.id);
      } else {
        apiFetch<ClassroomItem>(`/classrooms/${currentClassroomId}`)
          .then((fetched) => {
            if (fetched) {
              setActiveClassroom(fetched);
              loadChannels(fetched.id);
            }
          })
          .catch((e) => console.error('Error fetching active classroom', e));
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

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleCreateChannelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClassroom || !newChannelName.trim()) return;

    setChannelCreating(true);
    try {
      const formattedName = newChannelName.trim().toLowerCase().replace(/\s+/g, '-');
      const created = await apiFetch<ChannelItem>(
        `/classrooms/${activeClassroom.id}/channels`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: formattedName,
            type: newChannelType,
          }),
        }
      );

      setChannels((prev) => [...prev, created]);
      setShowCreateChannelModal(false);
      setNewChannelName('');
      router.push(`/classrooms/${activeClassroom.id}/channels/${created.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create channel');
    } finally {
      setChannelCreating(false);
    }
  };

  const copyInvite = () => {
    if (!activeClassroom?.joinCode) return;
    navigator.clipboard.writeText(activeClassroom.joinCode);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  // Find active voice/stage channel
  const activeVoiceChannel = channels.find(
    (ch) => ch.id === currentChannelId && (ch.type === 'VOICE' || ch.type === 'STAGE')
  );

  const handleDisconnectVoice = () => {
    if (activeClassroom) {
      const general = channels.find((c) => c.name === 'general') || channels[0];
      if (general) {
        router.push(`/classrooms/${activeClassroom.id}/channels/${general.id}`);
      } else {
        router.push(`/classrooms/${activeClassroom.id}/stream`);
      }
    }
  };

  if (loading || !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#1e1f22]">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const textChannels = channels.filter((ch) => ch.type === 'TEXT' || ch.type === 'ANNOUNCEMENT');
  const voiceChannels = channels.filter((ch) => ch.type === 'VOICE' || ch.type === 'STAGE');
  const isInstructor = activeClassroom?.role === 'TEACHER' || activeClassroom?.role === 'TA';

  return (
    <div className="flex h-screen w-screen bg-[#313338] text-gray-200 overflow-hidden font-sans select-none">
      {/* 1. DISCORD LEFT RAIL (72px Server Strip) */}
      <aside className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 select-none flex-shrink-0 z-30 space-y-2 border-r border-[#111214]">
        {/* Direct Messages / Overview Home */}
        <div className="relative group flex items-center justify-center w-full">
          <span
            className={`absolute left-0 bg-white rounded-r-full transition-all duration-200 ${
              pathname === '/' ? 'w-1 h-10' : 'w-1 h-2 opacity-0 group-hover:opacity-100 group-hover:h-5'
            }`}
          />
          <Link
            href="/"
            className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center transition-all duration-200 ${
              pathname === '/'
                ? 'rounded-[16px] bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'bg-[#313338] hover:bg-brand-600 text-gray-300 hover:text-white'
            }`}
            title="Classroom Overview"
          >
            <GraduationCap className="w-6 h-6" />
          </Link>
        </div>

        <div className="w-8 h-[2px] bg-gray-700/40 rounded-full my-1" />

        {/* Server Badges */}
        <div className="flex-1 w-full overflow-y-auto space-y-2 px-3 no-scrollbar">
          {classrooms.map((c) => {
            const isActive = currentClassroomId === c.id;
            const initials = c.courseCode.slice(0, 3).toUpperCase();

            return (
              <div key={c.id} className="relative group flex items-center justify-center w-full">
                <span
                  className={`absolute left-0 bg-white rounded-r-full transition-all duration-200 ${
                    isActive ? 'w-1 h-10' : 'w-1 h-2 opacity-0 group-hover:opacity-100 group-hover:h-5'
                  }`}
                />
                <Link
                  href={`/classrooms/${c.id}/stream`}
                  className={`w-12 h-12 rounded-[24px] hover:rounded-[16px] flex items-center justify-center transition-all duration-200 font-bold text-sm tracking-wider ${
                    isActive
                      ? 'rounded-[16px] bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                      : 'bg-[#313338] hover:bg-brand-600 text-gray-300 hover:text-white'
                  }`}
                  title={`${c.name} (${c.courseCode})`}
                >
                  {initials}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Add Course Button */}
        <div className="relative group flex items-center justify-center w-full">
          <Link
            href="/"
            className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all duration-200"
            title="Join or Create Course"
          >
            <Plus className="w-6 h-6" />
          </Link>
        </div>

        {/* Bottom Rail User Avatar & Sign Out */}
        <div className="pt-2 flex flex-col items-center space-y-2 border-t border-gray-800 w-full px-2 mt-auto">
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full bg-brand-600 hover:ring-2 hover:ring-brand-400 flex items-center justify-center font-bold text-white text-xs relative transition-all shadow"
            title="User Settings"
          >
            {user.displayName.charAt(0).toUpperCase()}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1e1f22]" />
          </button>
          <button
            onClick={logout}
            title="Sign Out"
            className="w-10 h-10 rounded-2xl hover:rounded-xl bg-[#2b2d31] hover:bg-rose-600/20 text-gray-400 hover:text-rose-400 flex items-center justify-center transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* 2. SUB-SIDEBAR (Channel Tree & Academic Workspace) */}
      {activeClassroom ? (
        <nav className="w-60 bg-[#2b2d31] flex flex-col flex-shrink-0 select-none z-20 border-r border-[#1f2023] relative">
          {/* Discord Server Header with Dropdown */}
          <div
            onClick={() => setShowServerMenu(!showServerMenu)}
            className="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between font-bold text-white shadow-sm cursor-pointer hover:bg-[#35373c]/50 transition-colors"
          >
            <span className="truncate text-sm font-bold">{activeClassroom.name}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-300 transition-transform ${
                showServerMenu ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Discord Server Dropdown Menu */}
          {showServerMenu && (
            <div
              ref={serverMenuRef}
              className="absolute left-2.5 top-14 w-56 bg-[#111214] rounded-xl shadow-2xl border border-gray-800 p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                onClick={() => {
                  setShowServerMenu(false);
                  setShowInviteModal(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-brand-400 hover:bg-brand-600 hover:text-white rounded-lg transition-colors"
              >
                <span>Invite People</span>
                <UserPlus className="w-4 h-4" />
              </button>

              {isInstructor && (
                <button
                  onClick={() => {
                    setShowServerMenu(false);
                    setShowCreateChannelModal(true);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-brand-600 hover:text-white rounded-lg transition-colors"
                >
                  <span>Create Channel</span>
                  <Plus className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  setShowServerMenu(false);
                  setShowSettings(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-[#35373c] hover:text-white rounded-lg transition-colors"
              >
                <span>Server Settings</span>
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Channel & Academic Tree */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {/* ACADEMICS CATEGORY */}
            <div>
              <button
                onClick={() => toggleCategory('classroom')}
                className="w-full flex items-center justify-between px-2 mb-1 text-[11px] font-bold text-gray-400 hover:text-gray-200 uppercase tracking-wider transition-colors group"
              >
                <span>📚 Academics</span>
                {collapsedCategories['classroom'] ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>

              {!collapsedCategories['classroom'] && (
                <div className="space-y-0.5">
                  <Link
                    href={`/classrooms/${activeClassroom.id}/stream`}
                    className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname.includes('/stream')
                        ? 'bg-[#35373c] text-white'
                        : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
                    }`}
                  >
                    <Megaphone className="w-4 h-4 text-brand-400" />
                    <span>Stream</span>
                  </Link>

                  <Link
                    href={`/classrooms/${activeClassroom.id}/classwork`}
                    className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname.includes('/classwork') || pathname.includes('/assignments')
                        ? 'bg-[#35373c] text-white'
                        : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Classwork</span>
                  </Link>

                  <Link
                    href={`/classrooms/${activeClassroom.id}/people`}
                    className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname.includes('/people')
                        ? 'bg-[#35373c] text-white'
                        : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
                    }`}
                  >
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>People</span>
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
                    <span>{activeClassroom.role === 'STUDENT' ? 'View Your Work' : 'Grades'}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* TEXT CHANNELS CATEGORY */}
            <div>
              <div className="flex items-center justify-between px-2 mb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider group">
                <button
                  onClick={() => toggleCategory('text')}
                  className="flex items-center gap-1 hover:text-gray-200 transition-colors"
                >
                  <span>💬 Text Channels</span>
                  {collapsedCategories['text'] ? (
                    <ChevronRight className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>

                {isInstructor && (
                  <button
                    onClick={() => {
                      setNewChannelType('TEXT');
                      setShowCreateChannelModal(true);
                    }}
                    className="p-1 hover:bg-[#35373c] rounded text-gray-400 hover:text-white"
                    title="Create Text Channel"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {!collapsedCategories['text'] && (
                <div className="space-y-0.5">
                  {textChannels.map((ch) => {
                    const isChActive = pathname.includes(`/channels/${ch.id}`);
                    const isAnnouncement = ch.type === 'ANNOUNCEMENT';

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
                        {isAnnouncement ? (
                          <Megaphone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        ) : (
                          <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="truncate">{ch.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* VOICE & STAGE CHANNELS CATEGORY */}
            <div>
              <div className="flex items-center justify-between px-2 mb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider group">
                <button
                  onClick={() => toggleCategory('voice')}
                  className="flex items-center gap-1 hover:text-gray-200 transition-colors"
                >
                  <span>🔊 Voice & Stages</span>
                  {collapsedCategories['voice'] ? (
                    <ChevronRight className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>

                {isInstructor && (
                  <button
                    onClick={() => {
                      setNewChannelType('VOICE');
                      setShowCreateChannelModal(true);
                    }}
                    className="p-1 hover:bg-[#35373c] rounded text-gray-400 hover:text-white"
                    title="Create Voice Channel"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {!collapsedCategories['voice'] && (
                <div className="space-y-0.5">
                  {voiceChannels.map((ch) => {
                    const isChActive = pathname.includes(`/channels/${ch.id}`);
                    const isStage = ch.type === 'STAGE';

                    return (
                      <Link
                        key={ch.id}
                        href={`/classrooms/${activeClassroom.id}/channels/${ch.id}`}
                        className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isChActive
                            ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                            : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
                        }`}
                      >
                        {isStage ? (
                          <Radio className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="truncate">{ch.name}</span>
                        {isChActive && (
                          <span className="ml-auto text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                            LIVE
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Course Join Code Banner */}
            <div className="p-3 bg-[#1e1f22]/70 rounded-2xl border border-gray-800/80 text-xs">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span>Class Join Code</span>
                <button
                  onClick={copyInvite}
                  className="hover:text-white"
                  title="Copy Join Code"
                >
                  {copiedInvite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="font-mono font-bold text-emerald-300 tracking-wider text-sm">
                {activeClassroom.joinCode}
              </div>
            </div>
          </div>

          {/* Voice Connected Box */}
          {activeVoiceChannel && (
            <div className="px-3 py-2 bg-[#232428] border-t border-[#1f2023] flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <Volume2 className="w-4 h-4 text-emerald-400 flex-shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-emerald-400 truncate">
                    Voice Connected
                  </div>
                  <div className="text-[10px] text-gray-400 truncate font-mono">
                    {activeVoiceChannel.name} / 24ms RTC
                  </div>
                </div>
              </div>
              <button
                onClick={handleDisconnectVoice}
                title="Disconnect from Room"
                className="p-1.5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 rounded-lg transition-colors"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Discord Bottom User Status Dock */}
          <div className="h-14 bg-[#232428] px-2.5 flex items-center justify-between border-t border-[#1f2023]">
            <div
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 min-w-0 hover:bg-[#2b2d31] p-1 rounded-lg cursor-pointer transition-colors max-w-[125px]"
              title="Click to Open User Settings"
            >
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-xs relative flex-shrink-0 shadow">
                {user.displayName.charAt(0).toUpperCase()}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#232428]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.displayName}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider truncate">
                  {activeClassroom.role}
                </div>
              </div>
            </div>

            {/* Mic / Deafen / Cog Buttons */}
            <div className="flex items-center space-x-0.5">
              <button
                onClick={() => setMicMuted(!micMuted)}
                title={micMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                className={`p-1.5 rounded-lg transition-colors ${
                  micMuted ? 'bg-rose-500/20 text-rose-400' : 'text-gray-400 hover:bg-[#35373c] hover:text-gray-200'
                }`}
              >
                {micMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  const next = !deafened;
                  setDeafened(next);
                  if (next) setMicMuted(true);
                }}
                title={deafened ? 'Undeafen Audio' : 'Deafen Audio'}
                className={`p-1.5 rounded-lg transition-colors ${
                  deafened ? 'bg-rose-500/20 text-rose-400' : 'text-gray-400 hover:bg-[#35373c] hover:text-gray-200'
                }`}
              >
                {deafened ? <VolumeX className="w-4 h-4" /> : <Headphones className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowSettings(true)}
                title="User Settings"
                className="p-1.5 text-gray-400 hover:bg-[#35373c] hover:text-white rounded-lg transition-colors group"
              >
                <Settings className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </button>
            </div>
          </div>
        </nav>
      ) : null}

      {/* 3. MAIN APP CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#313338]">
        {children}
      </main>

      {/* CREATE CHANNEL MODAL */}
      {showCreateChannelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[#2b2d31] rounded-3xl border border-gray-800 max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Create Channel</h3>
              <button
                onClick={() => setShowCreateChannelModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChannelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Channel Type
                </label>
                <select
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value)}
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="TEXT"># Text Discussion</option>
                  <option value="VOICE">🔊 Voice Room</option>
                  <option value="STAGE">📡 Live Stage</option>
                  <option value="ANNOUNCEMENT">📢 Official Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Channel Name
                </label>
                <input
                  type="text"
                  required
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g. lab-discussions"
                  className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateChannelModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={channelCreating || !newChannelName.trim()}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/30 disabled:opacity-50"
                >
                  {channelCreating ? 'Creating...' : 'Create Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVITE PEOPLE MODAL */}
      {showInviteModal && activeClassroom && (
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

            <UserPlus className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Invite to {activeClassroom.name}</h3>
            <p className="text-xs text-gray-400">
              Share the course join code with classmates or faculty for immediate enrollment.
            </p>

            <div className="bg-[#1e1f22] p-4 rounded-2xl border border-gray-700">
              <span className="font-mono text-3xl font-extrabold text-emerald-300 tracking-widest">
                {activeClassroom.joinCode}
              </span>
            </div>

            <button
              onClick={copyInvite}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/30 flex items-center justify-center gap-2"
            >
              {copiedInvite ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedInvite ? 'Code Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      )}

      {/* User Settings Modal */}
      <UserSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
