import React from 'react';

export default function TypingIndicator({ userName = 'User' }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 my-2 w-fit rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs animate-in fade-in zoom-in-95">
      <span className="font-semibold">{userName} is typing</span>
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
}
