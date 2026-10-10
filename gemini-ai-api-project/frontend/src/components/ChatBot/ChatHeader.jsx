import { RotateCcw, Maximize2, Minimize2, X } from 'lucide-react';

export default function ChatHeader({
  onClose,
  onReset,
  isExpanded,
  onToggleExpand,
  isLoading,
}) {
  const iconButton =
    'p-2 rounded-md text-ink-soft transition-colors hover:bg-cream-200 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <header className="flex h-14 items-center justify-between border-b border-line bg-cream-50 px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
          N
        </div>
        <div>
          <p className="text-sm font-medium leading-tight text-ink">Nusa</p>
          <p className="flex items-center gap-1.5 text-xs text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Asisten Toko Nusantara
          </p>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          title="Mulai percakapan baru"
          className={iconButton}
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          title={isExpanded ? 'Perkecil ukuran' : 'Perbesar ukuran'}
          className={`hidden sm:inline-flex ${iconButton}`}
        >
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>

        <button type="button" onClick={onClose} title="Tutup chat" className={iconButton}>
          <X className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
