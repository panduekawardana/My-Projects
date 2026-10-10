import { Smartphone, Laptop, Truck, ShieldCheck } from 'lucide-react';

const SUGGESTIONS = [
  {
    label: 'Rekomendasi smartphone 2 jutaan',
    prompt: 'Rekomendasikan smartphone dengan harga sekitar 2 jutaan di Toko Nusantara.',
    icon: Smartphone,
  },
  {
    label: 'Laptop untuk kerja kantoran',
    prompt: 'Ada produk laptop apa saja yang cocok untuk kerja kantoran?',
    icon: Laptop,
  },
  {
    label: 'Info pengiriman & kurir',
    prompt: 'Bagaimana opsi dan estimasi pengiriman barang di Toko Nusantara?',
    icon: Truck,
  },
  {
    label: 'Kebijakan retur & garansi',
    prompt: 'Bagaimana syarat dan cara retur barang jika produk rusak?',
    icon: ShieldCheck,
  },
];

export default function ChatSuggestions({ onSelect, disabled }) {
  return (
    <div className="py-2">
      <p className="mb-2 text-xs font-medium text-ink-muted">Pertanyaan populer</p>
      <div className="flex flex-col gap-1.5">
        {SUGGESTIONS.map((item) => (
          <button
            key={item.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.prompt)}
            className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2 text-left text-xs text-ink-soft transition-colors hover:border-ink/25 hover:bg-cream-100 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <item.icon className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
