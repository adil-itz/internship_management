import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';

export default function MessageInput({ onSendMessage, onTyping, onStopTyping, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    const val = e.target.value;
    if (val.length <= 2000) {
      setText(val);
      if (val.trim() !== '' && onTyping) {
        onTyping();
      } else if (val.trim() === '' && onStopTyping) {
        onStopTyping();
      }
    }
  };

  const handleSend = () => {
    if (text.trim() === '' || disabled) return;
    onSendMessage(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift + Enter for new line)"
          disabled={disabled}
          className="flex-1 max-h-32 p-2 text-xs sm:text-sm bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none"
        />
        <button
          onClick={handleSend}
          disabled={text.trim() === '' || disabled}
          className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:shadow-blue-500/20 active:scale-95 transition-all cursor-pointer shrink-0"
          title="Send message"
        >
          <Send size={18} />
        </button>
      </div>
      <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-slate-400">
        <span>Press Enter to send</span>
        <span>{text.length}/2000</span>
      </div>
    </div>
  );
}
