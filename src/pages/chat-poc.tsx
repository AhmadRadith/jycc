import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { getSessionUserFromCookies } from "@/lib/session";

type ChatMessage = {
  _id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  text?: string;
  imageData?: string;
  createdAt: string;
};

type ChatPocProps = {
  currentUser: {
    id: string;
    username: string;
  };
};

const POLL_INTERVAL_MS = 2000;

export default function ChatPocPage({ currentUser }: ChatPocProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const ticketId = useMemo(() => "tiket-0", []);

  const loadMessages = async () => {
    try {
      const response = await fetch(
        `/api/chat/messages?ticketId=${encodeURIComponent(ticketId)}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to load messages");
      }
      setMessages(data.messages ?? []);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load messages";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMessages();
    const id = window.setInterval(() => {
      void loadMessages();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [ticketId]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  };

  const toBase64 = (selectedFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Unsupported file result"));
        }
      };
      reader.onerror = () =>
        reject(reader.error || new Error("Failed to read file"));
      reader.readAsDataURL(selectedFile);
    });
  };

  const handleSend = async () => {
    if (!text.trim() && !file) {
      return;
    }
    setSending(true);
    try {
      let imageData: string | undefined;
      if (file) {
        imageData = await toBase64(file);
      }

      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          text: text.trim(),
          imageData,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data?.error || "Failed to send message");
      }

      setText("");
      setFile(null);
      await loadMessages();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send message";
      setError(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-3xl surface-panel rounded-xl shadow-lg flex flex-col overflow-hidden">
        <header className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h1 className="text-lg font-semibold text-slate-800">Chat POC</h1>
            <p className="text-xs text-slate-500">
              Ticket ID: <span className="font-mono">tiket-0</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Logged in as</p>
            <p className="text-sm font-medium text-slate-800">
              @{currentUser.username}
            </p>
          </div>
        </header>

        <main className="flex-1 flex flex-col bg-white">
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {loading && (
              <p className="text-sm text-slate-500">Loading messages…</p>
            )}
            {!loading && messages.length === 0 && (
              <p className="text-sm text-slate-400">
                No messages yet. Start the conversation!
              </p>
            )}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1">
                {error}
              </p>
            )}
            {messages.map((message) => {
              const isOwn = message.senderId === currentUser.id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                      isOwn
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-900 rounded-bl-none"
                    }`}
                  >
                    <div className="text-[11px] font-semibold mb-0.5 opacity-80">
                      {isOwn ? "You" : message.senderName}
                    </div>
                    {message.text && (
                      <p className="whitespace-pre-wrap break-words mb-1">
                        {message.text}
                      </p>
                    )}
                    {message.imageData && (
                      <div className="mt-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={message.imageData}
                          alt="Attached"
                          className="max-h-48 rounded border border-slate-200 bg-white"
                        />
                      </div>
                    )}
                    <div className="mt-1 text-[10px] opacity-70 text-right">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex flex-col gap-2">
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Type a message…"
                rows={2}
                className="w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center px-2 py-1 text-xs border border-slate-300 rounded-md bg-white cursor-pointer hover:bg-slate-100">
                    <span className="mr-1">
                      <i className="fa-regular fa-image" />
                    </span>
                    <span>{file ? file.name : "Attach image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {file && (
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-[11px] text-slate-500 hover:text-slate-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || (!text.trim() && !file)}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ChatPocProps>> {
  const user = getSessionUserFromCookies(context.req?.headers?.cookie);

  if (!user) {
    const nextPath = encodeURIComponent("/chat-poc");
    return {
      redirect: {
        destination: `/login?next=${nextPath}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      currentUser: {
        id: user.id,
        username: user.username,
      },
    },
  };
}
