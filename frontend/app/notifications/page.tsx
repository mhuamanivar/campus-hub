"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useNotifications, useMarkRead, useMarkAllRead } from "@/hooks/useNotifications";
import { Bell, CheckCheck, Calendar, MessageCircle, Wrench, BookOpen } from "lucide-react";

const TYPE_ICON: Record<string, typeof Bell> = {
  EVENT_REGISTRATION: Calendar,
  EVENT_REMINDER:     Calendar,
  EVENT_CANCELLED:    Calendar,
  NEW_MESSAGE:        MessageCircle,
  SERVICE_REQUEST:    Wrench,
  LOAN_DUE:           BookOpen,
  COMMENT_REPLY:      MessageCircle,
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return "ahora mismo";
  if (m < 60)  return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
}

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications(50);
  const markRead    = useMarkRead();
  const markAllRead = useMarkAllRead();

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Bell size={36} className="text-blue-600" /> Notificaciones
            </h1>
            {unread > 0 && <p className="text-slate-500 mt-1">{unread} sin leer</p>}
          </div>
          {unread > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 px-4 py-2 rounded-xl transition"
            >
              <CheckCheck size={15} /> Marcar todo como leído
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse"/>)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Bell size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-xl font-medium">Sin notificaciones</p>
            <p className="text-sm mt-1">Te avisaremos cuando haya novedades</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = TYPE_ICON[n.type] ?? Bell;
              return (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markRead.mutate(n.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-colors ${
                    n.isRead ? "bg-white border border-slate-100" : "bg-blue-50 border border-blue-100"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    n.isRead ? "bg-slate-100" : "bg-blue-100"
                  }`}>
                    <Icon size={18} className={n.isRead ? "text-slate-400" : "text-blue-600"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${n.isRead ? "text-slate-600" : "text-slate-900"}`}>{n.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{n.body}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-xs text-slate-400">{timeAgo(n.createdAt)}</span>
                    {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
