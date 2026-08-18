export default function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-soft">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-snrc-blue/20 border-t-snrc-blue" />
        <p className="font-medium text-snrc-blue">Chargement...</p>
      </div>
    </div>
  );
}
