import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Loader } from '@googlemaps/js-api-loader';

interface MapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  height?: string;
}

const InteractiveMap: React.FC<MapProps> = ({ onLocationSelect, height = "400px" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [googleMapsKey, setGoogleMapsKey] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for nearby issues
  const nearbyIssues = [
    { id: 1, lat: 28.6129, lng: 77.2295, title: "Broken streetlight", type: "infrastructure" },
    { id: 2, lat: 28.6139, lng: 77.2285, title: "Pothole", type: "road" },
    { id: 3, lat: 28.6119, lng: 77.2305, title: "Garbage collection", type: "sanitation" },
  ];

  useEffect(() => {
    if (!googleMapsKey || !mapContainer.current) return;

    const initMap = async () => {
      if (!mapContainer.current) return;
      
      setIsLoading(true);
      try {
        const loader = new Loader({
          apiKey: googleMapsKey,
          version: "weekly",
          libraries: ["places"]
        });

        const { Map } = await loader.importLibrary("maps");
        
        const mapInstance = new Map(mapContainer.current, {
          center: { lat: 28.6129, lng: 77.2295 }, // Default to Delhi
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        setMap(mapInstance);

        // Add click listener for location selection
        mapInstance.addListener('click', (e: google.maps.MapMouseEvent) => {
          const lat = e.latLng?.lat();
          const lng = e.latLng?.lng();
          
          if (lat && lng) {
            setSelectedLocation({ lat, lng });
            onLocationSelect?.(lat, lng);
            
            // Add marker at clicked location
            new google.maps.Marker({
              position: { lat, lng },
              map: mapInstance,
              title: t('selectLocationToReport'),
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#2d5016">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(32, 32)
              }
            });
          }
        });

        // Add markers for nearby issues
        nearbyIssues.forEach((issue) => {
          new google.maps.Marker({
            position: { lat: issue.lat, lng: issue.lng },
            map: mapInstance,
            title: issue.title,
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e11d48">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24)
            }
          });
        });

      } catch (error) {
        console.error('Error loading Google Maps:', error);
        // Fallback to demo map
        if (mapContainer.current) {
          mapContainer.current.innerHTML = `
            <div style="
              width: 100%; 
              height: 100%; 
              background: linear-gradient(45deg, #e8f5e8 0%, #f0f8e8 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              border-radius: 8px;
              overflow: hidden;
            ">
              <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #2d5016;
                font-size: 18px;
                font-weight: 600;
                text-align: center;
              ">
                📍 ${t('selectLocationToReport')}<br/>
                <small style="font-size: 14px; opacity: 0.7;">Click anywhere to select location</small>
              </div>
            </div>
          `;

          // Add click handler for demo map
          mapContainer.current.addEventListener('click', (e) => {
            const rect = mapContainer.current!.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const lat = 28.6129 + (rect.height/2 - y) * 0.001;
            const lng = 77.2295 + (x - rect.width/2) * 0.001;
            
            setSelectedLocation({ lat, lng });
            onLocationSelect?.(lat, lng);
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    initMap();
  }, [googleMapsKey, t, onLocationSelect]);

  const handleTokenSubmit = () => {
    if (googleMapsKey.trim()) {
      setShowTokenInput(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          onLocationSelect?.(latitude, longitude);
          
          // Center map on user location if Google Maps is loaded
          if (map) {
            map.setCenter({ lat: latitude, lng: longitude });
            map.setZoom(15);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (showTokenInput) {
    return (
      <Card className="p-6">
        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-government-green">{t('interactiveMap')}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              To use the interactive map, please enter your Google Maps API key below.
              {t('getMapboxToken')} <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="text-government-green underline">Google Cloud Console</a>
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Google Maps API key..."
              value={googleMapsKey}
              onChange={(e) => setGoogleMapsKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTokenSubmit} className="bg-government-green hover:bg-government-green/90">
              {t('loadMap')}
            </Button>
          </div>
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setGoogleMapsKey('demo-token');
                setShowTokenInput(false);
              }}
              className="text-government-green border-government-green hover:bg-government-light"
            >
              {t('useDemoMap')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-government-green">{t('interactiveMap')}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            className="text-government-green border-government-green hover:bg-government-light"
          >
            <Navigation className="h-4 w-4 mr-1" />
            {t('myLocation')}
          </Button>
          {selectedLocation && (
            <Button
              size="sm"
              onClick={() => navigate('/report')}
              className="bg-government-yellow text-government-green hover:bg-government-accent"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('reportHere')}
            </Button>
          )}
        </div>
      </div>
      
      <div 
        ref={mapContainer} 
        style={{ height }}
        className="w-full border-2 border-government-light rounded-lg cursor-pointer relative"
      >
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-government-green mx-auto"></div>
              <p className="text-sm text-muted-foreground">{t('loading')}</p>
            </div>
          </div>
        )}
      </div>
      
      {selectedLocation && (
        <Card className="p-4 bg-government-light/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-government-green" />
              <span className="text-sm text-government-green font-medium">
                Selected: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/report')}
              className="bg-government-green hover:bg-government-green/90"
            >
              {t('reportAnIssue')}
            </Button>
          </div>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium text-government-green mb-3">{t('nearbyIssues')}</h4>
          <div className="space-y-2">
            {nearbyIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-2 rounded bg-government-light/20">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-government-accent" />
                  <span className="text-sm">{issue.title}</span>
                </div>
                <span className="text-xs text-muted-foreground capitalize">{issue.type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveMap;