import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatSuggestions from './ChatSuggestions';
import ChatInput from './ChatInput';

const INITIAL_MESSAGE = {
  id: 'welcome-msg',
  role: 'model',
  text: 'Halo, saya Nusa — asisten Toko Nusantara. Tanyakan soal produk, harga, ketersediaan stok, atau kebijakan toko, dan saya bantu carikan informasinya.',
  timestamp: new Date().toISOString(),
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ChatBot({
  apiUrl,
  initialOpen = false,
  position = 'bottom-right',
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const sendMessageRef = useRef(null);

  // Single network attempt. Throws an Error carrying { status, isNetwork }.
  const requestAnswer = async (history) => {
    const endpoint = apiUrl || import.meta.env.VITE_API_URL || '/api/chat';
    const request = (url) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: history }),
      });

    let response;
    try {
      response = await request(endpoint);
    } catch {
      // Relative path via dev proxy failed; try the backend directly.
      if (endpoint.startsWith('/')) {
        try {
          response = await request(`http://localhost:3000${endpoint}`);
        } catch {
          const err = new Error('network');
          err.isNetwork = true;
          throw err;
        }
      } else {
        const err = new Error('network');
        err.isNetwork = true;
        throw err;
      }
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok || !data.success) {
      const err = new Error(data.message || 'Permintaan gagal diproses.');
      err.status = response.status;
      throw err;
    }

    return data;
  };

  const sendMessage = async (textToSend) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const conversationForApi = newMessages
      .filter((m) => !m.isError)
      .map((m) => ({ role: m.role === 'model' ? 'model' : 'user', text: m.text }));

    const firstUserIndex = conversationForApi.findIndex((m) => m.role === 'user');
    const validHistory =
      firstUserIndex !== -1 ? conversationForApi.slice(firstUserIndex) : [userMessage];

    try {
      const maxTries = 2;
      let answer;

      for (let attempt = 1; attempt <= maxTries; attempt++) {
        try {
          answer = await requestAnswer(validHistory);
          break;
        } catch (err) {
          const retryable = err.isNetwork || err.status === 503 || err.status === 429;
          if (attempt < maxTries && retryable) {
            await sleep(900 * attempt);
            continue;
          }
          throw err;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: answer?.results || 'Maaf, saya tidak dapat memproses jawaban saat ini.',
          products: Array.isArray(answer?.products) ? answer.products : [],
          timestamp: new Date().toISOString(),
        },
      ]);

      if (!isOpen) {
        setUnreadCount((count) => count + 1);
      }
    } catch (err) {
      console.error('Chat error:', err);

      const looksLikeRawJson = typeof err.message === 'string' && err.message.trim().startsWith('{');
      const text = err.isNetwork
        ? 'Tidak dapat terhubung ke server AI. Pastikan backend berjalan di port 3000, lalu coba lagi.'
        : looksLikeRawJson
          ? 'Asisten AI sedang sibuk. Silakan coba lagi sebentar lagi.'
          : err.message || 'Maaf, asisten AI sedang sibuk. Silakan coba lagi sebentar lagi.';

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text,
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      sendMessage(lastUserMessage.text);
    }
  };

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
    setUnreadCount(0);
  };

  const handleReset = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput('');
  };

  // Keep the ref pointing at the latest sendMessage without resubscribing.
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  });

  // Scroll to the newest message.
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [isOpen, messages, isLoading]);

  // Allow other parts of the app to open the chat (optionally with a prompt).
  useEffect(() => {
    const handleOpen = (event) => {
      setIsOpen(true);
      setUnreadCount(0);
      if (event.detail?.prompt) {
        setTimeout(() => sendMessageRef.current?.(event.detail.prompt), 100);
      }
    };
    window.addEventListener('open-chat-bot', handleOpen);
    return () => window.removeEventListener('open-chat-bot', handleOpen);
  }, []);

  const positionClass =
    position === 'bottom-left'
      ? 'left-4 sm:left-6 bottom-4 sm:bottom-6'
      : 'right-4 sm:right-6 bottom-4 sm:bottom-6';

  return (
    <aside
      aria-label="Asisten Chat AI"
      className={`fixed ${positionClass} z-50 flex flex-col items-end pointer-events-none`}
    >
      {isOpen && (
        <section
          aria-label="Jendela Chatbot Nusa"
          className={`pointer-events-auto mb-3 flex flex-col overflow-hidden rounded-2xl border border-line bg-cream-50 shadow-[0_20px_60px_-20px_rgba(74,66,53,0.28)] transition-all duration-300 ease-in-out ${
            isExpanded
              ? 'h-[85vh] w-[95vw] max-w-[560px] sm:h-[720px] sm:w-[560px]'
              : 'h-[580px] max-h-[calc(100vh-6rem)] w-[92vw] max-w-[420px] sm:w-[410px]'
          }`}
        >
          <ChatHeader
            onClose={() => setIsOpen(false)}
            onReset={handleReset}
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded((prev) => !prev)}
            isLoading={isLoading}
          />

          <div className="chat-scrollbar flex-1 overflow-y-auto bg-cream-50 px-4 py-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRetry={message.isError ? handleRetryLastMessage : undefined}
              />
            ))}

            {messages.length === 1 && (
              <ChatSuggestions onSelect={(prompt) => sendMessage(prompt)} disabled={isLoading} />
            )}

            {isLoading && (
              <div className="my-3 flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">
                  N
                </div>
                <div className="flex items-center gap-2 pt-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted" />
                  <span className="ml-1 text-xs text-ink-soft">Nusa sedang menyiapkan jawaban</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <ChatInput
            input={input}
            setInput={setInput}
            onSend={() => sendMessage()}
            isLoading={isLoading}
            placeholder="Tanya produk, harga, atau pengiriman..."
          />
        </section>
      )}

      <div className="pointer-events-auto flex items-center gap-3">
        {!isOpen && (
          <button
            type="button"
            onClick={handleToggleOpen}
            className="hidden items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-ink sm:flex"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>Tanya Nusa</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleToggleOpen}
          aria-label={isOpen ? 'Tutup obrolan' : 'Buka obrolan dengan Nusa AI'}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_10px_30px_-10px_rgba(255,79,0,0.55)] transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/25"
        >
          {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-6 w-6" />}

          {!isOpen && unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
