'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface AvailabilityCalendarProps {
  bookedDates: string[]; // ISO date strings: "YYYY-MM-DD"
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function AvailabilityCalendar({ bookedDates }: AvailabilityCalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const { t } = useLanguage();

  const nav = (dir: number) => {
    let m = month + dir;
    let y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setMonth(m);
    setYear(y);
  };

  const toISO = (d: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const monthName = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const bookedSet = new Set(bookedDates);

  return (
    <div className="sidebar-card availability-card" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{t('Availability')}</h3>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
        {t('Check open dates for your stay')}
      </p>
      <div className="cal-widget">
        <div className="cal-header">
          <button className="cal-nav" onClick={() => nav(-1)} aria-label="Previous month">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <use href="#i-caret-left" />
            </svg>
          </button>
          <span className="cal-month-label">{monthName}</span>
          <button className="cal-nav" onClick={() => nav(1)} aria-label="Next month">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <use href="#i-caret-right" />
            </svg>
          </button>
        </div>
        <div className="cal-weekdays">
          {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
        </div>
        <div className="cal-days">
          {cells.map((day, i) => {
            if (!day) return <span key={`e-${i}`} />;
            const isPast = isCurrentMonth && day < today;
            const isBooked = bookedSet.has(toISO(day));
            let cls = 'cal-day';
            if (isPast) cls += ' past';
            else if (isBooked) cls += ' booked';
            if (isCurrentMonth && day === today) cls += ' today';
            return <span key={day} className={cls}>{day}</span>;
          })}
        </div>
        <div className="cal-legend">
          <span className="cal-legend-item">
            <span className="cal-dot cal-dot-available" />
            {t('Available')}
          </span>
          <span className="cal-legend-item">
            <span className="cal-dot cal-dot-booked" />
            {t('Booked')}
          </span>
        </div>
      </div>
    </div>
  );
}
