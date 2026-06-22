'use client';

import { useState } from 'react';

interface BookedDate {
  id: string;
  date: string;
  note: string;
  dateType: string;
}

interface CalendarManagerProps {
  propertyId: string;
  initialDates: BookedDate[];
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function CalendarManager({ propertyId, initialDates }: CalendarManagerProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [dates, setDates] = useState<BookedDate[]>(initialDates);
  const [loading, setLoading] = useState<string | null>(null);

  const nav = (dir: number) => {
    let m = month + dir, y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setMonth(m); setYear(y);
  };

  const monthLabel = new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayD = now.getDate(), isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const toISO = (d: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const getEntry = (d: number) => dates.find((e) => e.date === toISO(d));

  const toggle = async (d: number) => {
    const iso = toISO(d);
    const existing = getEntry(d);
    setLoading(iso);

    if (existing) {
      const res = await fetch(`/api/admin/properties/${propertyId}/calendar`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: iso }),
      });
      if (res.ok) setDates((prev) => prev.filter((e) => e.date !== iso));
    } else {
      const res = await fetch(`/api/admin/properties/${propertyId}/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: iso, dateType: 'blocked' }),
      });
      if (res.ok) {
        const entry: BookedDate = await res.json();
        setDates((prev) => [...prev, entry]);
      }
    }
    setLoading(null);
  };

  const blockedCount = dates.filter((d) => d.dateType === 'blocked').length;
  const reservedCount = dates.filter((d) => d.dateType === 'reserved').length;

  return (
    <div>
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="a-cal">
          <div className="a-cal-header">
            <button className="a-cal-nav" onClick={() => nav(-1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
            </button>
            <span className="a-cal-month">{monthLabel}</span>
            <button className="a-cal-nav" onClick={() => nav(1)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9,18 15,12 9,6"/></svg>
            </button>
          </div>
          <div className="a-cal-weekdays">
            {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="a-cal-days">
            {cells.map((day, i) => {
              if (!day) return <span key={`e${i}`} className="a-cal-day empty" />;
              const entry = getEntry(day);
              const isPast = isCurrentMonth && day < todayD;
              const isToday = isCurrentMonth && day === todayD;
              const iso = toISO(day);
              let cls = 'a-cal-day';
              if (isPast) cls += ' past';
              else if (entry?.dateType === 'reserved') cls += ' reserved';
              else if (entry) cls += ' blocked';
              if (isToday) cls += ' today';
              return (
                <button
                  key={day}
                  className={cls}
                  onClick={() => !isPast && toggle(day)}
                  disabled={loading === iso}
                  title={entry ? `${entry.dateType}${entry.note ? ` — ${entry.note}` : ''}` : 'Click to block'}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="a-cal-legend">
            <span className="a-cal-legend-item"><span className="a-cal-dot avail" />Available</span>
            <span className="a-cal-legend-item"><span className="a-cal-dot blk" />Blocked</span>
            <span className="a-cal-legend-item"><span className="a-cal-dot rsv" />Reserved</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--a-text-2)', marginBottom: 16, lineHeight: 1.6 }}>
            Click any date to toggle it blocked/available. Currently showing all blocked dates for this property.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <div className="a-stat" style={{ minWidth: 110 }}>
              <div className="a-stat-label">Blocked</div>
              <div className="a-stat-value" style={{ fontSize: '1.5rem', color: 'var(--a-red)' }}>{blockedCount}</div>
            </div>
            <div className="a-stat" style={{ minWidth: 110 }}>
              <div className="a-stat-label">Reserved</div>
              <div className="a-stat-value" style={{ fontSize: '1.5rem', color: 'var(--a-amber)' }}>{reservedCount}</div>
            </div>
          </div>

          {dates.length > 0 && (
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--a-text-2)', marginBottom: 8 }}>All blocked dates</p>
              <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[...dates].sort((a, b) => a.date.localeCompare(b.date)).map((d) => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '6px 10px', borderRadius: 6, background: 'var(--a-surface-2)' }}>
                    <span style={{ fontSize: '0.82rem', color: d.dateType === 'reserved' ? 'var(--a-amber)' : 'var(--a-red)' }}>
                      {d.date}
                    </span>
                    <button
                      className="btn-a btn-ghost-a"
                      style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                      onClick={async () => {
                        await fetch(`/api/admin/properties/${propertyId}/calendar`, {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ date: d.date }),
                        });
                        setDates((prev) => prev.filter((e) => e.id !== d.id));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
