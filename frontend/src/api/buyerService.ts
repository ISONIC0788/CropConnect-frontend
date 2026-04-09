import axiosClient from './axiosClient';

export interface BackendListing {
  listingId: string;
  cropType: string;
  quantityKg: number;
  pricePerKg: number;
  status: string;
  isVerified: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
  farmer?: {
    fullName: string;
    phoneNumber: string;
  };
}

export const buyerService = {
  // Fetch all listings. We will filter for "verified" ones on the frontend.
  getAllListings: async (): Promise<BackendListing[]> => {
    const response = await axiosClient.get('/listings');
    return response.data;
  }
};