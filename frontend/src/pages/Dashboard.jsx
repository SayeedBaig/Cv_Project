import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import VideoFeed from "../components/VideoFeed";
import StatusCard from "../components/StatusCard";

function Dashboard() {
  const [data, setData] = useState({
    alert: "",
    recommendation: "",
    detections: [],
    pothole: false,
    pedestrian: false,
    glare: false,
    decision: "Safe",
  });
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("live");
  const [sceneMode, setSceneMode] = useState("driving");
  const [mediaPreview, setMediaPreview] = useState("");
  const username = localStorage.getItem("user") || "Guest";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", sceneMode);
    setMediaPreview("");

    fetch("http://localhost:5000/api/detect-image", {
      method: "POST",
      body: formData,
    })
      .then((res) =>
        res.status === 404
          ? fetch("http://localhost:5000/api/upload-image", {
              method: "POST",
              body: formData,
            })
          : res
      )
      .then((res) => res.json())
      .then((res) => {
        const result = res.data || res;
        setData((current) => ({
          ...current,
          ...result,
          alert: result.alert || result.alerts?.[0] || "",
          detections:
            result.detections ||
            result.objects?.map((obj) => obj.label) ||
            current.detections,
        }));

        if (res.image) {
          setMediaPreview(`data:image/jpeg;base64,${res.image}`);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", sceneMode);
    setMediaPreview("");

    fetch("http://localhost:5000/api/detect-video", {
      method: "POST",
      body: formData,
    })
      .then((res) =>
        res.status === 404
          ? fetch("http://localhost:5000/api/upload-video", {
              method: "POST",
              body: formData,
            })
          : res
      )
      .then((res) => res.json())
      .then((res) => {
        const result = res.data || res.summary || {};

        setData((current) => ({
          ...current,
          ...result,
          alert:
            res.alert ||
            result.alert ||
            (result.pothole
              ? "Pothole detected ahead"
              : result.pedestrian
                ? "Pedestrian detected"
                : result.glare
                  ? "Glare detected"
                  : ""),
          recommendation:
            res.recommendation ||
            result.recommendation ||
            (result.pothole
              ? "Slow down to avoid damage"
              : result.pedestrian
                ? "Slow down and prepare to stop"
                : result.glare
                  ? "Proceed with caution"
                  : current.recommendation),
          detections:
            res.detections ||
            result.detections ||
            Object.entries(result)
              .filter(([, value]) => value === true)
              .map(([key]) => key),
        }));

        if (res.video_url) {
          setMediaPreview(res.video_url);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (mode !== "live") {
      setLoading(false);
      fetch("http://localhost:5000/api/stop-camera").catch(() => {});
      return;
    }

    setLoading(true);
    fetch(`http://localhost:5000/api/detect?mode=${sceneMode}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("API DATA:", res);
        setData(res);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      fetch(`http://localhost:5000/api/detect?mode=${sceneMode}`)
        .then((res) => res.json())
        .then((res) => {
          console.log("API DATA:", res);
          setData(res);
        })
        .catch((err) => console.error(err));
    }, 1000);

    return () => {
      clearInterval(interval);
      fetch("http://localhost:5000/api/stop-camera").catch(() => {});
    };
  }, [mode, sceneMode]);

  const alerts = [];

  if (data.pothole) {
    alerts.push({
      title: data.alert || "Pothole detected ahead",
      desc: "Road surface damage detected. Reduce speed immediately.",
      border: "border-red-500/30 bg-red-500/10",
      badge: "POTHOLE DETECTED",
      badgeClass: "border-red-500/30 bg-red-500/10 text-red-300",
      dot: "bg-red-400",
    });
  } else if (data.pedestrian) {
    alerts.push({
      title: data.alert || "Pedestrian detected",
      desc: "A pedestrian is near the road. Slow down and prepare to stop.",
      border: "border-yellow-500/30 bg-yellow-500/10",
      badge: "PEDESTRIAN WARNING",
      badgeClass: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
      dot: "bg-yellow-400",
    });
  } else if (data.glare) {
    alerts.push({
      title: data.alert || "High glare detected",
      desc: "Visibility is reduced. Use low beam and stay cautious.",
      border: "border-yellow-500/30 bg-yellow-500/10",
      badge: "GLARE WARNING",
      badgeClass: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
      dot: "bg-yellow-400",
    });
  } else if (data.alert) {
    alerts.push({
      title: data.alert,
      desc: data.recommendation || "No driving action needed.",
      border: "border-sky-500/30 bg-sky-500/10",
      badge: sceneMode === "indoor" ? "INDOOR MODE" : "INFO",
      badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-300",
      dot: "bg-sky-400",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar username={username} onLogout={handleLogout} />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 shadow-2xl">
              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/10 bg-gray-800/60 px-6 py-16 text-lg font-medium text-gray-300">
                Loading...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar username={username} onLogout={handleLogout} />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <main className="rounded-3xl border border-white/10 bg-gray-900/80 p-4 shadow-2xl ring-1 ring-white/5 backdrop-blur sm:p-6 lg:p-8">
            <div className="mb-4 flex gap-3">
              <button
                type="button"
                onClick={() => setMode("live")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  mode === "live"
                    ? "bg-emerald-500 text-gray-950"
                    : "border border-white/10 bg-gray-800/80 text-gray-300"
                }`}
              >
                Live
              </button>
              <button
                type="button"
                onClick={() => setMode("image")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  mode === "image"
                    ? "bg-emerald-500 text-gray-950"
                    : "border border-white/10 bg-gray-800/80 text-gray-300"
                }`}
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => setMode("video")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  mode === "video"
                    ? "bg-emerald-500 text-gray-950"
                    : "border border-white/10 bg-gray-800/80 text-gray-300"
                }`}
              >
                Video
              </button>
            </div>

            <div className="mb-4 flex gap-3">
              <button
                type="button"
                onClick={() => setSceneMode("driving")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  sceneMode === "driving"
                    ? "bg-sky-500 text-gray-950"
                    : "border border-white/10 bg-gray-800/80 text-gray-300"
                }`}
              >
                Driving Mode
              </button>
              <button
                type="button"
                onClick={() => setSceneMode("indoor")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  sceneMode === "indoor"
                    ? "bg-sky-500 text-gray-950"
                    : "border border-white/10 bg-gray-800/80 text-gray-300"
                }`}
              >
                Indoor Mode
              </button>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatusCard data={data} />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-gray-800/70 p-5 shadow-xl shadow-black/20 sm:p-6">
                {mode === "live" && <VideoFeed sceneMode={sceneMode} />}

                {mode === "image" && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                        Monitoring
                      </p>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        Image Upload Detection
                      </h2>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-950 hover:file:bg-emerald-400"
                    />
                    {mediaPreview ? (
                      <img
                        src={mediaPreview}
                        alt="Processed upload"
                        className="rounded-2xl border border-white/10"
                      />
                    ) : null}
                  </div>
                )}

                {mode === "video" && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
                        Monitoring
                      </p>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        Video Upload Detection
                      </h2>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-950 hover:file:bg-emerald-400"
                    />
                    {mediaPreview ? (
                      <video controls className="w-full rounded-2xl border border-white/10">
                        <source src={mediaPreview} type="video/mp4" />
                      </video>
                    ) : null}
                  </div>
                )}
              </div>

              <section className="rounded-2xl border border-white/10 bg-gray-800/70 p-5 shadow-xl shadow-black/20 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                      Incident Summary
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                      Alerts & Warnings
                    </h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-gray-900/80 px-3 py-1 text-xs font-medium text-gray-300">
                    {alerts.length} Active Alerts
                  </span>
                </div>

                {alerts.length > 0 ? (
                  <div className="mt-5 flex flex-col gap-4">
                    {alerts.map((alertItem) => (
                      <article
                        key={alertItem.badge}
                        className={`rounded-2xl border p-4 shadow-lg shadow-black/10 ${alertItem.border}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 gap-3">
                            <span
                              className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${alertItem.dot}`}
                            />
                            <div>
                              <p className="font-semibold text-white">
                                {alertItem.title}
                              </p>
                              <p className="mt-1 text-sm leading-7 text-gray-300">
                                {alertItem.desc}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${alertItem.badgeClass}`}
                          >
                            {alertItem.badge}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>

            <section className="mt-4 rounded-2xl border border-white/10 bg-gray-800/70 p-5 shadow-xl shadow-black/20 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">
                    Guidance
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    Driving Recommendations
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-gray-900/80 px-3 py-1 text-xs font-medium text-gray-300">
                  1 Suggestion
                </span>
              </div>

              {data.recommendation ? (
                <div className="mt-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 shadow-lg shadow-black/10">
                  <p className="text-sm font-semibold leading-6 text-white sm:text-base">
                    {data.recommendation}
                  </p>
                </div>
              ) : null}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
