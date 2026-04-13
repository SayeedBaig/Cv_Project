import { useState } from "react";

function VideoUpload({ onResult }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a video first.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      let response = await fetch("http://localhost:5000/api/detect-video", {
        method: "POST",
        body: formData,
      });

      if (response.status === 404) {
        response = await fetch("http://localhost:5000/api/upload-video", {
          method: "POST",
          body: formData,
        });
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        setVideoUrl(null);
        setSummary(null);
        onResult?.(null);
        setError(data.message || "Video upload failed.");
        return;
      }

      setVideoUrl(data.video_url);
      setSummary(data.summary);
      const hasPothole = Boolean(data.summary?.pothole);
      const hasPedestrian = Boolean(data.summary?.pedestrian);
      const hasGlare = Boolean(data.summary?.glare);

      onResult?.({
        ...data.summary,
        alerts: hasPothole
          ? ["Pothole detected ahead"]
          : hasPedestrian
            ? ["Pedestrian detected"]
            : hasGlare
              ? ["Glare detected"]
              : [],
        decision: hasPothole
          ? "Danger"
          : hasPedestrian || hasGlare
            ? "Caution"
            : "Safe",
        recommendation: hasPothole
          ? "Slow down and avoid pothole"
          : hasPedestrian
            ? "Reduce speed and be ready to stop"
            : hasGlare
              ? "Use low beam and maintain distance"
              : "Drive safely and stay alert",
      });
    } catch {
      setVideoUrl(null);
      setSummary(null);
      onResult?.(null);
      setError("Unable to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-gray-800/70 p-5 shadow-xl shadow-black/20 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
          Clip Analysis
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Video Upload Detection
        </h2>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-violet-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-violet-400"
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="rounded-2xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition duration-200 hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {summary ? (
          <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-4 text-sm text-gray-300">
            <div className="grid gap-3">
              <div>
                <span className="font-semibold text-white">Pothole:</span>{" "}
                {summary.pothole ? "Detected" : "Not detected"}
              </div>
              <div>
                <span className="font-semibold text-white">Glare:</span>{" "}
                {summary.glare ? "Detected" : "Not detected"}
              </div>
              <div>
                <span className="font-semibold text-white">Pedestrian:</span>{" "}
                {summary.pedestrian ? "Detected" : "Not detected"}
              </div>
            </div>

            {videoUrl && (
              <video controls autoPlay className="mt-4 rounded-xl">
                <source src={videoUrl} type="video/mp4" />
              </video>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default VideoUpload;
