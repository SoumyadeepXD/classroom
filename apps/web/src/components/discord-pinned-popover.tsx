'use client';

import React from 'react';
import { Pin, X, Trash2 } from 'lucide-react';

interface PinnedMessage {
  id: string;
  content: string;
  author: {
    id: string;
    displayName: string;
  };
  createdAt: string;
}

interface DiscordPinnedPopoverProps {
  pinnedMessages: PinnedMessage[];
  canManagePins: boolean;
  onUnpin: (messageId: string) => void;
  onClose: () => void;
}

export default function DiscordPinnedPopover({
  pinnedMessages,
  canManagePins,
  onUnpin,
  onClose,
}: DiscordPinnedPopoverProps) {
  return (
    <div className="absolute right-6 top-14 w-96 max-h-[480px] bg-[#2b2d31] rounded-2xl shadow-2xl border border-gray-700/80 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#1e1f22]">
        <div className="flex items-center space-x-2 text-white font-bold text-sm">
          <Pin className="w-4 h-4 text-amber-400" />
          <span>Pinned Messages ({pinnedMessages.length})</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#35373c] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {pinnedMessages.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">
            No pinned messages in this channel yet.
          </div>
        ) : (
          pinnedMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-3 bg-[#1e1f22] rounded-xl border border-gray-800 hover:border-gray-700 transition-colors relative group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{msg.author.displayName}</span>
                <span className="text-[10px] text-gray-500">
                  {new Date(msg.createdAt).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-xs text-gray-300 whitespace-pre-wrap break-words">
                {msg.content}
              </p>

              {canManagePins && (
                <div className="mt-2 pt-2 border-t border-gray-800/80 flex justify-end">
                  <button
                    onClick={() => onUnpin(msg.id)}
                    className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-medium"
                    title="Unpin message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Unpin</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
