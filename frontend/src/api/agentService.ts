import axiosClient from './axiosClient';

// MATCHES YOUR SPRING BOOT LISTING.JAVA MODEL EXACTLY
export interface VerificationTask {
  listingId: string; 
  cropType: string;
  quantityKg: number; 
  pricePerKg: number; 
  isVerified: boolean;
  farmer?: {
    fullName: string;
    phoneNumber: string;
  };
}

export const agentService = {
  // 1. Get the agent's profile details
  getAgentProfile: async (userId: string) => {
    const response = await axiosClient.get(`/users/${userId}`);
    return response.data;
  },

  // 2. Get ALL listings (both verified and unverified)
  getAllListings: async (): Promise<VerificationTask[]> => {
    const response = await axiosClient.get('/listings');
    return response.data;
  },

  // 3. Onboard a farmer
  onboardFarmer: async (data: {
    fullName: string;
    phoneNumber: string;
    primaryCrop: string;
    longitude: number;
    latitude: number;
  }) => {
    const response = await axiosClient.post('/users/agent/onboard-farmer', data);
    return response.data;
  },

  // 4. Get a single listing by ID
  getListingById: async (listingId: string) => {
    const response = await axiosClient.get(`/listings/${listingId}`);
    return response.data;
  },

  // 5. Mark a listing as verified (with Geolocation and Photo payload)
  verifyListing: async (listingId: string, formData: FormData) => {
    const response = await axiosClient.post(`/listings/${listingId}/verify`, formData);
    return response.data;
  }
};