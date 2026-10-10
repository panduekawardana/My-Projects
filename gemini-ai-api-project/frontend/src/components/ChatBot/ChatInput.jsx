import { useRef, useEffect } from 'react';
import { Send, Loader2, X } from 'lucide-react';

export default function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
  placeholder = 'Tulis pertanyaan Anda...',
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="border-t border-line bg-cream-50 p-3">
      <div className="flex items-end gap-2 rounded-xl border border-line bg-white px-3 py-2 transition-colors focus-within:border-ink/30">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className="max-h-32 w-full resize-none bg-transparent text-sm leading-relaxed text-ink outline-none placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-50"
        />

        {input && !isLoading && (
          <button
            type="button"
            onClick={() => setInput('')}
            title="Hapus teks"
            className="mb-0.5 flex-shrink-0 rounded p-1 text-ink-muted transition-colors hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          aria-label="Kirim pesan"
          className="mb-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:bg-cream-200 disabled:text-ink-muted"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-ink-muted">
        <span>Enter untuk kirim</span>
        <span>Shift + Enter baris baru</span>
      </div>
    </div>
  );
}
