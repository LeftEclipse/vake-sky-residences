import {
  SEGMENTS,
  UNIT_LAYOUTS,
  getResidence,
  segmentForFloor,
  type Residence,
  type Segment,
  type UnitStatus,
} from "./tower-data";
import { TOWER } from "./tower-brand";

export function getResidencePrice(residence: Residence): number {
  const basePerSqm = 3_200;
  const floorPremium = residence.floor * 1_200;
  const bedroomPremium = residence.bedrooms * 45_000;
  const terracePremium = residence.terrace * 2_500;
  return Math.round(
    residence.interior * basePerSqm + floorPremium + bedroomPremium + terracePremium,
  );
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getAllResidences(): Residence[] {
  const residences: Residence[] = [];
  for (let floor = TOWER.minFloor; floor <= TOWER.floors; floor++) {
    for (let i = 0; i < UNIT_LAYOUTS.length; i++) {
      residences.push(getResidence(floor, i));
    }
  }
  return residences;
}

export function layoutLabel(bedrooms: number): string {
  return `${bedrooms} Bedroom${bedrooms > 1 ? "s" : ""}`;
}

export interface PriceListFilters {
  segments: string[];
  floors: number[];
  bedrooms: number[];
  statuses: UnitStatus[];
}

export const EMPTY_FILTERS: PriceListFilters = {
  segments: [],
  floors: [],
  bedrooms: [],
  statuses: [],
};

export function filterResidences(
  residences: Residence[],
  filters: PriceListFilters,
): Residence[] {
  return residences.filter((r) => {
    const seg = segmentForFloor(r.floor);
    if (filters.segments.length && (!seg || !filters.segments.includes(seg.id))) return false;
    if (filters.floors.length && !filters.floors.includes(r.floor)) return false;
    if (filters.bedrooms.length && !filters.bedrooms.includes(r.bedrooms)) return false;
    if (filters.statuses.length && !filters.statuses.includes(r.status)) return false;
    return true;
  });
}

export function segmentOptions(): Segment[] {
  return SEGMENTS;
}

export const ALL_FLOORS = Array.from({ length: TOWER.floors - TOWER.minFloor + 1 }, (_, i) => TOWER.floors - i);

export const BEDROOM_OPTIONS = [1, 2, 3] as const;

export const STATUS_OPTIONS: UnitStatus[] = ["available", "reserved", "sold"];
