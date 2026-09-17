'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { useWebRtcMedia } from '@/hooks/use-webrtc-media';
import DiscordMemberSidebar from '@/components/discord-member-sidebar';
import DiscordPinnedPopover from '@/components/discord-pinned-popover';
import {
  Hash,
  Send,
  Volume2,
  Radio,
  Sparkles,
  Megaphone,
  Pin,
  Reply,
  X,
  Mic,
  MicOff,
  Headphones,
  VolumeX,
  Video,
  VideoOff,
  ScreenShare,
  PhoneOff,
  Hand,
  MessageSquare,
  Smile,
  ShieldAlert,
  Users,
  Paperclip,
  Bell,
  Search,
  AlertCircle,
} from 'lucide-react';

interface ChannelInfo {
  id: string;
  name: string;
  type: string;
}

interface Message {
  id: string;
  channelId: string;
  author: {
    id: string;
    displayName: string;
    email: string;
  };
  content: string;
  parentMessageId?: string;
  pinned: boolean;
  createdAt: string;
}

interface ClassroomItem {
  id: string;
  role: string;
}

// Helper component to render a live HTML5 video stream from MediaStream
function LiveVideoView({
  stream,
  className,
  muted = true,
}: {
  stream: MediaStream | null;
  className?: string;
  muted?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className={className || 'w-full h-full object-cover rounded-2xl'}
    />
  );
}

