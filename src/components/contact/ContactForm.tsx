'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { agents } from '@/data/agents';

export default function ContactForm() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const email = fd.get('email') as string;
    const subject = fd.get('subject') as string;
    const message = fd.get('message') as string;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:carolina@kunaay.com?subject=${encodeURIComponent(subject || 'Inquiry from website')}&body=${encodeURIComponent(body)}`;
    setStatus('sent');
  };

  return (
    <section style={{ paddingTop: '4rem' }}>
      <div className="contact-grid">
        <div className="contact-cards">
          {agents.map((agent) => (
            <div key={agent.id} className="contact-card animate-in">
              <h2>{agent.name}</h2>
              <a href={`mailto:${agent.email}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: '6px' }}>
                  <use href="#i-mail" />
                </svg>
                {agent.email}
              </a>
              <a href={agent.whatsapp} className="whatsapp-link" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-2px', marginRight: '6px' }}>
                  <use href="#i-chat" />
                </svg>
                {agent.whatsappDisplay} (WhatsApp)
              </a>
            </div>
          ))}
        </div>

        <form className="contact-form animate-in" onSubmit={handleSubmit} noValidate>
          <h3>{t('Request Information')}</h3>
          <div className="form-group">
            <label htmlFor="name">{t('Name')}</label>
            <input type="text" id="name" name="name" autoComplete="name" placeholder={t('Your full name')} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">{t('Email')}</label>
            <input type="email" id="email" name="email" autoComplete="email" placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">{t('Subject')}</label>
            <input type="text" id="subject" name="subject" placeholder={t('How can we help?')} />
          </div>
          <div className="form-group">
            <label htmlFor="message">{t('Message')}</label>
            <textarea id="message" name="message" placeholder={t('Tell us about your ideal stay...')} required />
          </div>
          <div className="form-submit">
            <button type="submit" className="btn-primary">
              {t('Submit Request')}{' '}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <use href="#i-arrow-right" />
              </svg>
            </button>
          </div>
          {status === 'sent' && (
            <p className="form-status" role="status">
              {t('Thank you! Your message has been sent.')}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
