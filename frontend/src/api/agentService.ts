import axiosClient from './axiosClient';

// Matches your Spring Boot Listing.java model
export interface PendingVerification {
  listingId: string; 
  cropType: string;
  quantityAvailable: number; 
  pricePerKg: number; 
  farmerName?: string;
}

export const agentService = {
  // 1. Get the agent's profile details
  getAgentProfile: async (userId: string) => {
    const response = await axiosClient.get(`/users/${userId}`);
    return response.data;
  },

  // 2. Get listings that need verification
  getPendingVerifications: async (): Promise<PendingVerification[]> => {
    const response = await axiosClient.get('/listings/pending');
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
  }, // <--- THIS COMMA WAS MISSING!

  // 4. Get a single listing by ID
  getListingById: async (listingId: string) => {
    const response = await axiosClient.get(`/listings/${listingId}`);
    return response.data;
  },

  // 5. Mark a listing as verified
  verifyListing: async (listingId: string) => {
    const response = await axiosClient.put(`/listings/${listingId}/verify`);
    return response.data;
  }
};