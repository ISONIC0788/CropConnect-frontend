export enum Role {
    FARMER = 'FARMER',
    BUYER = 'BUYER',
    AGENT = 'AGENT',
    ADMIN = 'ADMIN'
}

export enum EscrowStatus {
    PENDING = 'PENDING',
    HELD = 'HELD',
    RELEASED = 'RELEASED',
    REFUNDED = 'REFUNDED'
}

export enum LogisticsStatus {
    PENDING = 'PENDING',
    PENDING_PICKUP = 'PENDING_PICKUP',
    IN_TRANSIT = 'IN_TRANSIT',
    QUALITY_VERIFIED = 'QUALITY_VERIFIED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export enum ListingStatus {
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    LOCKED = 'LOCKED',
    CANCELLED = 'CANCELLED'
}

export enum BidStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}
