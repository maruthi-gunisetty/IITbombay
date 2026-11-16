import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Search, Filter, Trash2, ExternalLink,
  MapPin, CheckCircle2, AlertCircle, X, ChevronRight, Bed, Bath, Car
} from 'lucide-react';
import { propertiesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PropertyList = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Add Property Form State
  const [formData, setFormData] = useState({
    name: '',
    property_type: 'Apartment',
    state: 'Maharashtra',
    district: 'Mumbai Suburban',
    city: 'Mumbai',
    locality: 'Powai',
    postal_code: '400076',
    full_address: '',
    land_area_sqft: 1500,
    built_up_area_sqft: 1350,
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    property_age_years: 2,
    construction_quality: 'A Grade',
    property_condition: 'Excellent',
    parking_spaces: 1,
    amenities: ['Gym', '24/7 Security', 'Power Backup'],
    latitude: 19.1176,
    longitude: 72.9060,
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await propertiesAPI.list({
        search: search || undefined,
        city: cityFilter || undefined,
        property_type: typeFilter || undefined,
        status: statusFilter || undefined
      });
      setProperties(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [search, cityFilter, typeFilter, statusFilter]);

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await propertiesAPI.create(formData);
      setModalOpen(false);
      fetchProperties();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to register property.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Confirm removal of this registered property record?")) return;
    try {
      await propertiesAPI.delete(id);
      fetchProperties();
    } catch (err) {
      alert("Removal failed: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Property Asset Portfolio</h2>
          <p className="text-xs text-[#475569]">Manage institutional real estate collateral and automated valuation records.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-lg shadow-[#3978F6]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Property</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search address or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#475569] focus:outline-none focus:border-[#3978F6]"
          />
        </div>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
        >
          <option value="">All Cities</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Bengaluru">Bengaluru</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
        >
          <option value="">All Property Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Penthouse">Penthouse</option>
          <option value="Villa">Villa</option>
          <option value="Commercial">Commercial</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active Collateral</option>
          <option value="Draft">Draft</option>
          <option value="Under Evaluation">Under Evaluation</option>
        </select>
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-[#475569]">Loading registered properties...</div>
      ) : properties.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-12 text-center">
          <Building2 className="w-10 h-10 text-[#475569] mx-auto mb-3 opacity-60" />
          <h3 className="text-sm font-bold text-[#0F172A]">No Properties Match Criteria</h3>
          <p className="text-xs text-[#475569] mt-1">Try adjusting your filters or register a new property asset.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProperty(p);
                setDetailModalOpen(true);
              }}
              className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#3978F6]/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="h-44 bg-[#FFFFFF] relative overflow-hidden">
                  <img
                    src={p.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                    alt={p.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#F8FAFC]/80 backdrop-blur-sm border border-[#E2E8F0] text-[10px] font-semibold text-[#0284C7]">
                    {p.property_type}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#059669]/20 border border-[#059669]/40 text-[10px] font-bold text-[#059669]">
                    {p.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A] truncate">{p.name}</h3>
                    <div className="flex items-center space-x-1 text-xs text-[#475569] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#3978F6] flex-shrink-0" />
                      <span className="truncate">{p.locality}, {p.city}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E2E8F0] text-center text-xs text-[#475569]">
                    <div className="flex items-center justify-center space-x-1">
                      <Bed className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{p.bedrooms} BHK</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Bath className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{p.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      <Car className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{p.parking_spaces} Park</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#475569]">Built-up Area:</span>
                    <span className="font-semibold text-[#0F172A]">{p.built_up_area_sqft} sqft</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#475569]">Quality Grade:</span>
                    <span className="font-semibold text-[#059669]">{p.construction_quality}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Valuation */}
              <div className="px-5 py-3.5 bg-[#F1F5F9] border-t border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#475569] uppercase block">Assessed ML Value</span>
                  <span className="text-base font-extrabold text-[#059669]">
                    INR {p.estimated_value ? (p.estimated_value / 10000000).toFixed(2) + ' Cr' : 'Unvalued'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDelete(p.id, e)}
                    className="p-1.5 text-[#475569] hover:text-[#DC2626] hover:bg-[#FFFFFF] rounded-lg transition-colors"
                    title="Delete property"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Property Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Register Collateral Property Asset</h3>
                <p className="text-xs text-[#475569]">Enter physical and location specifications for automated valuation calculation.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[#475569] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 text-xs text-[#DC2626] flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateProperty} className="mt-5 space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Property Name / Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Marina View Luxury Suite"
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Property Category</label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Locality / Cluster</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Full Legal Postal Address</label>
                <textarea
                  required
                  rows={2}
                  value={formData.full_address}
                  onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                  placeholder="Plot number, tower, street address, postal code"
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Land Area (sqft)</label>
                  <input
                    type="number"
                    required
                    value={formData.land_area_sqft}
                    onChange={(e) => setFormData({ ...formData, land_area_sqft: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Built-up Area (sqft)</label>
                  <input
                    type="number"
                    required
                    value={formData.built_up_area_sqft}
                    onChange={(e) => setFormData({ ...formData, built_up_area_sqft: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Asset Age (Years)</label>
                  <input
                    type="number"
                    value={formData.property_age_years}
                    onChange={(e) => setFormData({ ...formData, property_age_years: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Construction Grade</label>
                  <select
                    value={formData.construction_quality}
                    onChange={(e) => setFormData({ ...formData, construction_quality: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  >
                    <option value="Premium">Premium</option>
                    <option value="A Grade">A Grade</option>
                    <option value="Standard">Standard</option>
                    <option value="Economy">Economy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Physical Condition</label>
                  <select
                    value={formData.property_condition}
                    onChange={(e) => setFormData({ ...formData, property_condition: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Renovation">Needs Renovation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Parking Slots</label>
                  <input
                    type="number"
                    value={formData.parking_spaces}
                    onChange={(e) => setFormData({ ...formData, parking_spaces: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Architectural Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                />
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FFFFFF] text-[#475569] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Valuating & Ingesting...' : 'Submit & Compute Valuation'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Property Detail Modal */}
      {detailModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">{selectedProperty.name}</h3>
                <p className="text-xs text-[#475569]">{selectedProperty.full_address}</p>
              </div>
              <button onClick={() => setDetailModalOpen(false)} className="text-[#475569] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-44 rounded-xl overflow-hidden">
              <img src={selectedProperty.image_url} alt={selectedProperty.name} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                <span className="text-[#475569] block">Estimated Value:</span>
                <span className="text-lg font-bold text-[#059669]">
                  INR {selectedProperty.estimated_value ? (selectedProperty.estimated_value / 10000000).toFixed(2) + ' Cr' : 'Unvalued'}
                </span>
              </div>
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                <span className="text-[#475569] block">Built-up Dimension:</span>
                <span className="text-base font-bold text-[#0F172A]">{selectedProperty.built_up_area_sqft} sqft</span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-[#475569]">
              <p>Specification: <strong className="text-[#0F172A]">{selectedProperty.bedrooms} BHK, {selectedProperty.bathrooms} Bathrooms, {selectedProperty.parking_spaces} Parking</strong></p>
              <p>Construction: <strong className="text-[#0F172A]">{selectedProperty.construction_quality} ({selectedProperty.property_condition})</strong></p>
              <p>Asset Age: <strong className="text-[#0F172A]">{selectedProperty.property_age_years} Years</strong></p>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#3978F6] text-white text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PropertyList;
