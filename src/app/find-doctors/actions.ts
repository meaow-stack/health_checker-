'use server';

import type { Doctor } from '@/types';

interface PlacePhoto {
  photo_reference: string;
  html_attributions: string[];
  height: number;
  width: number;
}

interface PlaceOpeningHours {
  open_now: boolean;
}

interface PlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
}

interface PlaceResult {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  geometry: PlaceGeometry;
  photos?: PlacePhoto[];
  rating?: number;
  opening_hours?: PlaceOpeningHours;
  international_phone_number?: string;
  website?: string;
}

interface PlacesNearbyResponse {
  results: PlaceResult[];
  status: string;
  error_message?: string;
}

export async function findNearbyDoctors(
  lat: number,
  lng: number
): Promise<Doctor[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Google Maps API key is not configured.');
    throw new Error('Google Maps API key is not configured.');
  }

  const radius = 5000; // 5km radius
  const type = 'doctor';
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Places API error:', errorData);
      throw new Error(
        `Failed to fetch doctors: ${response.statusText} - ${errorData?.error_message || ''}`
      );
    }

    const data: PlacesNearbyResponse = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API returned status:', data.status, data.error_message);
      throw new Error(`Google Places API Error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    return data.results.map((place) => {
      let photoUrl;
      if (place.photos && place.photos[0]?.photo_reference) {
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`;
      }

      return {
        id: place.place_id,
        name: place.name,
        address: place.vicinity || place.formatted_address || 'Address not available',
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        photoUrl: photoUrl,
        rating: place.rating,
        isOpen: place.opening_hours?.open_now ?? 'UNKNOWN',
        phoneNumber: place.international_phone_number,
        website: place.website,
      };
    });
  } catch (error) {
    console.error('Error fetching nearby doctors:', error);
    throw new Error(`Could not fetch doctors. ${error instanceof Error ? error.message : ''}`);
  }
}
