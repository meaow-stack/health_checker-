
'use client';

import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, MapPin, Search, AlertCircle, Star, Phone, ExternalLink, Globe } from 'lucide-react';
import { findNearbyDoctors } from '@/app/find-doctors/actions';
import type { Doctor } from '@/types';
import Image from 'next/image';

interface FindDoctorsClientProps {
  apiKey: string;
}

const mapContainerStyle = {
  height: '400px',
  width: '100%',
  borderRadius: '0.5rem',
};

export default function FindDoctorsClient({ apiKey }: FindDoctorsClientProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 37.0902, lng: -95.7129 }); // Default to US center

  const UserMarkerIcon = (typeof window !== "undefined" && window.google && window.google.maps) ? {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: 'hsl(var(--primary))',
    fillOpacity: 1,
    strokeColor: 'white',
    strokeWeight: 2,
    scale: 8,
  } : { path: 'M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0', fillColor: 'hsl(var(--primary))', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2, scale: 1.6 };

  const DoctorMarkerIcon = (typeof window !== "undefined" && window.google && window.google.maps) ? {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: 'hsl(var(--accent))',
    fillOpacity: 0.9,
    strokeColor: 'white',
    strokeWeight: 1.5,
    scale: 7,
  } : { path: 'M 0, 0 m -4, 0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0', fillColor: 'hsl(var(--accent))', fillOpacity: 0.9, strokeColor: 'white', strokeWeight: 1.5, scale: 1.75 };


  const handleLocationSuccess = useCallback(
    async (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
      setMapCenter({ lat: latitude, lng: longitude });
      setError(null); // Clear previous errors
      setLoadingDoctors(true);
      setDoctors([]); // Clear previous doctor list
      try {
        const fetchedDoctors = await findNearbyDoctors(latitude, longitude);
        setDoctors(fetchedDoctors);
        // No explicit error is set here if fetchedDoctors is empty.
        // The JSX rendering will handle the "No doctors found" display.
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch doctors.');
      } finally {
        setLoadingDoctors(false);
        setLoadingLocation(false);
      }
    },
    []
  );

  const handleLocationError = useCallback((err: GeolocationPositionError) => {
    console.warn(`Location error: ${err.code} - ${err.message}`);
    let friendlyMessage = 'Could not get your location. ';
    if (err.code === 1) { // PERMISSION_DENIED
        friendlyMessage += 'Permission denied. Please enable location services in your browser settings and for this site.';
    } else if (err.code === 2) { // POSITION_UNAVAILABLE
        friendlyMessage += 'Location information is unavailable. Please ensure location services are enabled on your device and browser, and that you have a stable internet connection. If you are indoors, try moving near a window or outdoors.';
    } else if (err.code === 3) { // TIMEOUT
        friendlyMessage += 'Timeout trying to get location. Please check your internet connection and try again.';
    } else {
        friendlyMessage += 'An unknown error occurred while trying to get your location.';
    }
    setError(friendlyMessage);
    setLoadingLocation(false);
  }, []);

  const requestLocation = useCallback(() => {
    setLoadingLocation(true);
    setError(null);
    setDoctors([]);
    setSelectedDoctor(null); 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError, {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 0, // Force fresh location
      });
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
    }
  }, [handleLocationSuccess, handleLocationError]);
  

  return (
    <div className="space-y-6">
      {!location && !loadingLocation && !error && (
        <Alert variant="default" className="border-primary/50 bg-primary/10">
          <MapPin className="h-5 w-5 text-primary" />
          <AlertTitle className="text-primary font-headline">Location Needed</AlertTitle>
          <AlertDescription>
            Click the button below to allow us to access your current location to find doctors near you. Your location data is not stored by us.
          </AlertDescription>
          <Button onClick={requestLocation} className="mt-3">
            <Search className="mr-2 h-4 w-4" /> Find Doctors Near Me
          </Button>
        </Alert>
      )}

      {loadingLocation && (
        <div className="flex items-center justify-center space-x-2 text-muted-foreground py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Getting your location...</span>
        </div>
      )}

      {error && (
         <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          {(!loadingLocation && (error.includes("Permission denied") || error.includes("Location information is unavailable") || error.includes("Timeout trying to get location") || error.includes("Geolocation is not supported"))) && (
             <Button onClick={requestLocation} variant="outline" size="sm" className="mt-3">
                Retry Location
             </Button>
          )}
        </Alert>
      )}

      {location && (
        <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={doctors.length > 0 ? 13 : 10}
            options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false, zoomControl: true }}
            onLoad={(map) => {
                // You can use the map instance here if needed, e.g. map.setOptions(...)
            }}
          >
            { UserMarkerIcon && location && (typeof window !== "undefined" && window.google && window.google.maps) &&
              <Marker position={location} title="Your Location" icon={UserMarkerIcon} />
            }
            { DoctorMarkerIcon && (typeof window !== "undefined" && window.google && window.google.maps) && doctors.map((doctor) => (
              <Marker
                key={doctor.id}
                position={{ lat: doctor.lat, lng: doctor.lng }}
                title={doctor.name}
                icon={DoctorMarkerIcon}
                onClick={() => setSelectedDoctor(doctor)}
              />
            ))}
            {selectedDoctor && (typeof window !== "undefined" && window.google && window.google.maps) && (
              <InfoWindow
                position={{ lat: selectedDoctor.lat, lng: selectedDoctor.lng }}
                onCloseClick={() => setSelectedDoctor(null)}
              >
                <div className="p-1 max-w-xs">
                  <h3 className="text-sm font-semibold mb-0.5">{selectedDoctor.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{selectedDoctor.address}</p>
                  {selectedDoctor.rating && (
                    <div className="flex items-center text-xs mb-1">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" /> {selectedDoctor.rating}
                    </div>
                  )}
                   <p className="text-xs text-muted-foreground">
                    Status: {selectedDoctor.isOpen === true ? 'Open' : selectedDoctor.isOpen === false ? 'Closed' : 'Hours unknown'}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}

      {loadingDoctors && (
        <div className="flex items-center justify-center space-x-2 text-muted-foreground py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Finding nearby doctors...</span>
        </div>
      )}

      {!loadingLocation && !loadingDoctors && location && doctors.length === 0 && !error && (
         <Alert variant="default" className="border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
            <MapPin className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <AlertTitle className="font-headline text-blue-700 dark:text-blue-300">No Doctors Found</AlertTitle>
            <AlertDescription>
                We couldn't find any doctors within a 5km radius of your current location. You might want to try again or check a different area if possible.
            </AlertDescription>
        </Alert>
      )}

      {!loadingDoctors && doctors.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold font-headline">Doctors Near You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="shadow-lg flex flex-col">
                <CardHeader>
                  <CardTitle className="font-headline text-lg">{doctor.name}</CardTitle>
                  <CardDescription>{doctor.address}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm">
                  {doctor.photoUrl && (
                     <div className="aspect-video relative mb-2 rounded-md overflow-hidden">
                        <Image src={doctor.photoUrl} alt={doctor.name} layout="fill" objectFit="cover" data-ai-hint="medical building" />
                     </div>
                  )}
                  {!doctor.photoUrl && (
                     <div className="aspect-video relative mb-2 rounded-md overflow-hidden bg-secondary flex items-center justify-center">
                        <MapPin className="h-16 w-16 text-muted-foreground" data-ai-hint="medical building default" />
                     </div>
                  )}
                  {doctor.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1.5 fill-yellow-400 text-yellow-400" />
                      <span>{doctor.rating} / 5 stars</span>
                    </div>
                  )}
                  <p>
                    Status: <span className={doctor.isOpen === true ? 'text-green-600' : doctor.isOpen === false ? 'text-red-600' : 'text-muted-foreground'}>
                        {doctor.isOpen === true ? 'Open Now' : doctor.isOpen === false ? 'Closed' : 'Hours Unknown'}
                    </span>
                  </p>
                  {doctor.phoneNumber && (
                     <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        <a href={`tel:${doctor.phoneNumber}`} className="hover:underline">{doctor.phoneNumber}</a>
                     </div>
                  )}
                </CardContent>
                 <CardFooter className="flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                        setMapCenter({ lat: doctor.lat, lng: doctor.lng });
                        setSelectedDoctor(doctor);
                        window.scrollTo({ top: 0, behavior: 'smooth'});
                    }}>
                        <MapPin className="mr-2 h-4 w-4"/> View on Map
                    </Button>
                    {doctor.website && (
                         <Button variant="ghost" size="sm" asChild>
                            <a href={doctor.website} target="_blank" rel="noopener noreferrer">
                                <Globe className="mr-2 h-4 w-4"/> Website
                            </a>
                        </Button>
                    )}
                 </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

