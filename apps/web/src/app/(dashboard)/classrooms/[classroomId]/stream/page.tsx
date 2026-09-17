'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { apiFetch } from '@/lib/api-client';
import {
  Sparkles,
  KeyRound,
  Copy,
  Check,
  Send,
  Calendar,
  ChevronRight,
  Paperclip,
  GraduationCap,
  Maximize2,
  X,
} from 'lucide-react';

interface ClassroomDetails {
  id: string;
  name: string;
  courseCode: string;
  joinCode: string;
  syllabus?: string;
  role: string;
}

interface StreamPost {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  comments: Array<{
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }>;
}

interface UpcomingAssignment {
  id: string;
  title: string;
  dueDate?: string;
}

export default function ClassroomStreamPage() {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { user } = useAuth();

  const [classroom, setClassroom] = useState<ClassroomDetails | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  // Announcement Composer State
  const [announcementText, setAnnouncementText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [posting, setPosting] = useState(false);
  const [announcementChannelId, setAnnouncementChannelId] = useState<string | null>(null);

  // Stream Posts
  const [posts, setPosts] = useState<StreamPost[]>([]);
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState(false);
  const [showEnlargeCode, setShowEnlargeCode] = useState(false);

  useEffect(() => {
    if (!classroomId) return;
    loadClassroomData();
  }, [classroomId]);

  const loadClassroomData = async () => {
    try {
      setLoading(true);
      const [clsData, asgns, channels] = await Promise.all([
        apiFetch<ClassroomDetails>(`/classrooms/${classroomId}`),
        apiFetch<UpcomingAssignment[]>(`/classrooms/${classroomId}/assignments`),
        apiFetch<Array<{ id: string; name: string; type: string }>>(`/classrooms/${classroomId}/channels`).catch(() => []),
      ]);

      setClassroom(clsData);
      setUpcoming(asgns || []);

      const annChannel = channels?.find((c) => c.type === 'ANNOUNCEMENT' || c.name === 'announcements');
      if (annChannel) {
        setAnnouncementChannelId(annChannel.id);
        const msgs = await apiFetch<Array<{ id: string; author: { displayName: string }; content: string; createdAt: string; parentMessageId?: string }>>(`/channels/${annChannel.id}/messages?limit=50`).catch(() => []);

        if (msgs && msgs.length > 0) {
          const rootMsgs = msgs.filter((m) => !m.parentMessageId);
          const commentMsgs = msgs.filter((m) => !!m.parentMessageId);

          const mappedPosts: StreamPost[] = rootMsgs.map((rm) => ({
            id: rm.id,
            authorName: rm.author?.displayName || 'Faculty',
            authorRole: 'TEACHER',
            content: rm.content,
            createdAt: rm.createdAt,
            comments: commentMsgs
              .filter((cm) => cm.parentMessageId === rm.id)
              .map((cm) => ({
                id: cm.id,
                authorName: cm.author?.displayName || 'User',
                content: cm.content,
                createdAt: cm.createdAt,
              })),
          }));

          setPosts(mappedPosts);
          return;
        }
      }

      setPosts([
        {
          id: 'post-1',
          authorName: clsData?.name ? 'Course Faculty' : 'Instructor',
          authorRole: 'TEACHER',
          content: `Welcome to ${clsData?.name || 'the course'}! Please review the syllabus in Classwork, join our #general discussion channel, and reach out during office hours for any questions.`,
          createdAt: new Date().toISOString(),
          comments: [
            {
              id: 'c-1',
              authorName: 'Teaching Assistant',
              content: 'Office hours will be hosted weekly in the #office-hours voice lounge.',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      ]);
    } catch (err) {
      console.error('Failed to load stream data', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setPosting(true);

    try {
      if (announcementChannelId) {
        const saved = await apiFetch<any>(`/channels/${announcementChannelId}/messages`, {
          method: 'POST',
          body: JSON.stringify({ content: announcementText.trim() }),
        });
        const newPost: StreamPost = {
          id: saved.id,
          authorName: user?.displayName || 'Instructor',
          authorRole: classroom?.role || 'STUDENT',
          content: saved.content,
          createdAt: saved.createdAt || new Date().toISOString(),
          comments: [],
        };
        setPosts([newPost, ...posts]);
      } else {
        const newPost: StreamPost = {
          id: `post-${Date.now()}`,
          authorName: user?.displayName || 'Instructor',
          authorRole: classroom?.role || 'STUDENT',
          content: announcementText.trim(),
          createdAt: new Date().toISOString(),
          comments: [],
        };
        setPosts([newPost, ...posts]);
      }
      setAnnouncementText('');
      setIsComposing(false);
    } catch (err: any) {
      console.error('Failed to post announcement', err);
    } finally {
      setPosting(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = newComments[postId]?.trim();
    if (!text) return;

    try {
      let commId = `comm-${Date.now()}`;
      if (announcementChannelId && !postId.startsWith('post-')) {
        const saved = await apiFetch<any>(`/channels/${announcementChannelId}/messages`, {
          method: 'POST',
          body: JSON.stringify({
            content: text,
            parentMessageId: postId,
          }),
        }).catch(() => null);
        if (saved) commId = saved.id;
      }

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: commId,
                  authorName: user?.displayName || 'User',
                  content: text,
                  createdAt: new Date().toISOString(),
                },
              ],
            };
          }
          return post;
        })
      );

      setNewComments((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const copyJoinCode = () => {
    if (!classroom?.joinCode) return;
    navigator.clipboard.writeText(classroom.joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#313338] text-gray-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338] overflow-y-auto select-none">
      {/* Course Hero Banner */}
      <div className="p-6 max-w-5xl w-full mx-auto">
        <div className="w-full h-56 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-emerald-600 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="flex items-start justify-between z-10">
            <div>
              <span className="px-3 py-1 bg-black/30 backdrop-blur-md rounded-full text-xs font-mono font-semibold text-white/90 uppercase tracking-wider">
                {classroom?.courseCode || 'COURSE'}
              </span>
              <h1 className="text-3xl font-extrabold text-white mt-3 tracking-tight drop-shadow-md">
                {classroom?.name}
              </h1>
              {classroom?.syllabus && (
                <p className="text-sm text-white/80 mt-1 max-w-xl line-clamp-2 drop-shadow">
                  {classroom.syllabus}
                </p>
              )}
            </div>

            {/* Join Code Widget */}
            <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-3 shadow-lg">
              <div>
                <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider block">
                  Class Join Code
                </span>
                <span className="font-mono text-lg font-bold text-emerald-300 tracking-widest">
                  {classroom?.joinCode}
                </span>
              </div>
              <div className="flex items-center gap-1 border-l border-white/20 pl-2">
                <button
                  onClick={copyJoinCode}
                  className="p-2 hover:bg-white/20 rounded-xl text-white transition-colors"
                  title="Copy Join Code"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowEnlargeCode(true)}
                  className="p-2 hover:bg-white/20 rounded-xl text-white transition-colors"
                  title="Enlarge Join Code"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="z-10 flex items-center gap-4 text-xs text-white/80">
            <span className="flex items-center gap-1 font-semibold">
              <GraduationCap className="w-4 h-4" />
              Role: {classroom?.role}
            </span>
          </div>
        </div>

        {/* Two-Column Stream Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {/* Left Column: Upcoming Tasks Widget */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-[#2b2d31] rounded-2xl p-5 border border-gray-800 shadow-md">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-400" />
                Upcoming
              </h3>

              {upcoming.length === 0 ? (
                <p className="text-xs text-gray-400">Woohoo, no work due soon!</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={`/classrooms/${classroomId}/classwork`}
                      className="block p-2 rounded-xl hover:bg-[#35373c] transition-colors group"
                    >
                      <div className="text-xs font-semibold text-gray-200 group-hover:text-brand-400 truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'No due date'}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href={`/classrooms/${classroomId}/classwork`}
                className="mt-4 pt-3 border-t border-gray-800 text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center justify-between"
              >
                <span>View all classwork</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Announcement Feed */}
          <div className="md:col-span-3 space-y-6">
            {/* "Announce something to your class" Share Box */}
            <div className="bg-[#2b2d31] rounded-2xl border border-gray-800 shadow-md p-4 transition-all">
              {!isComposing ? (
                <button
                  onClick={() => setIsComposing(true)}
                  className="w-full flex items-center gap-3 text-left p-2 rounded-xl hover:bg-[#35373c] transition-colors text-gray-400"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-sm shadow">
                    {user?.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-300">Announce something to your class...</span>
                </button>
              ) : (
                <form onSubmit={handlePostAnnouncement} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-sm shadow flex-shrink-0">
                      {user?.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{user?.displayName}</div>
                      <div className="text-[11px] text-brand-400 font-semibold">Post to Course Stream</div>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    autoFocus
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Share updates, reminders, or discussion topics..."
                    className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 resize-none"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                      <span>Supports links & course text</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsComposing(false)}
                        className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={posting || !announcementText.trim()}
                        className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/30 disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Post Announcement</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Posts List */}
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-[#2b2d31] rounded-2xl border border-gray-800 shadow-md p-6 space-y-4"
              >
                {/* Author Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{post.authorName}</span>
                        {post.authorRole === 'TEACHER' && (
                          <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                            FACULTY
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </div>

                {/* Class Comments */}
                <div className="pt-3 border-t border-gray-800 space-y-3">
                  {post.comments.length > 0 && (
                    <div className="space-y-2 pl-2 border-l-2 border-brand-500/40">
                      {post.comments.map((comm) => (
                        <div key={comm.id} className="text-xs">
                          <span className="font-bold text-white mr-1.5">{comm.authorName}</span>
                          <span className="text-gray-300">{comm.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Class Comment Bar */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newComments[post.id] || ''}
                      onChange={(e) =>
                        setNewComments((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id);
                        }
                      }}
                      placeholder="Add class comment..."
                      className="flex-1 bg-[#1e1f22] border border-gray-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs transition-colors shadow"
                      title="Send Comment"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enlarge Join Code Modal */}
      {showEnlargeCode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2b2d31] rounded-3xl border border-gray-700 max-w-md w-full p-8 text-center shadow-2xl relative">
            <button
              onClick={() => setShowEnlargeCode(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>
            <KeyRound className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white">Course Join Code</h2>
            <p className="text-xs text-gray-400 mt-1 mb-6">
              Share this code with students to grant immediate course enrollment
            </p>
            <div className="bg-[#1e1f22] border-2 border-emerald-500/50 rounded-2xl p-6 mb-6">
              <span className="font-mono text-4xl font-extrabold text-emerald-300 tracking-[0.25em]">
                {classroom?.joinCode}
              </span>
            </div>
            <button
              onClick={copyJoinCode}
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Code Copied!' : 'Copy Code to Clipboard'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
