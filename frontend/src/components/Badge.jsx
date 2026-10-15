import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-ivory-200 text-charcoal-700 border-ivory-300',
    demo: 'bg-amber-50 text-amber-900 border-amber-300 font-medium tracking-wide uppercase text-[10px] px-2 py-0.5',
    forest: 'bg-forest-50 text-forest-800 border-forest-200',
    maroon: 'bg-forest-50 text-forest-800 border-forest-200',
    gold: 'bg-gold-50 text-gold-700 border-gold-300',
    phase: 'bg-emerald-50 text-emerald-800 border-emerald-300 text-[11px] font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs ${
        styles[variant] || styles.default
      } ${className}`}
    >
      {variant === 'demo' && (
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
      )}
      {children}
    </span>
  );
}
