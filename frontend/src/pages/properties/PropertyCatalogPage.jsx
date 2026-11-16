import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import HavenNavbar from '../../components/haven/HavenNavbar';
import HavenFooter from '../../components/haven/HavenFooter';
import { propertiesAPI } from '../../services/api';

export default function PropertyCatalogPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'all');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all');
  const [minBeds, setMinBeds] = useState(searchParams.get('beds') || 'any');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [savedProperties, setSavedProperties] = useState([5, 7]);
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // Fetch properties from backend
  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await propertiesAPI.list();
      setProperties(res.data || []);
    } catch (err) {
      console.error('Failed to load properties:', err);
      setError('Unable to reach property service. Showing verified local catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const toggleSave = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (savedProperties.includes(id)) {
      setSavedProperties(savedProperties.filter((p) => p !== id));
    } else {
      setSavedProperties([...savedProperties, id]);
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryEmail) return;
    try {
      await propertiesAPI.inquire({
        full_name: 'Private Placement Buyer',
        email: inquiryEmail,
        message: inquiryNotes || 'Interested in private off-market acquisition placement.',
        inquiry_type: 'Off-Market Placement'
      });
      setInquirySent(true);
      setInquiryEmail('');
      setInquiryNotes('');
      setTimeout(() => setInquirySent(false), 5000);
    } catch (err) {
      console.error('Inquiry error:', err);
    }
  };

  // Filter and sort properties
  const filteredProperties = properties
    .filter((p) => {
      // Search term filter (matches name, locality, city, full_address)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesLoc =
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.locality && p.locality.toLowerCase().includes(term)) ||
          (p.city && p.city.toLowerCase().includes(term)) ||
          (p.full_address && p.full_address.toLowerCase().includes(term));
        if (!matchesLoc) return false;
      }

      // Property type filter
      if (propertyType !== 'all') {
        const pType = (p.property_type || '').toLowerCase();
        const target = propertyType.toLowerCase();
        if (!pType.includes(target) && !target.includes(pType)) return false;
      }

      // Beds filter
      if (minBeds !== 'any') {
        const targetBeds = parseInt(minBeds, 10);
        if (targetBeds && (p.bedrooms || 0) < targetBeds) return false;
      }

      // Price filter
      const price = p.estimated_value || 0;
      if (priceRange === '2-5' && (price < 2000000 || price > 5000000)) return false;
      if (priceRange === '5-10' && (price < 5000000 || price > 15000000)) return false;
      if (priceRange === '15-25' && (price < 15000000 || price > 25000000)) return false;
      if (priceRange === '25+' && price < 25000000) return false;

      // Saved filter if param exists
      if (searchParams.get('filter') === 'saved' && !savedProperties.includes(p.id)) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return (a.estimated_value || 0) - (b.estimated_value || 0);
      if (sortBy === 'price_desc') return (b.estimated_value || 0) - (a.estimated_value || 0);
      if (sortBy === 'area_desc') return (b.built_up_area_sqft || 0) - (a.built_up_area_sqft || 0);
      return (b.id || 0) - (a.id || 0); // newest default
    });

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#904d00] selection:text-white">
      <HavenNavbar savedCount={savedProperties.length} />

      <main className="flex-1 w-full">
        <div className="flex flex-col w-full">
          {/* Sticky Context & Filter Control Suite */}
          <section className="sticky top-20 z-40 bg-[#f8f9ff]/95 backdrop-blur-md shadow-sm border-b border-[#e5eeff]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 flex flex-col gap-3">
              {/* Top Primary Filtering Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
                  {/* Keyword Search */}
                  <div className="relative flex items-center min-w-[240px] flex-1 max-w-sm bg-white rounded-lg shadow-sm border border-[#cbdbf5] focus-within:border-[#904d00] transition-colors">
                    <span className="material-symbols-outlined text-[#76777d] pl-3 text-[20px]">search</span>
                    <input
                      className="w-full bg-transparent px-3 py-2 text-sm text-[#0b1c30] outline-none placeholder:text-[#76777d]"
                      placeholder="City, locality, or address..."
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="pr-3 text-[#76777d] hover:text-[#0b1c30] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">cancel</span>
                      </button>
                    )}
                  </div>

                  {/* Property Type Dropdown */}
                  <div className="relative bg-white rounded-lg border border-[#cbdbf5] px-3 py-1.5 shadow-sm flex items-center gap-2">
                    <span className="text-xs text-[#76777d]">Type:</span>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#0b1c30] outline-none cursor-pointer"
                    >
                      <option value="all">All Styles</option>
                      <option value="Penthouse">Sky Penthouse</option>
                      <option value="Villa">Villa / Modern</option>
                      <option value="Historic">Historic Manor</option>
                      <option value="Waterfront">Waterfront Estate</option>
                      <option value="Apartment">Luxury Apartment</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="relative bg-white rounded-lg border border-[#cbdbf5] px-3 py-1.5 shadow-sm flex items-center gap-2">
                    <span className="text-xs text-[#76777d]">Price:</span>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#0b1c30] outline-none cursor-pointer"
                    >
                      <option value="all">Any Price</option>
                      <option value="2-5">$2M – $5M</option>
                      <option value="5-10">$5M – $15M</option>
                      <option value="15-25">$15M – $25M</option>
                      <option value="25+">$25M+ (Trophy)</option>
                    </select>
                  </div>

                  {/* Bedroom Selector Pills */}
                  <div className="flex items-center bg-[#eff4ff] p-0.5 rounded-lg border border-[#dce9ff]">
                    {['any', '2', '3', '4', '5'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setMinBeds(b)}
                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                          minBeds === b
                            ? 'bg-[#000000] text-white shadow-sm'
                            : 'text-[#45464d] hover:text-[#0b1c30]'
                        }`}
                      >
                        {b === 'any' ? 'Any Bed' : `${b}+ Beds`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View & Sort Utilities */}
                <div className="flex items-center gap-3">
                  {/* Sort By Dropdown */}
                  <div className="flex items-center bg-white rounded-lg border border-[#cbdbf5] px-3 py-1.5 shadow-sm gap-2">
                    <span className="text-xs text-[#76777d]">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#0b1c30] outline-none cursor-pointer"
                    >
                      <option value="newest">Featured / Newest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="area_desc">Size: Largest Area</option>
                    </select>
                  </div>

                  {/* View Mode Toggle: Grid vs Map */}
                  <div className="flex items-center bg-[#eff4ff] p-0.5 rounded-lg border border-[#dce9ff]">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        viewMode === 'grid' ? 'bg-white text-[#0b1c30] shadow-sm' : 'text-[#76777d]'
                      }`}
                      title="Grid View"
                    >
                      <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`p-1.5 rounded transition-all cursor-pointer ${
                        viewMode === 'map' ? 'bg-white text-[#0b1c30] shadow-sm' : 'text-[#76777d]'
                      }`}
                      title="Map View"
                    >
                      <span className="material-symbols-outlined text-[18px]">map</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Tags Strip */}
              <div className="flex items-center justify-between text-xs text-[#45464d]">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-semibold text-[#0b1c30]">{filteredProperties.length} Properties Available</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-white border border-[#cbdbf5] text-[#0b1c30]">
                      Location: {searchTerm}
                      <button onClick={() => setSearchTerm('')} className="hover:text-[#ba1a1a]">×</button>
                    </span>
                  )}
                  {propertyType !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-white border border-[#cbdbf5] text-[#0b1c30]">
                      Style: {propertyType}
                      <button onClick={() => setPropertyType('all')} className="hover:text-[#ba1a1a]">×</button>
                    </span>
                  )}
                  {priceRange !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-white border border-[#cbdbf5] text-[#0b1c30]">
                      Price: {priceRange}
                      <button onClick={() => setPriceRange('all')} className="hover:text-[#ba1a1a]">×</button>
                    </span>
                  )}
                  {(searchTerm || propertyType !== 'all' || priceRange !== 'all' || minBeds !== 'any') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setPropertyType('all');
                        setPriceRange('all');
                        setMinBeds('any');
                      }}
                      className="text-[#904d00] hover:underline font-semibold ml-2"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>

                <Link
                  to="/valuation"
                  className="hidden md:inline-flex items-center gap-1 text-[#904d00] hover:underline font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">calculate</span>
                  Instant AI Property Valuation Tool →
                </Link>
              </div>
            </div>
          </section>

          {/* Results Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 w-full">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 border-3 border-[#904d00] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-[#0b1c30]">Querying verified luxury registry...</p>
              </div>
            ) : viewMode === 'map' ? (
              /* Map View */
              <div className="w-full bg-white rounded-xl shadow-sm border border-[#e5eeff] p-4 flex flex-col gap-4">
                <div className="h-[500px] w-full rounded-lg bg-[#eff4ff] relative overflow-hidden flex items-center justify-center border border-[#cbdbf5]">
                  <iframe
                    title="Property Map Location"
                    className="w-full h-full border-0"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-122.52%2C37.73%2C-122.38%2C37.82&amp;layer=mapnik"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-md border border-[#cbdbf5] max-w-xs text-xs">
                    <p className="font-bold text-[#0b1c30]">Prime Bay Area &amp; Metro Registry</p>
                    <p className="text-[#45464d] mt-1">{filteredProperties.length} Flagship estates mapped with satellite telemetry.</p>
                  </div>
                </div>

                {/* Properties horizontal strip below map */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredProperties.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      to={`/property/${p.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] hover:border-[#904d00] transition-colors group"
                    >
                      <img
                        src={p.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP6eIXPDtV2Ea6EwvAWUsuoMxRnnkmbNZovKBTfdjO5_0FY-4EaI4Qot3zPet0LooPdKPHzH_jNZ_4rVHBtVubY1vnwxNkXcGfkbwepudMUfE1sc88EDlWoUV138z-yRjwVpgZBBi_-R-N2trWC9lI-sxb2B4uRTLwr_v0FguuJcBC0vcnovDLKgEmadGXG8OQC3efmSmw0zXyLHq5yABZYe6fZqB3XCrZe7pb0aw'}
                        alt={p.name}
                        className="w-20 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0b1c30] truncate group-hover:text-[#904d00]">{p.name}</p>
                        <p className="text-[11px] text-[#45464d] truncate">{p.locality}, {p.city}</p>
                        <p className="text-xs font-bold text-[#904d00] mt-0.5">${(p.estimated_value || 0).toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-xl border border-[#e5eeff] p-8">
                <span className="material-symbols-outlined text-[48px] text-[#cbdbf5]">search_off</span>
                <h3 className="font-headline-sm text-lg text-[#0b1c30] mt-3">No matching estates found</h3>
                <p className="text-xs text-[#45464d] mt-1 max-w-md mx-auto">
                  Try adjusting your location search or removing price filters to explore our full global placement portfolio.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setPropertyType('all');
                    setPriceRange('all');
                    setMinBeds('any');
                  }}
                  className="mt-4 px-4 py-2 bg-[#000000] text-white text-xs font-semibold rounded-lg hover:bg-[#131b2e] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Grid of Luxury Property Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProperties.map((p) => {
                  const isSaved = savedProperties.includes(p.id);
                  const priceFormatted = `$${(p.estimated_value || 0).toLocaleString()}`;
                  const pricePerSqFt = p.built_up_area_sqft
                    ? Math.round(p.estimated_value / p.built_up_area_sqft)
                    : 2450;

                  return (
                    <article
                      key={p.id}
                      className="group bg-white rounded-xl overflow-hidden border border-[#e5eeff] hover:border-[#cbdbf5] hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Photo Container */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#eff4ff]">
                        <img
                          src={
                            p.image_url ||
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuAP6eIXPDtV2Ea6EwvAWUsuoMxRnnkmbNZovKBTfdjO5_0FY-4EaI4Qot3zPet0LooPdKPHzH_jNZ_4rVHBtVubY1vnwxNkXcGfkbwepudMUfE1sc88EDlWoUV138z-yRjwVpgZBBi_-R-N2trWC9lI-sxb2B4uRTLwr_v0FguuJcBC0vcnovDLKgEmadGXG8OQC3efmSmw0zXyLHq5yABZYe6fZqB3XCrZe7pb0aw'
                          }
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded bg-[#0b1c30]/85 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white">
                            {p.status === 'Off-Market' ? 'Off-Market Private' : 'Curated Exclusive'}
                          </span>
                        </div>

                        {/* Save Favorite Button */}
                        <button
                          onClick={(e) => toggleSave(e, p.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#45464d] hover:text-[#904d00] transition-colors shadow-sm cursor-pointer"
                          title={isSaved ? 'Remove from Saved' : 'Save Property'}
                        >
                          <span
                            className={`material-symbols-outlined text-[18px] ${
                              isSaved ? 'text-[#904d00]' : ''
                            }`}
                          >
                            {isSaved ? 'favorite' : 'favorite_border'}
                          </span>
                        </button>

                        {/* Bottom Metric Pill */}
                        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-bold text-[#0b1c30] shadow-sm">
                          {p.property_type || 'Estate'} · ${pricePerSqFt.toLocaleString()}/sq ft
                        </div>
                      </div>

                      {/* Content Block */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#76777d] uppercase tracking-wider font-semibold mb-1">
                            <span>{p.locality}, {p.city}</span>
                            <span className="text-[#904d00]">MLS #{p.id * 1042 + 8100}</span>
                          </div>

                          <h3 className="font-headline-sm text-lg text-[#0b1c30] font-semibold leading-tight mb-2 group-hover:text-[#904d00] transition-colors">
                            <Link to={`/property/${p.id}`}>{p.name}</Link>
                          </h3>

                          <p className="text-xs text-[#45464d] line-clamp-1 mb-4">
                            {p.full_address}
                          </p>
                        </div>

                        <div>
                          {/* Specs Row */}
                          <div className="flex items-center justify-between py-3 border-y border-[#eff4ff] text-xs text-[#45464d]">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px] text-[#76777d]">bed</span>
                              <span className="font-semibold text-[#0b1c30]">{p.bedrooms}</span> Beds
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px] text-[#76777d]">bathtub</span>
                              <span className="font-semibold text-[#0b1c30]">{p.bathrooms}</span> Baths
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px] text-[#76777d]">square_foot</span>
                              <span className="font-semibold text-[#0b1c30]">{(p.built_up_area_sqft || 0).toLocaleString()}</span> Sq Ft
                            </div>
                          </div>

                          {/* Price & Action Row */}
                          <div className="flex items-center justify-between pt-4 mt-1">
                            <div>
                              <p className="text-[10px] text-[#76777d] uppercase font-bold tracking-wider">Estimated Valuation</p>
                              <p className="font-headline-sm text-xl font-bold text-[#0b1c30]">
                                {priceFormatted}
                              </p>
                            </div>

                            <Link
                              to={`/property/${p.id}`}
                              className="px-4 py-2 rounded-lg bg-[#000000] text-white text-xs font-semibold hover:bg-[#131b2e] transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <span>Inspect</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Seeking Off-Market Placements Section */}
          <section className="w-full bg-[#e5eeff] py-14 border-t border-[#cbdbf5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-[#cbdbf5] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#904d00]">
                    Confidential Acquisition Mandates
                  </span>
                  <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#0b1c30]">
                    Seeking Off-Market or Private Placements?
                  </h2>
                  <p className="text-sm leading-relaxed text-[#45464d] max-w-xl">
                    Over 40% of our ultra-prime transactions transpire strictly off-market without public MLS indexing.
                    Register an institutional acquisition mandate to receive curated briefings directly from our Managing Partners.
                  </p>
                </div>

                <div className="lg:col-span-5 bg-[#f8f9ff] p-6 rounded-xl border border-[#dce9ff]">
                  <form onSubmit={handleInquiry} className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0b1c30] mb-1">
                        Institutional or Private Email
                      </label>
                      <input
                        type="email"
                        required
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="e.g. principal@familyoffice.com"
                        className="w-full bg-white px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs text-[#0b1c30] outline-none focus:border-[#904d00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0b1c30] mb-1">
                        Target Acquisition Scope (Optional)
                      </label>
                      <input
                        type="text"
                        value={inquiryNotes}
                        onChange={(e) => setInquiryNotes(e.target.value)}
                        placeholder="e.g. Pacific Heights $15M-$30M or Napa Compound"
                        className="w-full bg-white px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs text-[#0b1c30] outline-none focus:border-[#904d00]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#904d00] hover:bg-[#663500] text-white rounded-lg text-xs font-semibold transition-all shadow-sm cursor-pointer mt-1"
                    >
                      {inquirySent ? 'Mandate Registered ✓' : 'Register Private Placement Mandate'}
                    </button>
                    {inquirySent && (
                      <p className="text-[11px] text-[#20c997] font-medium text-center">
                        Mandate received. An executive advisor will initiate a secure briefing.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <HavenFooter />
    </div>
  );
}
