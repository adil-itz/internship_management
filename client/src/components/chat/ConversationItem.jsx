import React from 'react';

export default function ConversationItem({ conversation, isSelected, isOnline, onClick }) {
  const { otherUser, lastMessage, lastMessageAt, unreadCount } = conversation;
  const initial = otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : 'U';

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return '';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 sm:p-3.5 rounded-2xl flex items-center gap-3 transition-all cursor-pointer text-left group ${
        isSelected
          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-900 dark:text-slate-100'
      }`}
    >
      <div className="relative shrink-0">
        {otherUser?.avatar ? (
          <img
            src={otherUser.avatar}
            alt={otherUser.name}
            className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
          />
        ) : (
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm transition-transform group-hover:scale-105 ${
              isSelected
                ? 'bg-white/20 text-white'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-2xs'
            }`}
          >
            {initial}
          </div>
        )}
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 ${
            isSelected ? 'border-blue-600' : 'border-white dark:border-slate-900'
          } ${isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-1">
          <h4 className={`font-extrabold text-xs sm:text-sm truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
            {otherUser?.name || 'User'}
          </h4>
          <span className={`text-[10px] shrink-0 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
            {formatTime(lastMessageAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className={`text-xs truncate ${isSelected ? 'text-blue-100/90' : 'text-slate-500 dark:text-slate-400'}`}>
            {lastMessage || 'No messages yet'}
          </p>

          {unreadCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                isSelected
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-600 text-white shadow-xs'
              }`}
            >
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
