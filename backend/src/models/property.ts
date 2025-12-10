export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  type: 'rent' | 'sale';
  price: number;
  currency: 'INR';
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  amenities: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnishingStatus?: 'furnished' | 'semi-furnished' | 'unfurnished';
  photos: Array<{
    url: string;
    publicId: string;
    order: number;
  }>;
  videos: Array<{
    url: string;
    publicId: string;
    thumbnailUrl: string;
  }>;
  virtualTourUrl?: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationDocs: string[];
  rejectionReason?: string;
  viewsCount: number;
  inquiriesCount: number;
  favoritesCount: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'rented' | 'sold';
  availableFrom?: Date;
}

export interface CreatePropertyDto {
  title: string;
  description: string;
  type: 'rent' | 'sale';
  price: number;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  amenities: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnishingStatus?: 'furnished' | 'semi-furnished' | 'unfurnished';
  availableFrom?: Date;
}

export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {
  status?: 'active' | 'inactive' | 'rented' | 'sold';
}
