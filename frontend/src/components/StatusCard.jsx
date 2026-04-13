const colorStyles = {
  green: {
    dot: "bg-emerald-400",
    badge: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  },
  yellow: {
    dot: "bg-yellow-400",
    badge: "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",
  },
  red: {
    dot: "bg-red-400",
    badge: "border-red-400/20 bg-red-500/10 text-red-300",
  },
};

function StatusCardItem({ title, status, color }) {
  const styles = colorStyles[color] ?? colorStyles.green;

  return (
    <section className="rounded-2xl border border-white/10 bg-gray-800/70 p-4 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-lg font-semibold text-white">{status}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-gray-900/80 px-3 py-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
          <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.2em] ${styles.badge}`}>
            {color}
          </span>
        </div>
      </div>
    </section>
  );
}

function StatusCard({ data }) {
  if (!data) {
    return null;
  }

  const cards = [
    {
      title: "Glare Detection",
      status: data.glare ? "Detected" : "Clear",
      color: data.glare ? "yellow" : "green",
    },
    {
      title: "Pothole Detection",
      status: data.pothole ? "Detected" : "Clear",
      color: data.pothole ? "red" : "green",
    },
    {
      title: "System Status",
      status: data?.decision || "Safe",
      color:
        data?.pothole
          ? "red"
          : data?.pedestrian || data?.glare || data?.decision === "Caution" || data?.decision === "Warning"
            ? "yellow"
            : "green",
    },
  ];

  return cards.map((card) => (
    <StatusCardItem
      key={card.title}
      title={card.title}
      status={card.status}
      color={card.color}
    />
  ));
}

export default StatusCard;
