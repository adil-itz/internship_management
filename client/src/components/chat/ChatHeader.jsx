import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ChatHeader({ participant, role, isOnline, onBack, internshipTitle }) {
  if (!participant) return null;

  const initial = participant.name ? participant.name.charAt(0).toUpperCase() : 'U';
  
  let displayRole = 'User';
  if (participant.role) {
    displayRole = participant.role === 'mentor' ? 'Mentor' : 'Student';
  } else if (role) {
    displayRole = role;
  }

  return (
    <div className="px-4 sm:px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Back to conversations"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="relative shrink-0">
          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
              {initial}
            </div>
          )}
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
              isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
              {participant.name}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 shrink-0 capitalize">
              {displayRole}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="text-[11px] font-medium">{isOnline ? 'Online' : 'Offline'}</span>
            </span>

            {internshipTitle && (
              <>
                <span>•</span>
                <span className="text-[11px] truncate max-w-[200px]">{internshipTitle}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
