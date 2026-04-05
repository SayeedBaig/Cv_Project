import { useState } from "react";

function ImageUpload({ onResult }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:5000/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setResult(null);
        setImage(null);
        onResult?.(null);
        setError(data.message || "Image upload failed.");
        return;
      }

      setResult(data.data);
      setImage(data.image);
      onResult?.(data.data);
    } catch {
      setError("Unable to upload image. Please try again.");
      setResult(null);
      setImage(null);
      onResult?.(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-gray-800/70 p-5 shadow-xl shadow-black/20 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-400">
          Snapshot Check
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Image Upload Detection
        </h2>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full rounded-2xl border border-gray-700 bg-gray-900/80 px-4 py-3 text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-950 hover:file:bg-emerald-400"
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-emerald-900/30 transition duration-200 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="rounded-2xl border border-white/10 bg-gray-900/80 p-4">
            <div className="grid gap-3 text-sm text-gray-300">
              <div>
                <span className="font-semibold text-white">Decision:</span>{" "}
                {result.decision}
              </div>
              <div>
                <span className="font-semibold text-white">
                  Recommendation:
                </span>{" "}
                {result.recommendation}
              </div>
              <div>
                <span className="font-semibold text-white">
                  Detected Objects:
                </span>{" "}
                {result.objects?.length
                  ? result.objects.map((obj) => obj.label).join(", ")
                  : "None"}
              </div>
            </div>

            {image && (
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt="Processed upload"
                className="mt-4 rounded-xl"
              />
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default ImageUpload;
