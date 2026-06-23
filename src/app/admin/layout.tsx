import type { ReactNode } from 'react';
import './admin.css';
import SessionProviderWrapper from '@/components/admin/SessionProviderWrapper';

export const metadata = { title: { default: 'Admin — Ku Náay', template: '%s — Admin' } };

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <SessionProviderWrapper>{children}</SessionProviderWrapper>;
}
