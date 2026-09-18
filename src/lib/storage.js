import { DEFAULT_WHEELS, STORAGE_KEY } from "@/data/wheelData";

export function loadWheelData() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return {
        wheels: DEFAULT_WHEELS,
        selectedId: DEFAULT_WHEELS[0].id,
      };
    }

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData.wheels) || parsedData.wheels.length === 0) {
      throw new Error("Invalid saved wheel data");
    }

    return parsedData;
  } catch {
    return {
      wheels: DEFAULT_WHEELS,
      selectedId: DEFAULT_WHEELS[0].id,
    };
  }
}

export function saveWheelData(wheels, selectedId) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        wheels,
        selectedId,
      }),
    );
  } catch (error) {
    console.error("Unable to save wheel data:", error);
  }
}

export function getShareUrl() {
  if (typeof window === "undefined") {
    return "https://pick-and-spin.netlify.app";
  }

  return `${window.location.origin}${window.location.pathname}`;
}
