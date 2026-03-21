// src/data/mockBuyerData.ts

export interface CropListing {
  id: string;
  crop: string;
  grade: string;
  quantity: number;
  unit: string;
  pricePerKg: number;
  farmer: string;
  district: string;
  distance: number; // in km
  verified: boolean;
  coordinates: { lat: number; lng: number }; // For the map
}

export const cropListings: CropListing[] = [
  {
    id: "LST-001",
    crop: "Maize",
    grade: "Grade A",
    quantity: 2500,
    unit: "kg",
    pricePerKg: 320,
    farmer: "Jean-Pierre Habimana",
    district: "Musanze",
    distance: 12,
    verified: true,
    coordinates: { lat: -1.4998, lng: 29.6349 }
  },
  {
    id: "LST-002",
    crop: "Coffee (Washed)",
    grade: "Export Quality",
    quantity: 800,
    unit: "kg",
    pricePerKg: 2800,
    farmer: "Marie-Claire Uwimana",
    district: "Huye",
    distance: 45,
    verified: true,
    coordinates: { lat: -2.5966, lng: 29.7394 }
  },
  {
    id: "LST-003",
    crop: "Red Beans",
    grade: "Mixed",
    quantity: 1200,
    unit: "kg",
    pricePerKg: 650,
    farmer: "Emmanuel Nsengiyumva",
    district: "Nyagatare",
    distance: 78,
    verified: false,
    coordinates: { lat: -1.2997, lng: 30.3273 }
  },
  {
    id: "LST-004",
    crop: "Maize",
    grade: "Grade B",
    quantity: 3000,
    unit: "kg",
    pricePerKg: 310,
    farmer: "Claudine Mukamana",
    district: "Rwamagana",
    distance: 23,
    verified: true,
    coordinates: { lat: -1.9487, lng: 30.4347 }
  },
  {
    id: "LST-005",
    crop: "Soybeans",
    grade: "Grade A",
    quantity: 1500,
    unit: "kg",
    pricePerKg: 850,
    farmer: "Innocent Twagiramungu",
    district: "Bugesera",
    distance: 34,
    verified: true,
    coordinates: { lat: -2.2033, lng: 30.1506 }
  }
];