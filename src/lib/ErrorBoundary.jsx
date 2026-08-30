import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass rounded-[2rem] p-8 max-w-md w-full text-center">
          <span className="ic-badge xl zi mx-auto"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3 2 20h20L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" /><circle cx="12" cy="15" r="1.1" fill="currentColor" /><path d="M12 8v4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span>
          <h1 className="text-lg font-black tracking-tight mt-5">Terjadi kesalahan</h1>
          <p className="text-sm text-ink-2 mt-1.5 leading-relaxed">Aplikasi sempat gagal render. Muat ulang untuk kembali, atau cek konsol browser untuk detail error.</p>
          <button className="btn-primary w-full justify-center mt-5" onClick={() => window.location.reload()}>
            Muat ulang halaman
          </button>
        </div>
      </div>
    );
  }
}