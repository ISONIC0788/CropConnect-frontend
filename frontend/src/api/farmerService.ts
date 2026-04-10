import axiosClient from './axiosClient';

export interface FarmerListing {
  listingId: string;
  cropType: string;
  quantityKg: number;
  pricePerKg: number;
  isVerified: boolean;
  status: string;
}

export interface FarmerBid {
  bidId: string;
  bidAmount: number;
  status: string;
  buyer: {
    fullName: string;
  };
  listing: {
    cropType: string;
    quantityKg: number;
  };
}

export const farmerService = {
  // Get listings belonging to a specific farmer
  getMyListings: async (farmerId: string): Promise<FarmerListing[]> => {
    const response = await axiosClient.get(`/listings/farmer/${farmerId}`);
    return response.data;
  },

  // Get all incoming bids for a specific farmer's listings
  getIncomingBids: async (farmerId: string): Promise<FarmerBid[]> => {
    const response = await axiosClient.get(`/bids/farmer/${farmerId}`);
    return response.data;
  },

  // Accept an incoming bid
  acceptBid: async (bidId: string): Promise<void> => {
    await axiosClient.put(`/bids/${bidId}/accept`);
  }
};