export default function ChannelChatPage() {
  const { channelId, classroomId } = useParams<{ channelId: string; classroomId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [channel, setChannel] = useState<ChannelInfo | null>(null);
  const [userRole, setUserRole] = useState<string>('STUDENT');
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Popover & Sidebar States
  const [showPinnedPopover, setShowPinnedPopover] = useState(false);
  const [showMemberSidebar, setShowMemberSidebar] = useState(true);
  const [showSideChat, setShowSideChat] = useState(false);

  // Telegram Features: Reply & Pin & Reactions
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>({});

  // Stage Channel State
  const [handRaised, setHandRaised] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const isAnnouncement = channel?.type === 'ANNOUNCEMENT';
  const isVoiceOrStage = channel?.type === 'VOICE' || channel?.type === 'STAGE';
  const isStage = channel?.type === 'STAGE';
  const isStudent = userRole === 'STUDENT';
  const isReadOnlyForUser = isAnnouncement && isStudent;

  // Real WebRTC & Web Audio Engine
  const {
    micActive,
    micMuted,
    deafened,
    videoActive,
    screenShareActive,
    isSpeaking,
    audioVolume,
    permissionError,
    localVideoStream,
    screenStream,
    startMicrophone,
    toggleMute,
    toggleDeafen,
    toggleCamera,
    toggleScreenShare,
    disconnectAll,
  } = useWebRtcMedia({ autoStartMic: isVoiceOrStage });

  useEffect(() => {
    if (classroomId) {
      apiFetch<ClassroomItem>(`/classrooms/${classroomId}`)
        .then((cls) => {
          if (cls) setUserRole(cls.role);
        })
        .catch(() => {});
    }
  }, [classroomId]);

  useEffect(() => {
    if (channelId) {
      loadChannelDetails();
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [channelId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChannelDetails = async () => {
    try {
      const channels = await apiFetch<ChannelInfo[]>(`/classrooms/${classroomId}/channels`);
      const match = channels.find((c) => c.id === channelId);
      if (match) setChannel(match);
    } catch (e) {
      console.error('Failed to load channel details', e);
    }
  };

  const loadMessages = async () => {
    try {
      const data = await apiFetch<Message[]>(`/channels/${channelId}/messages?limit=50`);
      setMessages(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      const payload: any = { content: content.trim() };
      if (replyingTo) {
        payload.parentMessageId = replyingTo.id;
      }

      const newMsg = await apiFetch<Message>(`/channels/${channelId}/messages`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setMessages((prev) => [...prev, newMsg]);
      setContent('');
      setReplyingTo(null);
    } catch (e: any) {
      alert(e.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTogglePin = async (msgId: string) => {
    try {
      const updated = await apiFetch<Message>(`/messages/${msgId}/pin`, { method: 'PUT' });
      setMessages((prev) =>
        prev.map((m) => (m.id === updated.id ? { ...m, pinned: updated.pinned } : m))
      );
    } catch (err: any) {
      alert(err.message || 'Only instructors or message authors can pin messages');
    }
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    setReactions((prev) => {
      const currentMsgReactions = prev[msgId] || {};
      const currentCount = currentMsgReactions[emoji] || 0;
      return {
        ...prev,
        [msgId]: {
          ...currentMsgReactions,
          [emoji]: currentCount + 1,
        },
      };
    });
  };

  const handleDisconnect = () => {
    disconnectAll();
    router.push(`/classrooms/${classroomId}/stream`);
  };

  const pinnedMessages = messages.filter((m) => m.pinned);
  const latestPinned = pinnedMessages[pinnedMessages.length - 1];

  // --- RENDER VOICE / STAGE LOUNGE ---
  if (isVoiceOrStage) {
    return (
      <div className="flex-1 flex h-full bg-[#1e1f22] overflow-hidden select-none">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Voice Lounge Header */}
          <div className="h-12 px-6 border-b border-[#2b2d31] flex items-center justify-between bg-[#2b2d31] z-10 flex-shrink-0">
            <div className="flex items-center space-x-3 font-bold text-white">
              {isStage ? (
                <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
              <span className="text-base">{channel?.name || 'Voice Lounge'}</span>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-medium">
                {isStage ? 'STAGE LIVE' : 'VOICE ROOM'}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Live Web Audio RMS Volume Bar */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Mic Level:</span>
                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${audioVolume}%` }}
                    className={`h-full transition-all duration-75 ${
                      isSpeaking ? 'bg-emerald-400' : 'bg-brand-500'
                    }`}
                  />
                </div>
              </div>

              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Connected (24ms RTC)
              </span>

              <button
                onClick={() => setShowSideChat(!showSideChat)}
                className={`p-1.5 rounded-lg border border-gray-700 text-xs flex items-center gap-1 transition-colors ${
                  showSideChat ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="Toggle In-Call Chat"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button>
            </div>
          </div>

          {/* Hardware Permission Warning Banner */}
          {permissionError && (
            <div className="bg-amber-500/20 border-b border-amber-500/30 px-6 py-2 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Hardware Access: {permissionError}. Check browser permissions for mic/camera.</span>
              </div>
              <button
                onClick={() => startMicrophone()}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium text-[11px]"
              >
                Request Again
              </button>
            </div>
          )}

          {/* Main Stage / Voice Viewport */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
              {/* Screen Broadcast Tile */}
              {screenShareActive && (
                <div className="w-full max-w-4xl h-80 bg-black rounded-3xl border-2 border-emerald-500 flex flex-col items-center justify-center mb-6 shadow-2xl relative overflow-hidden">
                  <LiveVideoView stream={screenStream} className="w-full h-full object-contain" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shadow">
                      LIVE SCREEN BROADCAST
                    </span>
                    <span className="text-xs text-white/90 font-mono bg-black/60 px-2 py-0.5 rounded-lg">
                      1080p 60fps
                    </span>
                  </div>
                </div>
              )}

              {/* Participants Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
                {/* Current User Tile */}
                <div
                  className={`bg-[#2b2d31] rounded-2xl p-6 flex flex-col items-center justify-center border transition-all duration-150 relative min-h-[190px] overflow-hidden ${
                    isSpeaking
                      ? 'border-emerald-500 ring-4 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'border-gray-800'
                  }`}
                >
                  {videoActive && localVideoStream ? (
                    <LiveVideoView stream={localVideoStream} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-brand-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg relative mb-3">
                      {user?.displayName.charAt(0).toUpperCase()}
                      {handRaised && (
                        <span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg animate-bounce">
                          ✋
                        </span>
                      )}
                    </div>
                  )}

                  <div className="text-sm font-bold text-white z-10 drop-shadow-md">
                    {user?.displayName} (You)
                  </div>
                  <div className="text-[11px] text-gray-300 uppercase tracking-wider mt-0.5 z-10 flex items-center gap-1.5 drop-shadow">
                    <span className="font-semibold">{userRole}</span>
                    <span>•</span>
                    <span className={isSpeaking ? 'text-emerald-400 font-bold' : 'text-gray-400'}>
                      {micMuted ? 'Muted' : isSpeaking ? 'Speaking' : 'Listening'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 bg-black/50 backdrop-blur-sm p-1 rounded-lg">
                    {micMuted && <MicOff className="w-4 h-4 text-rose-400" />}
                    {deafened && <VolumeX className="w-4 h-4 text-rose-400" />}
                    {videoActive && <Video className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>

                {/* Simulated Peer Participant */}
                <div className="bg-[#2b2d31] rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-800 relative min-h-[190px]">
                  <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-3">
                    P
                  </div>
                  <div className="text-sm font-bold text-white">Course Faculty</div>
                  <div className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">
                    TEACHER • Listening
                  </div>
                  <div className="absolute top-3 right-3 text-gray-500">
                    <MicOff className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* In-Call Side Chat Drawer */}
            {showSideChat && (
              <div className="w-80 bg-[#2b2d31] border-l border-[#1f2023] flex flex-col h-full">
                <div className="p-4 border-b border-[#1f2023] flex items-center justify-between text-xs font-bold text-white">
                  <span>Room Text Chat</span>
                  <button
                    onClick={() => setShowSideChat(false)}
                    className="p-1 hover:bg-[#35373c] rounded text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className="text-xs space-y-0.5">
                      <span className="font-bold text-brand-400">{m.author.displayName}</span>
                      <p className="text-gray-200 whitespace-pre-wrap">{m.content}</p>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>
                <form onSubmit={handleSend} className="p-3 border-t border-[#1f2023]">
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Message in call..."
                    className="w-full bg-[#1e1f22] border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                  />
                </form>
              </div>
            )}
          </div>

          {/* Bottom Call Action Dock */}
          <div className="h-20 bg-[#2b2d31] border-t border-[#1f2023] px-6 flex items-center justify-center space-x-4 z-20 flex-shrink-0">
            {/* Mic Toggle */}
            <button
              onClick={toggleMute}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                micMuted
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-[#35373c] hover:bg-[#3f4248] text-white'
              }`}
              title={micMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Deafen Toggle */}
            <button
              onClick={toggleDeafen}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                deafened
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-[#35373c] hover:bg-[#3f4248] text-white'
              }`}
              title={deafened ? 'Undeafen' : 'Deafen'}
            >
              {deafened ? <VolumeX className="w-5 h-5" /> : <Headphones className="w-5 h-5" />}
            </button>

            {/* Camera Toggle */}
            <button
              onClick={toggleCamera}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                videoActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-[#35373c] hover:bg-[#3f4248] text-white'
              }`}
              title={videoActive ? 'Stop Camera' : 'Start Camera'}
            >
              {videoActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Screen Share Toggle */}
            <button
              onClick={toggleScreenShare}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                screenShareActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-[#35373c] hover:bg-[#3f4248] text-white'
              }`}
              title={screenShareActive ? 'Stop Screen Share' : 'Share Screen'}
            >
              <ScreenShare className="w-5 h-5" />
            </button>

            {/* Stage Hand Raise */}
            {isStage && (
              <button
                onClick={() => setHandRaised(!handRaised)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  handRaised
                    ? 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-[#35373c] hover:bg-[#3f4248] text-white'
                }`}
                title="Raise Hand to Speak"
              >
                <Hand className="w-5 h-5" />
              </button>
            )}

            {/* Disconnect */}
            <button
              onClick={handleDisconnect}
              className="w-12 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all shadow-md shadow-rose-600/30"
              title="Disconnect from Room"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER TEXT / ANNOUNCEMENT CHANNELS ---
  return (
    <div className="flex-1 flex h-full bg-[#313338] overflow-hidden select-none">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Discord Channel Header */}
        <div className="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between shadow-sm bg-[#313338] z-10 flex-shrink-0">
          <div className="flex items-center space-x-2 font-bold text-white min-w-0">
            {isAnnouncement ? (
              <Megaphone className="w-5 h-5 text-amber-400 flex-shrink-0" />
            ) : (
              <Hash className="w-5 h-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="truncate">{channel?.name || 'Channel'}</span>
            <div className="w-[1px] h-4 bg-gray-700 mx-2 hidden sm:block" />
            <span className="text-xs text-gray-400 font-normal hidden sm:block truncate max-w-sm">
              {isAnnouncement ? 'Official announcements broadcast' : 'Course discussions & real-time chat'}
            </span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Pinned Messages Trigger */}
            <button
              onClick={() => setShowPinnedPopover(!showPinnedPopover)}
              className={`p-1.5 rounded-lg transition-colors relative ${
                showPinnedPopover || pinnedMessages.length > 0
                  ? 'text-amber-400 hover:text-amber-300 bg-amber-500/10'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Pinned Messages"
            >
              <Pin className="w-4 h-4" />
              {pinnedMessages.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black font-bold text-[9px] flex items-center justify-center">
                  {pinnedMessages.length}
                </span>
              )}
            </button>

            {/* Right Member Sidebar Toggle */}
            <button
              onClick={() => setShowMemberSidebar(!showMemberSidebar)}
              className={`p-1.5 rounded-lg transition-colors ${
                showMemberSidebar ? 'text-white bg-[#35373c]' : 'text-gray-400 hover:text-white'
              }`}
              title="Toggle Member List"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Discord Pinned Popover Panel */}
        {showPinnedPopover && (
          <DiscordPinnedPopover
            pinnedMessages={pinnedMessages}
            canManagePins={!isStudent}
            onUnpin={handleTogglePin}
            onClose={() => setShowPinnedPopover(false)}
          />
        )}

        {/* Telegram Sticky Pinned Message Banner */}
        {latestPinned && (
          <div className="bg-[#2b2d31] border-b border-amber-500/30 px-6 py-2 flex items-center justify-between text-xs text-amber-200 z-10 shadow-sm">
            <div className="flex items-center space-x-2 min-w-0">
              <Pin className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="font-bold text-white">Pinned:</span>
              <span className="truncate max-w-lg">{latestPinned.content}</span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-[11px] text-gray-400">{latestPinned.author.displayName}</span>
              {(!isStudent || latestPinned.author.id === user?.id) && (
                <button
                  onClick={() => handleTogglePin(latestPinned.id)}
                  className="text-gray-400 hover:text-white text-[11px] underline"
                  title="Unpin message"
                >
                  Unpin
                </button>
              )}
            </div>
          </div>
        )}

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <div className="w-16 h-16 bg-[#2b2d31] rounded-3xl flex items-center justify-center mb-3">
                {isAnnouncement ? (
                  <Megaphone className="w-8 h-8 text-amber-400" />
                ) : (
                  <Hash className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <h3 className="text-lg font-bold text-white">Welcome to #{channel?.name}!</h3>
              <p className="text-sm text-gray-400 max-w-sm mt-1">
                {isAnnouncement
                  ? 'Important instructor announcements and official deadlines will be posted here.'
                  : 'This is the start of the discussion. Be the first to share an update or question.'}
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = user?.id === msg.author.id;
              const initials = msg.author.displayName.charAt(0).toUpperCase();

              // Find parent message for Telegram Quoted Reply
              const parentMsg = msg.parentMessageId
                ? messages.find((m) => m.id === msg.parentMessageId)
                : null;

              const msgReactions = reactions[msg.id] || {};

              return (
                <div
                  key={msg.id}
                  className="flex items-start space-x-3 group hover:bg-[#2e3035] -mx-4 px-4 py-1.5 rounded-lg transition-colors relative"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-xs flex-shrink-0 mt-0.5">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-semibold text-sm text-white">{msg.author.displayName}</span>
                      <span className="text-[11px] text-gray-500">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Just now'}
                      </span>
                      {msg.pinned && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                    </div>

                    {/* Telegram Quoted Parent Message */}
                    {parentMsg && (
                      <div className="my-1 pl-2.5 py-1 border-l-2 border-brand-500 bg-[#2b2d31]/60 rounded-r-lg text-xs">
                        <span className="font-bold text-brand-400 block">
                          {parentMsg.author.displayName}
                        </span>
                        <span className="text-gray-300 truncate block">{parentMsg.content}</span>
                      </div>
                    )}

                    <div className="text-sm text-gray-200 mt-0.5 whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>

                    {/* Reaction Badges */}
                    {Object.keys(msgReactions).length > 0 && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {Object.entries(msgReactions).map(([emoji, count]) => (
                          <span
                            key={emoji}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#2b2d31] border border-gray-700 text-xs text-gray-200"
                          >
                            <span>{emoji}</span>
                            <span className="font-bold text-[11px]">{count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Discord / Telegram Hover Action Dock */}
                  <div className="absolute right-4 -top-3 flex opacity-0 group-hover:opacity-100 transition-opacity items-center bg-[#2b2d31] border border-gray-700 rounded-lg shadow-lg px-1.5 py-1 space-x-1 z-10">
                    <button
                      onClick={() => handleAddReaction(msg.id, '👍')}
                      className="p-1 hover:bg-[#35373c] rounded text-xs transition-colors"
                      title="Thumbs Up"
                    >
                      👍
                    </button>
                    <button
                      onClick={() => handleAddReaction(msg.id, '❤️')}
                      className="p-1 hover:bg-[#35373c] rounded text-xs transition-colors"
                      title="Heart"
                    >
                      ❤️
                    </button>
                    <button
                      onClick={() => handleAddReaction(msg.id, '🔥')}
                      className="p-1 hover:bg-[#35373c] rounded text-xs transition-colors"
                      title="Fire"
                    >
                      🔥
                    </button>

                    <div className="w-[1px] h-3 bg-gray-700 mx-1" />

                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="p-1 text-gray-400 hover:text-white hover:bg-[#35373c] rounded transition-colors"
                      title="Reply / Quote"
                    >
                      <Reply className="w-3.5 h-3.5" />
                    </button>

                    {(!isStudent || msg.author.id === user?.id) && (
                      <button
                        onClick={() => handleTogglePin(msg.id)}
                        className={`p-1 hover:bg-[#35373c] rounded transition-colors ${
                          msg.pinned ? 'text-amber-400' : 'text-gray-400 hover:text-white'
                        }`}
                        title={msg.pinned ? 'Unpin' : 'Pin message'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>

        {/* Telegram Reply Banner above composer */}
        {replyingTo && (
          <div className="bg-[#2b2d31] border-t border-brand-500/30 px-6 py-2 flex items-center justify-between text-xs text-gray-300">
            <div className="flex items-center space-x-2 truncate">
              <Reply className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>
                Replying to <strong className="text-white">{replyingTo.author.displayName}</strong>:
              </span>
              <span className="text-gray-400 truncate italic">"{replyingTo.content}"</span>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Channel Input Composer */}
        {isReadOnlyForUser ? (
          <div className="p-4 bg-[#2b2d31] border-t border-[#1f2023] flex items-center justify-center space-x-2 text-xs text-gray-400">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>This announcement channel is read-only for students. Only faculty may broadcast.</span>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-4 bg-[#313338] border-t border-[#1f2023]">
            <div className="bg-[#383a40] rounded-2xl flex items-center px-4 py-2 space-x-3 shadow-inner">
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-gray-600 hover:bg-gray-500 text-white flex items-center justify-center transition-colors text-sm"
                title="Add Attachment"
              >
                +
              </button>

              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  replyingTo
                    ? `Reply to ${replyingTo.author.displayName}...`
                    : `Message #${channel?.name || 'channel'}`
                }
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
              />

              <button
                type="submit"
                disabled={sending || !content.trim()}
                className="p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-all shadow disabled:opacity-40"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Right-Hand Member Sidebar */}
      {showMemberSidebar && (
        <DiscordMemberSidebar
          classroomId={classroomId}
          currentUserId={user?.id}
          onClose={() => setShowMemberSidebar(false)}
        />
      )}
    </div>
  );
}
