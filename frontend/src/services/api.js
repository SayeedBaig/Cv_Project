export async function getDetectionData() {
  const response = await fetch("http://localhost:5000/api/detect");
  return await response.json();
}
