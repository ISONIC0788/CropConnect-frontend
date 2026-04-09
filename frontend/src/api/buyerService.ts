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

export interface BidResponse {
  bidId: string;
  bidAmount: number;
  status: string;
  listing: BackendListing;
}

export const buyerService = {
  // 1. Fetch all listings for the Sourcing Map
  getAllListings: async (): Promise<BackendListing[]> => {
    const response = await axiosClient.get('/listings');
    return response.data;
  },

  // 2. Place a bid on a specific listing
  placeBid: async (listingId: string, buyerId: string, bidAmount: number) => {
    const response = await axiosClient.post(`/bids/listing/${listingId}/buyer/${buyerId}`, {
      bidAmount: bidAmount
    });
    return response.data;
  },

  // 3. Get all bids for a specific buyer (FIXES YOUR CURRENT ERROR)
  getBuyerBids: async (buyerId: string): Promise<BidResponse[]> => {
    const response = await axiosClient.get(`/bids/buyer/${buyerId}`);
    return response.data;
  }
};