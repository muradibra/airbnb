export interface Location {
  _id: string;
  city: string;
  state: string | null;
  country: string;
  displayName: string;
  listingCount: number;
}
