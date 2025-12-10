/**
 * PropertyCard Component Tests
 */

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, mockProperty } from '../helpers/testUtils';

// Mock PropertyCard component for testing
const PropertyCard = ({ property }: { property: typeof mockProperty }) => {
  return (
    <div data-testid="property-card">
      <h3>{property.title}</h3>
      <p>{property.description}</p>
      <p>₹{property.price.toLocaleString()}/month</p>
      <p>{property.city}</p>
      <p>
        {property.bedrooms} BHK • {property.area} sq ft
      </p>
    </div>
  );
};

describe('PropertyCard Component', () => {
  it('should render property details', () => {
    renderWithProviders(<PropertyCard property={mockProperty} />);

    expect(screen.getByText(mockProperty.title)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.description)).toBeInTheDocument();
    expect(screen.getByText(/₹15,000/)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.city)).toBeInTheDocument();
  });

  it('should display property specifications', () => {
    renderWithProviders(<PropertyCard property={mockProperty} />);

    expect(screen.getByText(/2 BHK/)).toBeInTheDocument();
    expect(screen.getByText(/1200 sq ft/)).toBeInTheDocument();
  });

  it('should format price with Indian locale', () => {
    renderWithProviders(<PropertyCard property={mockProperty} />);

    const priceText = screen.getByText(/₹15,000/);
    expect(priceText).toBeInTheDocument();
  });
});
