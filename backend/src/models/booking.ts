export interface Booking {
  id: string;
  propertyId: string;
  clientId: string;
  ownerId: string;
  scheduledAt: Date;
  status: 'requested' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  completedAt?: Date;
}

export interface CreateBookingDto {
  propertyId: string;
  scheduledAt: Date;
  notes?: string;
}

export interface UpdateBookingDto {
  scheduledAt?: Date;
  status?: 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  cancellationReason?: string;
}
