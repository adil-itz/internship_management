import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

export default function MessageBubble({ message, isOutgoing }) {
  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`flex flex-col mb-3 ${isOutgoing ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-1 duration-200`}>
      <div
        className={`max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isOutgoing
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15 rounded-br-xs'
            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs rounded-bl-xs'
        }`}
      >
        <span>{message.message}</span>
        <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isOutgoing ? 'text-blue-100/90' : 'text-slate-400'}`}>
          <span>{formatTime(message.createdAt)}</span>
          {isOutgoing && (
            <span className="shrink-0 ml-0.5">
              {message.read ? (
                <CheckCheck size={14} className="text-cyan-300" />
              ) : (
                <Check size={14} className="text-white/70" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
