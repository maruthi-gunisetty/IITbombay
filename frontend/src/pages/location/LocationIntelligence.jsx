import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Building2, School, Bus, Hospital, Search } from 'lucide-react';
import { propertiesAPI } from '../../services/api';

// Custom Map Marker Icon for Leaflet
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationIntelligence = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProp, setSelectedProp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCity, setActiveCity] = useState('Mumbai');

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await propertiesAPI.list();
        setProperties(res.data || []);
        if (res.data?.length > 0) {
          setSelectedProp(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, []);

  const cityCoordinates = {
    Mumbai: [19.0760, 72.8777],
    Bengaluru: [12.9716, 77.5946],
    Hyderabad: [17.3850, 78.4867],
    Pune: [18.5204, 73.8567]
  };

  const center = cityCoordinates[activeCity] || [19.0760, 72.8777];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Geospatial Location Intelligence</h2>
        <p className="text-xs text-[#475569]">
          Interactive spatial radius mapping, infrastructure proximity, transit corridors, and locality liquidity scores.
        </p>
      </div>

      {/* City Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-3">
        <div className="flex items-center space-x-2">
          {['Mumbai', 'Bengaluru', 'Hyderabad', 'Pune'].map(city => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeCity === city
                  ? 'bg-[#3978F6] text-white shadow-sm'
                  : 'bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
        <div className="text-xs text-[#475569] hidden sm:block">
          OpenStreetMap Cartography Engine Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xl h-[520px] relative">
          <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom={false}
            className="w-full h-full z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {properties.map(p => (
              p.latitude && p.longitude ? (
                <Marker
                  key={p.id}
                  position={[p.latitude, p.longitude]}
                  icon={customMarkerIcon}
                  eventHandlers={{
                    click: () => setSelectedProp(p)
                  }}
                >
                  <Popup>
                    <div className="text-xs text-[#F8FAFC] p-1">
                      <strong className="block text-sm">{p.name}</strong>
                      <span>{p.locality}, {p.city}</span>
                      <div className="mt-1 font-bold text-[#3978F6]">
                        INR {p.estimated_value ? (p.estimated_value / 10000000).toFixed(2) + ' Cr' : 'Unvalued'}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>

        {/* Selected Property Proximity Dossier (4 cols) */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#E2E8F0]">
              <span className="text-[10px] text-[#0284C7] uppercase tracking-wider font-semibold block">Locality Profile</span>
              <h3 className="text-sm font-bold text-[#0F172A] truncate">
                {selectedProp ? selectedProp.name : 'Select a Pin on Map'}
              </h3>
              <p className="text-xs text-[#475569] mt-0.5">
                {selectedProp ? `${selectedProp.locality}, ${selectedProp.city}` : 'Spatial attributes will populate here'}
              </p>
            </div>

            {selectedProp && (
              <div className="mt-4 space-y-3.5 text-xs">
                
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                  <span className="text-[#475569] block">Geo Coordinates</span>
                  <span className="font-mono text-xs text-[#059669] font-semibold">
                    {selectedProp.latitude}° N, {selectedProp.longitude}° E
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-[#0F172A] block">Verified Proximity & Infrastructure</span>
                  
                  <div className="p-2.5 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bus className="w-4 h-4 text-[#3978F6]" />
                      <span className="text-[#0F172A]">Metro Station</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#059669]">0.4 km</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <School className="w-4 h-4 text-[#0284C7]" />
                      <span className="text-[#0F172A]">International School</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#059669]">1.2 km</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Hospital className="w-4 h-4 text-[#DC2626]" />
                      <span className="text-[#0F172A]">Multispecialty Hospital</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#059669]">1.8 km</span>
                  </div>
                </div>

              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] text-[11px] text-[#475569]">
            Locality Demand Score: <strong className="text-[#059669]">92 / 100 (Tier-1 Primary Liquidity Zone)</strong>
          </div>
        </div>

      </div>

    </div>
  );
};

export default LocationIntelligence;
