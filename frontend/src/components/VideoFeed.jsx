import { useEffect, useState } from "react";

function VideoFeed({ sceneMode = "driving" }) {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isLive) {
      fetch("http://localhost:5000/api/stop-camera").catch(() => {});
    }
  }, [isLive]);

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-gray-800/70 p-5 shadow-xl shadow-black/20 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Monitoring
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Live Camera Feed
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsLive(true)}
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-gray-950 transition hover:bg-emerald-400"
          >
            Start Live
          </button>
          <button
            type="button"
            onClick={() => setIsLive(false)}
            className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            Stop Live
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-gray-900/80">
        <div className="aspect-video">
          {isLive ? (
            <img
              src={`http://127.0.0.1:5000/video_feed?mode=${sceneMode}`}
              alt="Live Feed"
              className="h-full w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-gray-400">
              Click "Start Live" to begin the camera feed.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default VideoFeed;
