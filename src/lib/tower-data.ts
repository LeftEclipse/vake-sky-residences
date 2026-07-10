export interface Segment {
  id: string;
  name: string;
  floors: [number, number];
  description: string;
}

export const SEGMENTS: Segment[] = [
  {
    id: "crown",
    name: "The Crown",
    floors: [58, 70],
    description: "Penthouse collection beneath the crown. Full-floor and half-floor residences.",
  },
  {
    id: "sky",
    name: "Sky Residences",
    floors: [40, 57],
    description: "Panoramic residences above 148 metres, with wraparound terraces.",
  },
  {
    id: "panorama",
    name: "Panorama Collection",
    floors: [22, 39],
    description: "Two and three bedroom residences overlooking Vake Park.",
  },
  {
    id: "garden",
    name: "Garden Residences",
    floors: [6, 21],
    description: "Residences above the podium gardens, business and wellness levels.",
  },
];

export type UnitStatus = "available" | "reserved" | "sold";

export interface UnitLayout {
  points: string;
  labelX: number;
  labelY: number;
  bedrooms: number;
  interior: number;
  terrace: number;
  orientation: string;
}

/** Floor-plate viewBox: 0 0 800 500 — core at 320,190 → 480,310 */
export const UNIT_LAYOUTS: UnitLayout[] = [
  { points: "20,20 280,20 280,200 20,200", labelX: 150, labelY: 110, bedrooms: 3, interior: 168, terrace: 31, orientation: "North-West View" },
  { points: "280,20 520,20 520,190 280,190", labelX: 400, labelY: 105, bedrooms: 2, interior: 124, terrace: 14, orientation: "North View" },
  { points: "520,20 780,20 780,200 520,200", labelX: 650, labelY: 110, bedrooms: 3, interior: 172, terrace: 33, orientation: "North-East View" },
  { points: "480,200 780,200 780,300 480,300", labelX: 630, labelY: 250, bedrooms: 1, interior: 74, terrace: 9, orientation: "East View" },
  { points: "520,300 780,300 780,480 520,480", labelX: 650, labelY: 390, bedrooms: 3, interior: 165, terrace: 29, orientation: "South-East View" },
  { points: "280,310 520,310 520,480 280,480", labelX: 400, labelY: 395, bedrooms: 2, interior: 124, terrace: 31, orientation: "South-West View" },
  { points: "20,300 280,300 280,480 20,480", labelX: 150, labelY: 390, bedrooms: 3, interior: 158, terrace: 27, orientation: "South-West View" },
  { points: "20,200 280,200 280,300 20,300", labelX: 150, labelY: 250, bedrooms: 1, interior: 72, terrace: 8, orientation: "West View" },
];

export function unitStatus(floor: number, idx: number): UnitStatus {
  const s = (floor * 31 + idx * 17 + 7) % 10;
  if (s < 5) return "available";
  if (s < 8) return "reserved";
  return "sold";
}

export function availableOnFloor(floor: number): number {
  return UNIT_LAYOUTS.reduce(
    (n, _, i) => n + (unitStatus(floor, i) === "available" ? 1 : 0),
    0,
  );
}

export interface Residence {
  id: string;
  floor: number;
  unit: number;
  status: UnitStatus;
  bedrooms: number;
  interior: number;
  terrace: number;
  orientation: string;
  heightM: number;
}

export function getResidence(floor: number, idx: number): Residence {
  const layout = UNIT_LAYOUTS[idx];
  return {
    id: `${floor}-${String(idx + 1).padStart(2, "0")}`,
    floor,
    unit: idx + 1,
    status: unitStatus(floor, idx),
    bedrooms: layout.bedrooms,
    interior: layout.interior,
    terrace: layout.terrace,
    orientation: layout.orientation,
    heightM: Math.round(floor * 3.71),
  };
}

export function parseResidenceId(id: string): Residence | null {
  const m = /^(\d{1,2})-(\d{2})$/.exec(id);
  if (!m) return null;
  const floor = Number(m[1]);
  const unit = Number(m[2]);
  if (floor < 6 || floor > 70 || unit < 1 || unit > UNIT_LAYOUTS.length) return null;
  return getResidence(floor, unit - 1);
}

export function segmentForFloor(floor: number): Segment | undefined {
  return SEGMENTS.find((s) => floor >= s.floors[0] && floor <= s.floors[1]);
}

export function floorsOfSegment(seg: Segment): number[] {
  const [lo, hi] = seg.floors;
  const arr: number[] = [];
  for (let f = hi; f >= lo; f--) arr.push(f);
  return arr;
}
