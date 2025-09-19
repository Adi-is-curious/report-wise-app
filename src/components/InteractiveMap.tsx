import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface MapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  height?: string;
}

const InteractiveMap: React.FC<MapProps> = ({ onLocationSelect, height = "400px" }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Mock data for nearby issues
  const nearbyIssues = [
    { id: 1, lat: 28.6129, lng: 77.2295, title: "Broken streetlight", type: "infrastructure" },
    { id: 2, lat: 28.6139, lng: 77.2285, title: "Pothole", type: "road" },
    { id: 3, lat: 28.6119, lng: 77.2305, title: "Garbage collection", type: "sanitation" },
  ];

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    // For now, we'll create a simple map placeholder
    // In production, you would integrate with actual Mapbox GL JS
    const initMap = () => {
      if (!mapContainer.current) return;
      
      // Simple map simulation
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

      // Add click handler for location selection
      mapContainer.current.addEventListener('click', (e) => {
        const rect = mapContainer.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Mock coordinates based on click position
        const lat = 28.6129 + (rect.height/2 - y) * 0.001;
        const lng = 77.2295 + (x - rect.width/2) * 0.001;
        
        setSelectedLocation({ lat, lng });
        onLocationSelect?.(lat, lng);
      });
    };

    initMap();
  }, [mapboxToken, t, onLocationSelect]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
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
            <h3 className="text-lg font-semibold text-government-green">Interactive Map</h3>
            <p className="text-sm text-muted-foreground mt-2">
              To use the interactive map, please enter your Mapbox public token below.
              You can get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-government-green underline">mapbox.com</a>
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter Mapbox public token..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTokenSubmit} className="bg-government-green hover:bg-government-green/90">
              Load Map
            </Button>
          </div>
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setMapboxToken('demo-token');
                setShowTokenInput(false);
              }}
              className="text-government-green border-government-green hover:bg-government-light"
            >
              Use Demo Map
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
            My Location
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
        className="w-full border-2 border-government-light rounded-lg cursor-pointer"
      />
      
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