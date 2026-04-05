import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import VideoFeed from "../components/VideoFeed";
import ImageUpload from "../components/ImageUpload";
import VideoUpload from "../components/VideoUpload";
import AlertsPanel from "../components/AlertsPanel";
import RecommendationsPanel from "../components/RecommendationsPanel";
import StatusCard from "../components/StatusCard";
import { getDetectionData } from "../services/api";

function Dashboard() {
  const [liveData, setLiveData] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("live");
  const username = localStorage.getItem("user") || "Guest";

  const displayData = mode === "live" ? liveData : uploadData;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    if (mode !== "live") {
      fetch("http://localhost:5000/api/stop-camera").catch(() => {});
    }
  }, [mode]);

  useEffect(() => {
    let isActive = true;
    const releaseLiveCamera = () => {
      fetch("http://localhost:5000/api/stop-camera").catch(() => {});
    };

    const fetchData = async () => {
      try {
        const res = await getDetectionData();
        if (isActive) {
          setLiveData(res);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    if (mode !== "live") {
      releaseLiveCamera();
      return () => {
        isActive = false;
        releaseLiveCamera();
      };
    }

    setLoading(true);
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => {
      isActive = false;
      clearInterval(interval);
      releaseLiveCamera();
    };
  }, [mode]);

  if (mode === "live" && loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
          <Navbar username={username} onLogout={handleLogout} />

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              <main className="rounded-3xl border border-white/10 bg-gray-900/80 p-4 shadow-2xl shadow-black/30 ring-1 ring-white/5 backdrop-blur sm:p-6 lg:p-8">
                <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/10 bg-gray-800/60 px-6 py-16 text-lg font-medium text-gray-300">
                  Loading...
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "live" && !liveData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
          <Navbar username={username} onLogout={handleLogout} />

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              <main className="rounded-3xl border border-white/10 bg-gray-900/80 p-4 shadow-2xl shadow-black/30 ring-1 ring-white/5 backdrop-blur sm:p-6 lg:p-8">
                <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-white/10 bg-gray-800/60 px-6 py-16 text-lg font-medium text-gray-300">
                  No data available
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <Navbar username={username} onLogout={handleLogout} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <main className="rounded-3xl border border-white/10 bg-gray-900/80 p-4 shadow-2xl shadow-black/30 ring-1 ring-white/5 backdrop-blur sm:p-6 lg:p-8">
              <div className="mb-4 flex flex-wrap gap-3">
                {["live", "image", "video"].map((value) => {
                  const isActive = mode === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMode(value)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                        isActive
                          ? "bg-emerald-500 text-gray-950 shadow-lg shadow-emerald-900/30"
                          : "border border-white/10 bg-gray-800/80 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatusCard data={displayData} />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="grid gap-4">
                  {mode === "live" && <VideoFeed />}
                  {mode === "image" && <ImageUpload onResult={setUploadData} />}
                  {mode === "video" && <VideoUpload onResult={setUploadData} />}
                </div>
                <AlertsPanel data={displayData} />
              </div>

              <div className="mt-4">
                <RecommendationsPanel data={displayData} />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
