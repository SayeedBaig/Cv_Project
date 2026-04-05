function AlertsPanel({ data }) {
  if (!data) {
    return null;
  }

  const alert = data.pothole
    ? {
        title: "Pothole Ahead",
        desc: "Road damage detected. Reduce speed immediately.",
        color: "red",
        blink: true,
      }
    : data.pedestrian
      ? {
          title: "Pedestrian Detected",
          desc: "Slow down and prepare to stop.",
          color: "yellow",
          blink: true,
        }
      : data.glare
        ? {
            title: "High Glare",
            desc: "Visibility reduced. Use low beam.",
            color: "yellow",
            blink: false,
          }
        : {
            title: "All Clear",
            desc: "No hazards detected.",
            color: "green",
            blink: false,
          };

  return (
    <div
      className={`rounded-xl border bg-gray-900 p-4 ${
        alert.color === "red"
          ? "border-red-500/30"
          : alert.color === "yellow"
            ? "border-yellow-500/30"
            : "border-green-500/30"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-white">{alert.title}</p>
          <p className="text-sm text-gray-400">{alert.desc}</p>
        </div>

        {alert.blink && (
          <div className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
        )}
      </div>
    </div>
  );
}

export default AlertsPanel;
