import type { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="a-shell">
      <AdminSidebar />
      <div className="a-main">
        {children}
      </div>
    </div>
  );
}
