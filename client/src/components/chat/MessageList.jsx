import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import EmptyChat from './EmptyChat';
import { Loader2 } from 'lucide-react';

export default function MessageList({
  messages = [],
  currentUserId,
  isTyping,
  otherUserName,
  loadingMessages,
  loadingMoreMessages,
  hasMoreMessages,
  onLoadMore
}) {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const getDateLabel = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return 'Today';
      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  const groupedMessages = [];
  let currentDateLabel = null;

  messages.forEach((msg) => {
    const label = getDateLabel(msg.createdAt);
    if (label !== currentDateLabel) {
      currentDateLabel = label;
      groupedMessages.push({ type: 'date', label, id: `date-${label}-${msg._id}` });
    }
    groupedMessages.push({ type: 'message', data: msg, id: msg._id });
  });

  useEffect(() => {
    if (bottomRef.current && !loadingMoreMessages) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isTyping]);

  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMoreMessages && !loadingMoreMessages && onLoadMore) {
      onLoadMore();
    }
  };

  if (loadingMessages) {
    return (
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex justify-start">
          <div className="w-48 h-10 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
        </div>
        <div className="flex justify-end">
          <div className="w-56 h-12 rounded-2xl bg-blue-200 dark:bg-blue-900/40 animate-pulse"></div>
        </div>
        <div className="flex justify-start">
          <div className="w-64 h-16 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
        </div>
        <div className="flex justify-end">
          <div className="w-40 h-10 rounded-2xl bg-blue-200 dark:bg-blue-900/40 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return <EmptyChat mode="no-messages" />;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0 bg-slate-50/30 dark:bg-slate-950/30 flex flex-col justify-start"
    >
      {loadingMoreMessages && (
        <div className="flex items-center justify-center py-2 text-xs text-blue-600 dark:text-blue-400 gap-2">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading older messages...</span>
        </div>
      )}

      {groupedMessages.map((item) => {
        if (item.type === 'date') {
          return (
            <div key={item.id} className="flex items-center justify-center my-4">
              <div className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-2xs">
                {item.label}
              </div>
            </div>
          );
        }

        const isOutgoing = item.data.senderId === currentUserId;
        return (
          <MessageBubble
            key={item.id}
            message={item.data}
            isOutgoing={isOutgoing}
          />
        );
      })}

      {isTyping && <TypingIndicator userName={otherUserName} />}
      <div ref={bottomRef} />
    </div>
  );
}
