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
  // 1. Get Farmer's Inventory from the backend
  getMyListings: async (farmerId: string): Promise<FarmerListing[]> => {
    const response = await axiosClient.get(`/listings/farmer/${farmerId}`);
    return response.data;
  },

  // 2. Get incoming bids for this farmer's listings
  getIncomingBids: async (farmerId: string): Promise<FarmerBid[]> => {
    const response = await axiosClient.get(`/bids/farmer/${farmerId}`);
    return response.data;
  },

  // 3. Accept a bid (This triggers the Order creation and Listing lock in BidService.java)
  acceptBid: async (bidId: string) => {
    const response = await axiosClient.put(`/bids/${bidId}/accept`);
    return response.data;
  }
};