import axiosClient from './axiosClient';

// Define what a pending verification (Listing) looks like based on your Spring Boot model
export interface PendingVerification {
  listingId: number;
  cropType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  farmerName?: string; // We will fetch this from the user relation
}

export const agentService = {
  // 1. Get the agent's profile details using their ID
  getAgentProfile: async (userId: string) => {
    const response = await axiosClient.get(`/users/${userId}`);
    return response.data;
  },

  // 2. Get listings that have NOT been verified yet
  getPendingVerifications: async (): Promise<PendingVerification[]> => {
    // We will assume your backend has an endpoint to get all unverified listings
    // If it doesn't yet, we will build it in Spring Boot next!
    const response = await axiosClient.get('/listings/pending');
    return response.data;
  }
};