"use client";

import { useState } from "react";
import { useComments, useAddComment, useDeleteComment, type ApiComment } from "@/hooks/useComments";
import { useAuth } from "@/components/auth/AuthContext";
import { MessageCircle, Trash2, Reply } from "lucide-react";

interface Props { readonly eventId: string }

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "ahora mismo";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  return `hace ${Math.floor(h / 24)}d`;
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

function CommentItem({
  comment,
  currentUserId,
  eventId,
  depth = 0,
}: {
  comment: ApiComment;
  currentUserId?: string;
  eventId: string;
  depth?: number;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const addComment = useAddComment(eventId);
  const deleteComment = useDeleteComment(eventId);

  const handleReply = async () => {
    if (!replyBody.trim()) return;
    await addComment.mutateAsync({ body: replyBody.trim(), parentId: comment.id });
    setReplyBody("");
    setReplyOpen(false);
  };

  return (
    <div className={depth > 0 ? "ml-9 border-l-2 border-slate-100 pl-4" : ""}>
      <div className="flex gap-3">
        <Avatar name={comment.userName} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm text-slate-800">{comment.userName}</span>
            <span className="text-xs text-slate-400">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{comment.body}</p>
          <div className="flex items-center gap-3 mt-1.5">
            {depth === 0 && currentUserId && (
              <button
                onClick={() => setReplyOpen((v) => !v)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 transition-colors"
              >
                <Reply size={12} /> Responder
              </button>
            )}
            {currentUserId === comment.userId && (
              <button
                onClick={() => deleteComment.mutate(comment.id)}
                disabled={deleteComment.isPending}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={12} /> Eliminar
              </button>
            )}
          </div>

          {replyOpen && (
            <div className="mt-2 flex gap-2">
              <input
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleReply()}
                placeholder="Escribe una respuesta..."
                className="flex-1 border border-slate-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleReply}
                disabled={!replyBody.trim() || addComment.isPending}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-xl text-sm font-medium transition-colors"
              >
                Enviar
              </button>
            </div>
          )}
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              eventId={eventId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentSection({ eventId }: Props) {
  const { user } = useAuth();
  const [body, setBody] = useState("");
  const { data: comments = [], isLoading } = useComments(eventId);
  const addComment = useAddComment(eventId);

  const handleSubmit = async () => {
    if (!body.trim()) return;
    await addComment.mutateAsync({ body: body.trim() });
    setBody("");
  };

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-6">
        <MessageCircle size={20} />
        Comentarios {comments.length > 0 && <span className="text-slate-400 font-normal text-base">({comments.length})</span>}
      </h2>

      {user && (
        <div className="flex gap-3 mb-6">
          <Avatar name={user.name} />
          <div className="flex-1 flex gap-2">
            <input
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
              placeholder="Escribe un comentario..."
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              onClick={handleSubmit}
              disabled={!body.trim() || addComment.isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Comentar
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/4" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">
          Sé el primero en comentar este evento
        </p>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
              eventId={eventId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
