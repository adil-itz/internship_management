import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  maxStars = 5,
  size = 20,
  showLabel = true,
  label = '',
  id = ''
}) {
  const [hoverValue, setHoverValue] = useState(null);

  const displayRating = hoverValue !== null ? hoverValue : value;

  const handleKeyDown = (e, ratingValue) => {
    if (readOnly || !onChange) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(ratingValue);
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
            {label}
          </label>
          {showLabel && (
            <span className="text-xs font-black text-amber-500">
              {displayRating} / {maxStars}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-1" id={id} role="group" aria-label={label || 'Star rating'}>
        {Array.from({ length: maxStars }).map((_, index) => {
          const ratingValue = index + 1;
          const isFilled = ratingValue <= displayRating;

          return (
            <button
              key={index}
              type="button"
              disabled={readOnly}
              onClick={() => !readOnly && onChange && onChange(ratingValue)}
              onMouseEnter={() => !readOnly && setHoverValue(ratingValue)}
              onMouseLeave={() => !readOnly && setHoverValue(null)}
              onKeyDown={(e) => handleKeyDown(e, ratingValue)}
              aria-label={`${ratingValue} out of ${maxStars} stars`}
              className={`p-0.5 rounded-lg transition-transform focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
              }`}
            >
              <Star
                size={size}
                className={`transition-colors ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-100 dark:fill-slate-800 text-slate-300 dark:text-slate-700'
                }`}
              />
            </button>
          );
        })}

        {!label && showLabel && (
          <span className="ml-2 text-xs font-extrabold text-slate-600 dark:text-slate-400">
            {displayRating} / {maxStars}
          </span>
        )}
      </div>
    </div>
  );
}
