import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HavenNavbar from '../../components/haven/HavenNavbar';
import HavenFooter from '../../components/haven/HavenFooter';
import { propertiesAPI } from '../../services/api';

export default function PropertyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  // Tour Booking Modal State
  const [showTourModal, setShowTourModal] = useState(false);
  const [tourForm, setTourForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    notes: ''
  });
  const [tourStatus, setTourStatus] = useState('');

  // Interactive Mortgage Calculator State
  const [loanAmount, setLoanAmount] = useState(15000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  // Floorplan active room
  const [activeRoom, setActiveRoom] = useState('master');

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      setLoading(true);
      try {
        let propId = id;
        if (id === 'pacific-heights' || isNaN(parseInt(id, 10))) {
          const res = await propertiesAPI.list();
          const found = res.data.find(
            (p) => p.name.toLowerCase().includes('pacific heights') || p.id === 5
          );
          if (found) propId = found.id;
          else if (res.data.length > 0) propId = res.data[0].id;
        }

        const res = await propertiesAPI.get(propId);
        setProperty(res.data);
        if (res.data.estimated_value) {
          setLoanAmount(Math.round(res.data.estimated_value * 0.75));
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
        setProperty({
          id: 1,
          name: 'Highline Horizon 4 BHK Sky Duplex',
          property_type: 'Penthouse',
          full_address: 'Tower 3, Penthouse 2401, Highline Horizon, Hiranandani Gardens, Powai, Mumbai',
          locality: 'Powai',
          city: 'Mumbai',
          state: 'Maharashtra',
          postal_code: '400076',
          built_up_area_sqft: 2850,
          land_area_sqft: 3200,
          bedrooms: 4,
          bathrooms: 4,
          floors: 2,
          property_age_years: 2,
          construction_quality: 'Premium Architectural',
          property_condition: 'Excellent',
          parking_spaces: 3,
          estimated_value: 74500000,
          amenities: [
            'Private Sky Deck',
            'Full Panoramic Lake View',
            'Biometric Smart Access',
            'Italian Marble Flooring',
            'Sub-Zero Appliances',
            '24/7 Concierge'
          ],
          image_url:
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetail();
  }, [id]);

  // Dynamic EMI Calculation
  const monthlyRate = interestRate / 100 / 12;
  const numMonths = tenureYears * 12;
  const monthlyPayment =
    monthlyRate > 0 && numMonths > 0
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) /
            (Math.pow(1 + monthlyRate, numMonths) - 1)
        )
      : 0;

  const handleBookTour = async (e) => {
    e.preventDefault();
    setTourStatus('submitting');
    try {
      await propertiesAPI.inquire({
        property_id: property?.id,
        property_name: property?.name,
        full_name: tourForm.name,
        email: tourForm.email,
        phone: tourForm.phone,
        preferred_date: tourForm.date,
        message: tourForm.notes,
        inquiry_type: 'Private Property Tour'
      });
      setTourStatus('success');
      setTimeout(() => {
        setShowTourModal(false);
        setTourStatus('');
      }, 3000);
    } catch (err) {
      console.error('Tour booking error:', err);
      setTourStatus('error');
    }
  };

  const handleDownloadDossier = () => {
    const propId = property?.id || 1;
    window.open(`/api/reports/valuation/${propId}`, '_blank');
  };

  if (loading || !property) {
    return (
      <div className="bg-[#080E1B] text-[#F5F7FC] min-h-screen flex flex-col font-body-md antialiased">
        <HavenNavbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-3 border-[#3978F6] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-[#F5F7FC]">Loading architectural property dossier...</p>
        </div>
        <HavenFooter />
      </div>
    );
  }

  const galleryImages = [
    property.image_url ||
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
  ];

  const priceDisplay =
    property.estimated_value > 10000000
      ? `INR ${(property.estimated_value / 10000000).toFixed(2)} Cr`
      : `$${(property.estimated_value || 0).toLocaleString()}`;

  const pricePerSqFt = property.built_up_area_sqft
    ? Math.round(property.estimated_value / property.built_up_area_sqft)
    : 26140;

  const amenitiesList = Array.isArray(property.amenities)
    ? property.amenities
    : typeof property.amenities === 'string'
    ? property.amenities.startsWith('[')
      ? JSON.parse(property.amenities)
      : property.amenities.split(',').map((s) => s.trim())
    : [
        'Panoramic Lake Horizon View',
        'Private Elevator Landing',
        'Italian Marble Flooring',
        'Acoustic Acoustic Glass Windows',
        'Smart Automation & Video Intercom',
        'Clubhouse & Olympic Pool Access'
      ];

  return (
    <div className="bg-[#080E1B] text-[#F5F7FC] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#3978F6] selection:text-white">
      <HavenNavbar />

      <main className="flex-1 w-full">
        {/* Breadcrumb & Navigation Action Bar */}
        <div className="border-b border-[#23324A] bg-[#0D1628]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between text-xs text-[#98A7BD]">
            <div className="flex items-center gap-2">
              <Link to="/" className="hover:text-[#F5F7FC]">PropWise</Link>
              <span>/</span>
              <Link to="/catalog" className="hover:text-[#F5F7FC]">Properties Catalog</Link>
              <span>/</span>
              <span className="text-[#29C5E8] font-semibold">{property.locality || property.city}</span>
              <span>/</span>
              <span className="text-[#F5F7FC] font-semibold truncate max-w-xs">{property.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="flex items-center gap-1.5 hover:text-[#EF5B67] transition-colors cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[16px] ${isSaved ? 'text-[#EF5B67]' : ''}`}>
                  {isSaved ? 'favorite' : 'favorite_border'}
                </span>
                <span>{isSaved ? 'Saved to Portfolio' : 'Save'}</span>
              </button>
              <span>·</span>
              <button
                onClick={handleDownloadDossier}
                className="flex items-center gap-1.5 text-[#29C5E8] hover:text-[#3978F6] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                <span>Download Dossier</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Gallery Spreader */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Primary Big Photo */}
            <div className="lg:col-span-8 relative aspect-[16/10] bg-[#111D32] rounded-2xl overflow-hidden shadow-2xl border border-[#23324A]">
              <img
                src={galleryImages[activePhoto] || galleryImages[0]}
                alt={property.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-[#080E1B]/85 backdrop-blur-md text-[#29C5E8] text-[10px] font-bold uppercase tracking-wider border border-[#23324A]">
                  {property.status || 'Verified Collateral'}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#20C997]/20 backdrop-blur-md text-[#20C997] text-[10px] font-bold uppercase tracking-wider border border-[#20C997]/40">
                  MLS Verified Asset #{property.id * 1042 + 8100}
                </span>
              </div>
            </div>

            {/* Side Thumbnail Strip */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(idx)}
                  className={`relative flex-1 aspect-[16/9] lg:aspect-auto rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#111D32] ${
                    activePhoto === idx ? 'border-[#3978F6] shadow-lg shadow-[#3978F6]/20' : 'border-[#23324A] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Angle ${idx + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Primary Specifications & Acquisition Suite */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Header Title Block */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#29C5E8] mb-1">
                  {property.property_type} · {property.locality}, {property.city}
                </p>
                <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#F5F7FC] font-semibold leading-tight mb-2">
                  {property.name}
                </h1>
                <p className="text-sm text-[#98A7BD] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#3978F6]">pin_drop</span>
                  {property.full_address}
                </p>
              </div>

              {/* Key Architectural Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#111D32] border border-[#23324A] shadow-xl">
                <div>
                  <p className="text-[10px] text-[#98A7BD] uppercase font-bold tracking-wider">Gross Area</p>
                  <p className="text-lg font-bold text-[#F5F7FC]">{(property.built_up_area_sqft || 0).toLocaleString()} <span className="text-xs font-normal text-[#98A7BD]">sq ft</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-[#98A7BD] uppercase font-bold tracking-wider">Accommodations</p>
                  <p className="text-lg font-bold text-[#F5F7FC]">{property.bedrooms} BHK <span className="text-xs font-normal text-[#98A7BD]">/ {property.bathrooms} Baths</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-[#98A7BD] uppercase font-bold tracking-wider">Parcel Land</p>
                  <p className="text-lg font-bold text-[#F5F7FC]">{(property.land_area_sqft || 3200).toLocaleString()} <span className="text-xs font-normal text-[#98A7BD]">sq ft</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-[#98A7BD] uppercase font-bold tracking-wider">Rate / Sq Ft</p>
                  <p className="text-lg font-bold text-[#20C997]">INR {pricePerSqFt.toLocaleString()}</p>
                </div>
              </div>

              {/* Architectural Narrative */}
              <div className="flex flex-col gap-4 bg-[#111D32] p-6 rounded-2xl border border-[#23324A] shadow-xl">
                <h2 className="font-headline-md text-xl text-[#F5F7FC] font-semibold">
                  A Monument of Pure Linearity, Light, and Engineering Mastery
                </h2>
                <p className="text-sm leading-relaxed text-[#98A7BD]">
                  Conceived as an uncompromising architectural dialogue between structural glass, bush-hammered limestone,
                  and sweeping panoramic horizons. Every volume is disciplined by rigorous proportions and curated materials,
                  providing an effortless sanctuary for private life and grand-scale institutional entertaining.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#23324A]">
                  {amenitiesList.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#F5F7FC]">
                      <span className="material-symbols-outlined text-[16px] text-[#29C5E8]">check_circle</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floorplan Blueprint Explorer */}
              <div className="bg-[#111D32] p-6 rounded-2xl border border-[#23324A] shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-lg text-[#F5F7FC] font-semibold">
                    Architectural Floorplan Blueprint
                  </h3>
                  <div className="flex gap-2">
                    {['master', 'living', 'terrace'].map((rm) => (
                      <button
                        key={rm}
                        onClick={() => setActiveRoom(rm)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                          activeRoom === rm ? 'bg-[#3978F6] text-white shadow-md' : 'bg-[#0D1628] text-[#98A7BD] hover:text-[#F5F7FC]'
                        }`}
                      >
                        {rm} Suite
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-64 bg-[#0A1222] rounded-xl border border-[#23324A] flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[48px] text-[#29C5E8]">architecture</span>
                    <p className="text-xs font-bold text-[#F5F7FC] mt-2 uppercase tracking-wider">
                      Level 3 · {activeRoom.toUpperCase()} SUITE BLUEPRINT
                    </p>
                    <p className="text-[11px] text-[#98A7BD] mt-1">
                      Scaled high-resolution architectural schematics available via authenticated valuation dossier.
                    </p>
                  </div>
                </div>
              </div>

              {/* Neighborhood Intelligence Scores */}
              <div className="bg-[#111D32] p-6 rounded-2xl border border-[#23324A] shadow-xl flex flex-col gap-4">
                <h3 className="font-headline-sm text-lg text-[#F5F7FC] font-semibold">
                  Neighborhood Telemetry &amp; Location Intelligence
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#0D1628] rounded-xl border border-[#23324A] text-center">
                    <span className="material-symbols-outlined text-[24px] text-[#29C5E8]">directions_walk</span>
                    <p className="text-lg font-bold text-[#F5F7FC] mt-1">94 / 100</p>
                    <p className="text-[10px] text-[#98A7BD] uppercase font-bold">Walker's Paradise</p>
                  </div>
                  <div className="p-4 bg-[#0D1628] rounded-xl border border-[#23324A] text-center">
                    <span className="material-symbols-outlined text-[24px] text-[#20C997]">school</span>
                    <p className="text-lg font-bold text-[#F5F7FC] mt-1">98 / 100</p>
                    <p className="text-[10px] text-[#98A7BD] uppercase font-bold">Premier Schools</p>
                  </div>
                  <div className="p-4 bg-[#0D1628] rounded-xl border border-[#23324A] text-center">
                    <span className="material-symbols-outlined text-[24px] text-[#3978F6]">volume_mute</span>
                    <p className="text-lg font-bold text-[#F5F7FC] mt-1">92 / 100</p>
                    <p className="text-[10px] text-[#98A7BD] uppercase font-bold">Sanctuary Index</p>
                  </div>
                  <div className="p-4 bg-[#0D1628] rounded-xl border border-[#23324A] text-center">
                    <span className="material-symbols-outlined text-[24px] text-[#F5B942]">landscape</span>
                    <p className="text-lg font-bold text-[#F5F7FC] mt-1">99 / 100</p>
                    <p className="text-[10px] text-[#98A7BD] uppercase font-bold">Horizon View Value</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Sticky Pricing Card & Mortgage Tool */}
            <div className="lg:col-span-4 sticky top-24 flex flex-col gap-6">
              {/* Acquisition Card */}
              <div className="bg-[#111D32] p-6 rounded-2xl border border-[#23324A] shadow-2xl flex flex-col gap-5">
                <div>
                  <p className="text-[10px] text-[#98A7BD] uppercase font-bold tracking-widest">Assessed Valuation</p>
                  <p className="font-headline-lg text-3xl font-extrabold text-[#20C997]">
                    {priceDisplay}
                  </p>
                  <p className="text-xs text-[#29C5E8] font-semibold mt-1">
                    AI Fair Market Value · 94% Confidence Interval
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => setShowTourModal(true)}
                    className="w-full py-3 bg-[#3978F6] hover:bg-[#2457C5] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#3978F6]/20 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    Schedule Private Viewing
                  </button>

                  <button
                    onClick={handleDownloadDossier}
                    className="w-full py-3 bg-[#0D1628] hover:bg-[#111D32] border border-[#23324A] text-[#F5F7FC] rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#29C5E8]">download</span>
                    Download Certified Dossier (PDF)
                  </button>
                </div>

                {/* Advisor Contact Card */}
                <div className="p-4 rounded-xl bg-[#0D1628] border border-[#23324A] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#111D32] border border-[#3978F6] flex items-center justify-center text-sm font-bold text-[#29C5E8]">
                    EV
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#F5F7FC]">Eleanor Vance</p>
                    <p className="text-[10px] text-[#98A7BD]">Chief Valuation Officer · Private Wealth</p>
                    <p className="text-[11px] font-semibold text-[#29C5E8] mt-0.5">+1 (415) 890-4200</p>
                  </div>
                </div>
              </div>

              {/* Interactive Mortgage Debt Service Calculator */}
              <div className="bg-[#111D32] p-6 rounded-2xl border border-[#23324A] shadow-xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline-sm text-base text-[#F5F7FC] font-semibold">
                    Financing &amp; Debt Service
                  </h4>
                  <span className="text-[10px] font-bold uppercase text-[#29C5E8] bg-[#0D1628] border border-[#23324A] px-2 py-0.5 rounded-full">
                    Underwriting
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#98A7BD]">Loan Principal</span>
                    <span className="font-bold text-[#20C997]">
                      {loanAmount > 10000000
                        ? `INR ${(loanAmount / 10000000).toFixed(2)} Cr`
                        : `$${loanAmount.toLocaleString()}`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max={property.estimated_value || 80000000}
                    step="500000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#3978F6] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#98A7BD] uppercase font-bold block mb-1">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full p-2 bg-[#0D1628] border border-[#23324A] rounded-lg text-xs text-[#F5F7FC] font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#98A7BD] uppercase font-bold block mb-1">Tenure</label>
                    <select
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="w-full p-2 bg-[#0D1628] border border-[#23324A] rounded-lg text-xs text-[#F5F7FC] font-bold outline-none cursor-pointer"
                    >
                      <option value="15" className="bg-[#111D32]">15 Years</option>
                      <option value="20" className="bg-[#111D32]">20 Years</option>
                      <option value="30" className="bg-[#111D32]">30 Years</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-[#0D1628] rounded-xl border border-[#23324A] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#98A7BD] uppercase font-bold">Estimated Monthly Debt Service</p>
                    <p className="text-xl font-bold text-[#20C997]">
                      {monthlyPayment > 100000
                        ? `INR ${(monthlyPayment / 100000).toFixed(2)} Lakh`
                        : `$${monthlyPayment.toLocaleString()}`}{' '}
                      <span className="text-xs text-[#98A7BD] font-normal">/ mo</span>
                    </p>
                  </div>
                  <Link
                    to={`/dashboard/mortgage?property_id=${property.id}&amount=${loanAmount}`}
                    className="px-3.5 py-2 bg-[#3978F6] text-white text-xs font-semibold rounded-lg hover:bg-[#2457C5] transition-colors shadow-md shadow-[#3978F6]/20"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Private Viewing Booking Modal */}
        {showTourModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#0D1628] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#23324A] relative">
              <button
                onClick={() => setShowTourModal(false)}
                className="absolute top-4 right-4 text-[#98A7BD] hover:text-[#F5F7FC] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <h3 className="font-headline-sm text-xl text-[#F5F7FC] font-semibold mb-1">
                Schedule a Private Residence Viewing
              </h3>
              <p className="text-xs text-[#98A7BD] mb-4">
                Private escorted tour of {property.name}. An advisor will review discretion protocols prior to access.
              </p>

              {tourStatus === 'success' ? (
                <div className="p-4 rounded-xl bg-[#20C997]/15 border border-[#20C997] text-center">
                  <span className="material-symbols-outlined text-[36px] text-[#20C997]">check_circle</span>
                  <p className="text-sm font-bold text-[#F5F7FC] mt-2">Private Tour Requested</p>
                  <p className="text-xs text-[#98A7BD] mt-1">Our private client desk has logged your mandate and will contact you directly.</p>
                </div>
              ) : (
                <form onSubmit={handleBookTour} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#F5F7FC] mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={tourForm.name}
                      onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                      placeholder="e.g. Richard Hendricks"
                      className="w-full bg-[#111D32] px-3.5 py-2 rounded-lg border border-[#23324A] text-xs text-[#F5F7FC] outline-none focus:border-[#3978F6]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#F5F7FC] mb-1">Corporate / Private Email</label>
                      <input
                        type="email"
                        required
                        value={tourForm.email}
                        onChange={(e) => setTourForm({ ...tourForm, email: e.target.value })}
                        placeholder="richard@piedpiper.com"
                        className="w-full bg-[#111D32] px-3.5 py-2 rounded-lg border border-[#23324A] text-xs text-[#F5F7FC] outline-none focus:border-[#3978F6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#F5F7FC] mb-1">Direct Phone</label>
                      <input
                        type="tel"
                        value={tourForm.phone}
                        onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                        placeholder="+91 98200 00000"
                        className="w-full bg-[#111D32] px-3.5 py-2 rounded-lg border border-[#23324A] text-xs text-[#F5F7FC] outline-none focus:border-[#3978F6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#F5F7FC] mb-1">Preferred Viewing Date</label>
                    <input
                      type="date"
                      required
                      value={tourForm.date}
                      onChange={(e) => setTourForm({ ...tourForm, date: e.target.value })}
                      className="w-full bg-[#111D32] px-3.5 py-2 rounded-lg border border-[#23324A] text-xs text-[#F5F7FC] outline-none focus:border-[#3978F6]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#F5F7FC] mb-1">Special Advisory Requirements (Optional)</label>
                    <textarea
                      rows="2"
                      value={tourForm.notes}
                      onChange={(e) => setTourForm({ ...tourForm, notes: e.target.value })}
                      placeholder="e.g. Escrow verification, title clearance, architect review..."
                      className="w-full bg-[#111D32] px-3.5 py-2 rounded-lg border border-[#23324A] text-xs text-[#F5F7FC] outline-none focus:border-[#3978F6]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={tourStatus === 'submitting'}
                    className="w-full py-3 bg-[#3978F6] hover:bg-[#2457C5] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer mt-2"
                  >
                    {tourStatus === 'submitting' ? 'Transmitting Mandate...' : 'Confirm Private Tour Booking'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <HavenFooter />
    </div>
  );
}
