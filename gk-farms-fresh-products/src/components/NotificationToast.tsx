import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {notifications.map((n) => {
        let bgClass = 'bg-emerald-900/90 text-white border-emerald-700';
        let Icon = CheckCircle2;

        if (n.type === 'info') {
          bgClass = 'bg-slate-900/90 text-white border-slate-700';
          Icon = Info;
        } else if (n.type === 'warning') {
          bgClass = 'bg-amber-900/90 text-amber-100 border-amber-700';
          Icon = AlertTriangle;
        } else if (n.type === 'error') {
          bgClass = 'bg-rose-900/90 text-rose-100 border-rose-700';
          Icon = XCircle;
        }

        return (
          <div
            key={n.id}
            id={`notif-toast-${n.id}`}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${bgClass}`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{n.message}</p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="p-1 hover:opacity-75 rounded-lg transition-opacity ml-3"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
