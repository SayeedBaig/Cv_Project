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

  const alertClasses =
    alert.color === "red"
      ? "border-red-500/30 bg-red-500/10"
      : alert.color === "yellow"
        ? "border-yellow-500/30 bg-yellow-500/10"
        : "border-green-500/30 bg-green-500/10";

  const dotClasses =
    alert.color === "red"
      ? "bg-red-500"
      : alert.color === "yellow"
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className={`rounded-xl border p-4 ${alertClasses}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-white">{alert.title}</p>
          <p className="text-sm text-gray-400">{alert.desc}</p>
        </div>

        {alert.blink ? (
          <div className={`h-3 w-3 rounded-full ${dotClasses} animate-ping`} />
        ) : (
          <div className={`h-3 w-3 rounded-full ${dotClasses}`} />
        )}
      </div>
    </div>
  );
}

export default AlertsPanel;
