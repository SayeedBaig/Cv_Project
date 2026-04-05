function RecommendationsPanel({ data }) {
  if (!data) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-gray-800/70 p-5 shadow-xl shadow-black/20">
      <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-4">
        <p className="whitespace-pre-line text-blue-300">
          {data.ai_output || data.recommendation}
        </p>
      </div>
    </div>
  );
}

export default RecommendationsPanel;
