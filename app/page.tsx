export default function HomePage() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 bg-brand/10 text-brand text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full border border-brand/20 mb-3">
          Fresh & Hot, Just for You
        </span>
        <h1 className="text-4xl font-black text-text-main">
          Delicious Food, <span className="text-brand">Delivered</span> In Minutes
        </h1>
        <p className="text-muted text-sm mt-4 max-w-md mx-auto">
          Next.js + TypeScript migration in progress — M1 bootstrap complete.
        </p>
      </div>
    </main>
  );
}
