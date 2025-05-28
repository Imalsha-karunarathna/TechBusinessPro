export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3069FE] mb-4"></div>
        <p className="text-gray-600">Loading reset page...</p>
      </div>
    </div>
  );
}
