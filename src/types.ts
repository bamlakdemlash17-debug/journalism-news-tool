export interface RoommateListing {
  id: string;
  name: string;
  age: number;
  gender: 'ወንድ (Male)' | 'ሴት (Female)';
  photo: string;
  role: 'ፈልጋለሁ (Looking for Room)' | 'ክፍል አለኝ (Have a Room)';
  country?: string; // ኢትዮጵያ (Ethiopia)
  city: string; // e.g. አዲስ አበባ (Addis Ababa)
  location: string; // Sefer e.g. ቦሌ (Bole), ሲኤምሲ (CMC)
  exactLocation: string; // Specific place/street/condo block
  houseType: string; // ኮንዶሚኒየም, አፓርታማ, ቪላ, አገልግሎት/ስቱዲዮ
  roomsCount: number; // 1, 2, 3, 4
  budget: number; // in ETB / month
  occupation: string;
  lifestyle: string[]; // e.g., Non-smoker, Quiet, Early bird
  description: string;
  phone: string;
  telegram?: string;
  postedDate: string;
  isSample?: boolean;
  roomDetails?: {
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    images: string[];
  };
}

export type FilterOptions = {
  search: string;
  role: 'ALL' | 'ፈልጋለሁ (Looking for Room)' | 'ክፍል አለኝ (Have a Room)';
  city: string;
  location: string;
  houseType: string;
  roomsCount: number | 'ALL';
  maxBudget: number;
  gender: 'ALL' | 'ወንድ (Male)' | 'ሴት (Female)';
};
