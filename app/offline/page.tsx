export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#08091a] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div
          className="w-20 h-20 rounded-2xl bg-cyan-400/10 border border-cyan-400/20
                        flex items-center justify-center mx-auto mb-6"
        >
          <span className="text-4xl">📡</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-3">Hors ligne</h1>
        <p className="text-slate-400 leading-relaxed mb-8">
          Tu es sans connexion. Les pages déjà visitées restent accessibles.
          Reconnecte-toi pour accéder au contenu complet.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-cyan-400 text-[#08091a]
                     font-bold text-sm hover:bg-cyan-300 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
