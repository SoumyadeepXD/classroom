'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { Hash, Send, Volume2, Radio, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  channelId: string;
  author: {
    id: string;
    displayName: string;
    email: string;
  };
  content: string;
  createdAt: string;
}

export default function ChannelChatPage() {
  const { channelId, classroomId } = useParams<{ channelId: string; classroomId: string }>();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (channelId) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000); // 3s polling for real-time fallback
      return () => clearInterval(interval);
    }
  }, [channelId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const newMsg = await apiFetch<Message>(`/channels/${channelId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content: content.trim() }),
      });
      setMessages((prev) => [...prev, newMsg]);
      setContent('');
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338] overflow-hidden">
      {/* Channel Header */}
      <div className="h-12 px-6 border-b border-[#1f2023] flex items-center justify-between shadow-sm bg-[#313338] z-10">
        <div className="flex items-center space-x-2 font-bold text-white">
          <Hash className="w-5 h-5 text-gray-400" />
          <span>Channel Stream</span>
        </div>
        <div className="text-xs text-gray-400">Real-Time Channel</div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
            <div className="w-16 h-16 bg-[#2b2d31] rounded-3xl flex items-center justify-center mb-3">
              <Hash className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-white">Welcome to the channel!</h3>
            <p className="text-sm text-gray-400 max-w-sm mt-1">
              This is the start of the discussion. Be the first to share an update, question, or comment.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = user?.id === msg.author.id;
            const initials = msg.author.displayName.charAt(0).toUpperCase();

            return (
              <div key={msg.id} className="flex items-start space-x-3 group hover:bg-[#2e3035] -mx-4 px-4 py-1.5 rounded-lg transition-colors">
                <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-semibold text-sm text-white">{msg.author.displayName}</span>
                    <span className="text-[11px] text-gray-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-sm text-gray-200 mt-0.5 whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Message Composer */}
      <div className="p-4 bg-[#313338]">
        <form onSubmit={handleSend} className="bg-[#383a40] rounded-xl px-4 py-2.5 flex items-center space-x-2 border border-transparent focus-within:border-brand-500 transition-colors">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Message channel... (Press Enter to send)"
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!content.trim() || sending}
            className="p-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-30 text-white rounded-lg transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
