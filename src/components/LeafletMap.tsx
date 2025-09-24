import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/png;base64,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',
  iconUrl: 'data:image/png;base64,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',
  shadowUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach6AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9sIDRcOI0/6R0AAAAJWSURBVEjHvZY9SwNBEIWfpAuVhaB1SJJsG6wUSGBpY2FhY2FrJ4EUV6yEwsJWG6tYWNtZaCEWtoKFhYUEa4VUohDERHChsKhY2CqkCMmFhe0VZuC9c9e5F3Z+zOwuDAP7v5g9UYZ5TQHMg0BsAoAKyATQMw3cCmCPGTFHRTzgPALAnsDEZGxo5n/vWYKvq6RpWOGEHt8yb2+N6/+sYz/FE8t0zd9bJfr8tTLxCe6kbA8Ama0sPfHEsJlxqKTQFQDMgGUxlkI9p7QheDQE5B6CyJZkNUqBTNhYAM3TLMJRzZaOZ3oN2RyLqfwAJhXRjJLOlEGmCLCG3AlWBkUhBSPdEDKVW5HXl5yVCAFcNlHUAJvU2sxGgDUMaE8CkSTAJ4QGAoUQgAcQSQLcqJkC0kTYxmLWgPa2v4SJbBoHMOACGCgWxdK0L/KKDBIUAx+WKeCaWNFNm1jfN0A4QCj2CWPKfDJN3JtW1hXFhLNKKu9EaUQzI6sMGCIwJmqFklBYGXc9CJFtYjRJNlDgGKGQzISyGEZVNpGV9cPCYu9XY0zGN6mEQgA3RXLQKyLFBfgEF8DGMoX8pJ0KgPEBYAJJmNJsZAwjGBo+AAAA1LSAAAAASUVORK5CYII=',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  height?: string;
}

const LeafletMap: React.FC<MapProps> = ({ onLocationSelect, height = "400px" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for nearby issues
  const nearbyIssues = [
    { id: 1, lat: 23.3441, lng: 85.3096, title: "Broken streetlight", type: "infrastructure" },
    { id: 2, lat: 23.3451, lng: 85.3086, title: "Pothole", type: "road" },
    { id: 3, lat: 23.3431, lng: 85.3106, title: "Garbage collection", type: "sanitation" },
  ];

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    setIsLoading(true);
    
    try {
      // Initialize map centered on Ranchi, Jharkhand
      const map = L.map(mapContainer.current).setView([23.3441, 85.3096], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapRef.current = map;

      // Add click listener for location selection
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setSelectedLocation({ lat, lng });
        onLocationSelect?.(lat, lng);
        
        // Remove existing selection markers
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker && (layer as any).isSelectionMarker) {
            map.removeLayer(layer);
          }
        });
        
        // Add new selection marker
        const marker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#2d5016">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `)}`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          })
        }).addTo(map);
        
        (marker as any).isSelectionMarker = true;
      });

      // Add markers for nearby issues
      nearbyIssues.forEach((issue) => {
        L.marker([issue.lat, issue.lng], {
          icon: L.icon({
            iconUrl: `data:image/svg+xml;base64,${btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e11d48">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `)}`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
          })
        })
        .bindPopup(`<strong>${issue.title}</strong><br/><em>${issue.type}</em>`)
        .addTo(map);
      });

      setIsLoading(false);

    } catch (error) {
      console.error('Error loading map:', error);
      setIsLoading(false);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onLocationSelect]);

  const getCurrentLocation = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          onLocationSelect?.(latitude, longitude);
          
          // Center map on user location
          mapRef.current!.setView([latitude, longitude], 15);
          
          // Remove existing selection markers
          mapRef.current!.eachLayer((layer) => {
            if (layer instanceof L.Marker && (layer as any).isSelectionMarker) {
              mapRef.current!.removeLayer(layer);
            }
          });
          
          // Add marker at user location
          const marker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: `data:image/svg+xml;base64,${btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#2d5016">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `)}`,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            })
          }).addTo(mapRef.current!);
          
          (marker as any).isSelectionMarker = true;
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

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

export default LeafletMap;