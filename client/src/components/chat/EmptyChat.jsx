import React from 'react';
import { MessageSquare, Send, Users } from 'lucide-react';

export default function EmptyChat({ mode = 'no-selection' }) {
  if (mode === 'no-messages') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-950/40">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-inner">
          <Send size={28} />
        </div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
          Start a conversation
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          Send a message to begin communicating with your mentor/student.
        </p>
      </div>
    );
  }

  if (mode === 'no-conversations') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center my-auto">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
          <Users size={24} />
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          No conversations yet
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
          Your mentor/student conversations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40 dark:bg-slate-950/30">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 dark:from-blue-600/20 dark:to-indigo-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/5">
        <MessageSquare size={36} />
      </div>
      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
        Messages
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        Select a conversation from the left panel to start chatting with your assigned mentor or student in real-time.
      </p>
    </div>
  );
}
