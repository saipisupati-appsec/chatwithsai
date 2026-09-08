/** Lightweight atmospheric themes (local/config-driven, no weather API). */
export type AtmosphereId =
  | "auto"
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  | "rainy"
  | "night";

export const ATMOSPHERE_STORAGE_KEY = "chatwithsai-atmosphere";

export const atmospheres: Record<
  AtmosphereId,
  { label: string; className: string }
> = {
  auto: { label: "Auto", className: "" },
  spring: {
    label: "Spring",
    className: "atmosphere-spring",
  },
  summer: {
    label: "Summer",
    className: "atmosphere-summer",
  },
  autumn: {
    label: "Autumn",
    className: "atmosphere-autumn",
  },
  winter: {
    label: "Winter",
    className: "atmosphere-winter",
  },
  rainy: {
    label: "Rainy",
    className: "atmosphere-rainy",
  },
  night: {
    label: "Night",
    className: "atmosphere-night",
  },
};

export function resolveAtmosphere(id: AtmosphereId): AtmosphereId {
  if (id !== "auto") return id;
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}
