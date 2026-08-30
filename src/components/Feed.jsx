import { Pi } from './bits';

export function FeedRow({ f, highlight }) {
  return (
    <div className={`row-hover flex items-start gap-3.5 px-2 py-2.5 ${highlight ? 'feed-new' : ''}`}>
      <span className={`feed-ico tone-${f.tone}`}><Pi n={f.ico} s="md" /></span>
      <div className="min-w-0">
        <p className="text-sm leading-snug">{f.txt}</p>
        <p className="font-mono text-[11px] text-ink-3 mt-1">{f.t}</p>
      </div>
    </div>
  );
}