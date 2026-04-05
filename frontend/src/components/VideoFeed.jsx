function VideoFeed() {
  return (
    <section className="w-full rounded-2xl border border-white/10 bg-gray-800/70 p-5 shadow-xl shadow-black/20 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Monitoring
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Live Camera Feed
          </h2>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          Live
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-gray-900/80">
        <div className="aspect-video w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
          <img
            src="http://127.0.0.1:5000/video_feed"
            alt="Live Feed"
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default VideoFeed;
