import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Check, Copy, AlertCircle, RotateCcw } from 'lucide-react';

const formatRupiah = (number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);

function ProductCards({ products }) {
  if (!products?.length) return null;

  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {products.map((product) => (
        <div
          key={product.id}
          className="overflow-hidden rounded-xl border border-line bg-white"
        >
          <div className="aspect-square w-full overflow-hidden bg-cream-200">
            <img
              src={product.image}
              alt={product.imageAlt || product.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-2.5">
            <p className="line-clamp-2 text-xs font-medium leading-snug text-ink">
              {product.name}
            </p>
            <div className="mt-1.5 flex items-baseline justify-between gap-1">
              <span className="text-xs font-semibold text-ink">
                {formatRupiah(product.price)}
              </span>
              <span className="text-[10px] text-ink-muted">Stok {product.stock}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChatMessage({ message, onRetry }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  if (message.isError) {
    return (
      <div className="my-3 flex items-start gap-2.5 rounded-lg border border-line bg-accent-soft px-3.5 py-3">
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
        <div className="text-sm leading-relaxed text-ink">
          <p>{message.text}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Coba lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="my-3 flex justify-end">
        <div className="max-w-[80%]">
          <div className="whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-cream-200 px-3.5 py-2 text-sm leading-relaxed text-ink">
            {message.text}
          </div>
          {formattedTime && (
            <div className="mt-1 text-right text-[10px] text-ink-muted">{formattedTime}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group my-3 flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">
        N
      </div>
      <div className="min-w-0 flex-1">
        <div className="md break-words text-sm text-ink">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
        <ProductCards products={message.products} />
        <div className="mt-1 flex items-center gap-2 text-[10px] text-ink-muted">
          {formattedTime && <span>{formattedTime}</span>}
          <button
            type="button"
            onClick={handleCopy}
            title="Salin pesan"
            className="rounded opacity-0 transition-opacity hover:text-ink group-hover:opacity-100"
          >
            {copied ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-600">
                <Check className="h-3 w-3" /> Tersalin
              </span>
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
