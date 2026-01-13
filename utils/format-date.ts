export default function formatDateISO(value: number) {
  try {
    return new Date(value).toISOString().split("T")[0];
  }
  catch {
    return "";
  }
}
