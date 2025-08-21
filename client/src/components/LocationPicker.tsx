import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';

interface LocationPickerProps {
  onLocationSelect: (location: any) => void;
  selectedLocation: any;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, selectedLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock location search - In a real app, you would integrate with Google Maps API or similar
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        {
          name: `${searchQuery} Soccer Field`,
          address: `123 Main St, ${searchQuery}`,
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        {
          name: `${searchQuery} Sports Complex`,
          address: `456 Park Ave, ${searchQuery}`,
          coordinates: { lat: 40.7589, lng: -73.9851 }
        },
        {
          name: `Central Park - ${searchQuery}`,
          address: `789 Central Park, ${searchQuery}`,
          coordinates: { lat: 40.7851, lng: -73.9683 }
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleLocationSelect = (location: any) => {
    onLocationSelect(location);
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search for a location (e.g., Central Park, NYC)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button 
          type="button" 
          onClick={handleSearch} 
          loading={isSearching}
          disabled={!searchQuery.trim()}
        >
          Search
        </Button>
      </div>

      {/* Selected Location */}
      {selectedLocation && (
        <Card className="bg-blue-600/20 border-blue-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-blue-400 mr-3 mt-1" />
              <div>
                <h4 className="font-medium text-white">{selectedLocation.name}</h4>
                <p className="text-slate-300 text-sm">{selectedLocation.address}</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onLocationSelect(null)}
            >
              Change
            </Button>
          </div>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && !selectedLocation && (
        <div className="space-y-2">
          <h4 className="font-medium text-white">Search Results</h4>
          {searchResults.map((location, index) => (
            <div
                key={index}
                className="cursor-pointer"
                onClick={() => handleLocationSelect(location)}
                role='button'
            >
                <Card hover>
                    <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-1" />
                        <div>
                            <h5 className="font-medium text-white">{location.name}</h5>
                            <p className="text-slate-300 text-sm">{location.address}</p>
                        </div>
                    </div>
                </Card>
            </div>
          ))}
        </div>
      )}

      {/* Manual Entry Option */}
      {!selectedLocation && (
        <Card className="border-dashed border-slate-600">
          <div className="text-center py-4">
            <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-300 text-sm mb-3">
              Can't find your location? You can enter it manually.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const manualLocation = {
                  name: searchQuery || 'Custom Location',
                  address: searchQuery || 'Custom Address',
                  coordinates: { lat: 0, lng: 0 }
                };
                handleLocationSelect(manualLocation);
              }}
            >
              Use Custom Location
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default LocationPicker;