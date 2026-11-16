import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HavenNavbar from '../../components/haven/HavenNavbar';
import HavenFooter from '../../components/haven/HavenFooter';
import { propertiesAPI, valuationAPI } from '../../services/api';

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
  const [loanAmount, setLoanAmount] = useState(20000000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenureYears, setTenureYears] = useState(30);

  // Floorplan active room
  const [activeRoom, setActiveRoom] = useState('master');

  useEffect(() => {
    const fetchPropertyDetail = async () => {
      setLoading(true);
      try {
        let propId = id;
        if (id === 'pacific-heights' || isNaN(parseInt(id, 10))) {
          // Find Pacific Heights or first property
          const res = await propertiesAPI.list();
          const found = res.data.find(
            (p) => p.name.toLowerCase().includes('pacific heights') || p.id === 5
          );
          if (found) {
            propId = found.id;
          } else if (res.data.length > 0) {
            propId = res.data[0].id;
          }
        }

        const res = await propertiesAPI.get(propId);
        setProperty(res.data);
        if (res.data.estimated_value) {
          setLoanAmount(Math.round(res.data.estimated_value * 0.75));
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
        // Fallback default flagship record
        setProperty({
          id: 5,
          name: 'The Pacific Heights Glass Residence',
          property_type: 'Sky Penthouse',
          full_address: '2840 Pacific Avenue, Pacific Heights, San Francisco, CA 94115',
          locality: 'Pacific Heights',
          city: 'San Francisco',
          state: 'California',
          postal_code: '94115',
          built_up_area_sqft: 8200,
          land_area_sqft: 18295,
          bedrooms: 6,
          bathrooms: 8,
          floors: 3,
          property_age_years: 4,
          construction_quality: 'Ultra Luxury Specification',
          property_condition: 'Pristine Architecture',
          parking_spaces: 4,
          estimated_value: 28500000,
          amenities: [
            'Private Panoramic Elevator',
            'Full-Floor Sky Terrace',
            '2,400 Bottle Temperature-Controlled Cave',
            'Heated Lap Pool & Wellness Spa',
            'Commercial Prep Scullery',
            'Biometric Smart Security'
          ],
          image_url:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAP6eIXPDtV2Ea6EwvAWUsuoMxRnnkmbNZovKBTfdjO5_0FY-4EaI4Qot3zPet0LooPdKPHzH_jNZ_4rVHBtVubY1vnwxNkXcGfkbwepudMUfE1sc88EDlWoUV138z-yRjwVpgZBBi_-R-N2trWC9lI-sxb2B4uRTLwr_v0FguuJcBC0vcnovDLKgEmadGXG8OQC3efmSmw0zXyLHq5yABZYe6fZqB3XCrZe7pb0aw'
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
      <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-body-md antialiased">
        <HavenNavbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-3 border-[#904d00] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-[#0b1c30]">Loading architectural property dossier...</p>
        </div>
        <HavenFooter />
      </div>
    );
  }

  const galleryImages = [
    property.image_url ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAP6eIXPDtV2Ea6EwvAWUsuoMxRnnkmbNZovKBTfdjO5_0FY-4EaI4Qot3zPet0LooPdKPHzH_jNZ_4rVHBtVubY1vnwxNkXcGfkbwepudMUfE1sc88EDlWoUV138z-yRjwVpgZBBi_-R-N2trWC9lI-sxb2B4uRTLwr_v0FguuJcBC0vcnovDLKgEmadGXG8OQC3efmSmw0zXyLHq5yABZYe6fZqB3XCrZe7pb0aw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDq7mJpGOiK5VwiOU5IDSUSvRCQ2hGD6LI8Sl-FXSHH7w3gVO',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ7OlWfwYAgEQuFAeu_8mx0Fjigt67ic2LTZsXTItU1WmH1Y',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBC-zHw1I7s0Cs34hoIF_jObWM7LGkcgqD1S1LxVlzRfU9KMq'
  ];

  const pricePerSqFt = property.built_up_area_sqft
    ? Math.round(property.estimated_value / property.built_up_area_sqft)
    : 3475;

  const amenitiesList = Array.isArray(property.amenities)
    ? property.amenities
    : typeof property.amenities === 'string'
    ? property.amenities.startsWith('[')
      ? JSON.parse(property.amenities)
      : property.amenities.split(',').map((s) => s.trim())
    : [
        'Panoramic Skyline Terrace',
        'Private High-Speed Elevator',
        'Dual Chef Kitchens',
        'Floor-to-Ceiling Acoustic Glass',
        'Automated Solar Shading',
        'Sub-Zero & Gaggenau Suite'
      ];

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#904d00] selection:text-white">
      <HavenNavbar />

      <main className="flex-1 w-full">
        {/* Breadcrumb & Navigation Action Bar */}
        <div className="border-b border-[#e5eeff] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3 flex items-center justify-between text-xs text-[#76777d]">
            <div className="flex items-center gap-2">
              <Link to="/" className="hover:text-[#0b1c30]">Haven &amp; Key</Link>
              <span>/</span>
              <Link to="/catalog" className="hover:text-[#0b1c30]">Estates Catalog</Link>
              <span>/</span>
              <span className="text-[#0b1c30] font-semibold">{property.locality || property.city}</span>
              <span>/</span>
              <span className="text-[#904d00] font-semibold truncate max-w-xs">{property.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="flex items-center gap-1 hover:text-[#904d00] transition-colors cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[16px] ${isSaved ? 'text-[#904d00]' : ''}`}>
                  {isSaved ? 'favorite' : 'favorite_border'}
                </span>
                <span>{isSaved ? 'Saved to Portfolio' : 'Save'}</span>
              </button>
              <span>·</span>
              <button
                onClick={handleDownloadDossier}
                className="flex items-center gap-1 hover:text-[#0b1c30] transition-colors cursor-pointer"
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
            <div className="lg:col-span-8 relative aspect-[16/10] bg-[#eff4ff] rounded-2xl overflow-hidden shadow-sm border border-[#e5eeff]">
              <img
                src={galleryImages[activePhoto] || galleryImages[0]}
                alt={property.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded bg-[#0b1c30]/85 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
                  {property.status === 'Off-Market' ? 'Off-Market Private' : 'Curated Masterpiece'}
                </span>
                <span className="px-3 py-1 rounded bg-[#904d00]/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
                  Verified MLS #{property.id * 1042 + 8100}
                </span>
              </div>
            </div>

            {/* Side Thumbnail Strip */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhoto(idx)}
                  className={`relative flex-1 aspect-[16/9] lg:aspect-auto rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhoto === idx ? 'border-[#904d00] shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Primary Specifications & Acquisition Suite */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Columns: Storytelling, Specs, Floorplan */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Header Title Block */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-[#904d00] mb-1">
                  {property.property_type} · {property.locality}, {property.city}
                </p>
                <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#0b1c30] font-semibold leading-tight mb-2">
                  {property.name}
                </h1>
                <p className="text-sm text-[#45464d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#76777d]">pin_drop</span>
                  {property.full_address}
                </p>
              </div>

              {/* Key Architectural Metric Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-xl bg-white border border-[#e5eeff] shadow-sm">
                <div>
                  <p className="text-[10px] text-[#76777d] uppercase font-bold tracking-wider">Gross Area</p>
                  <p className="text-lg font-bold text-[#0b1c30]">{(property.built_up_area_sqft || 0).toLocaleString()} <span className="text-xs font-normal text-[#76777d]">sq ft</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-[#76777d] uppercase font-bold tracking-wider">Accommodations</p>
                  <p className="text-lg font-bold text-[#0b1c30]">{property.bedrooms} Beds <span className="text-xs font-normal text-[#76777d]">/ {property.bathrooms} Baths</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-[#76777d] uppercase font-bold tracking-wider">Lot Parcel</p>
                  <p className="text-lg font-bold text-[#0b1c30]">{(property.land_area_sqft || 18000).toLocaleString()} <span className="text-xs font-normal text-[#76777d]">sq ft</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-[#76777d] uppercase font-bold tracking-wider">Price / Sq Ft</p>
                  <p className="text-lg font-bold text-[#904d00]">${pricePerSqFt.toLocaleString()}</p>
                </div>
              </div>

              {/* Architectural Narrative */}
              <div className="flex flex-col gap-4 bg-white p-6 rounded-xl border border-[#e5eeff] shadow-sm">
                <h2 className="font-headline-md text-xl text-[#0b1c30] font-semibold">
                  A Monument of Pure Linearity, Light, and Engineering Mastery
                </h2>
                <p className="text-sm leading-relaxed text-[#45464d]">
                  Conceived as an uncompromising architectural dialogue between structural glass, bush-hammered limestone,
                  and sweeping panoramic Bay horizons. Every volume is disciplined by rigorous proportions and curated materials,
                  providing an effortless sanctuary for private life and grand-scale institutional entertaining.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#eff4ff]">
                  {amenitiesList.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#0b1c30]">
                      <span className="material-symbols-outlined text-[16px] text-[#904d00]">check_circle</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floorplan Blueprint Explorer */}
              <div className="bg-white p-6 rounded-xl border border-[#e5eeff] shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-lg text-[#0b1c30] font-semibold">
                    Architectural Floorplan Blueprint
                  </h3>
                  <div className="flex gap-2">
                    {['master', 'living', 'terrace'].map((rm) => (
                      <button
                        key={rm}
                        onClick={() => setActiveRoom(rm)}
                        className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors cursor-pointer ${
                          activeRoom === rm ? 'bg-[#000000] text-white' : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30]'
                        }`}
                      >
                        {rm} Suite
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-64 bg-[#f8f9ff] rounded-lg border border-[#cbdbf5] flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[48px] text-[#904d00]">architecture</span>
                    <p className="text-xs font-bold text-[#0b1c30] mt-2 uppercase tracking-wider">
                      Level 3 · {activeRoom.toUpperCase()} SUITE BLUEPRINT
                    </p>
                    <p className="text-[11px] text-[#76777d] mt-1">
                      Scaled high-resolution architectural schematics available via authenticated dossier.
                    </p>
                  </div>
                </div>
              </div>

              {/* Neighborhood Intelligence Scores */}
              <div className="bg-white p-6 rounded-xl border border-[#e5eeff] shadow-sm flex flex-col gap-4">
                <h3 className="font-headline-sm text-lg text-[#0b1c30] font-semibold">
                  Neighborhood Telemetry &amp; Location Intelligence
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff] text-center">
                    <span className="material-symbols-outlined text-[24px] text-[#904d00]">directions_walk</span>
                    <p className="text-lg font-bold text-[#0b1c30] mt-1">94 / 100</p>
                    <p className="text-[10px] text-[#76777d] uppercase font-bold">Walker's Paradise</p>
                  </div>
                  <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff] text-center">
                    <span className="material-symbols-outlined text-[24px] text-[#20c997]">school</span>
                    <p className="text-lg font-bold text-[#0b1c30] mt-1">98 / 100</p>
                    <p className="text-[10px] text-[#76777d] uppercase font-bold">Premier Private Schools</p>
                  </div>
                  <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff] text-center">
                    <span className="material-symbols-outlined text-[24px] text-[#3978f6]">volume_mute</span>
                    <p className="text-lg font-bold text-[#0b1c30] mt-1">92 / 100</p>
                    <p className="text-[10px] text-[#76777d] uppercase font-bold">Quiet Sanctuary Index</p>
                  </div>
                  <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#e5eeff] text-center">
                    <span className="material-symbols-outlined text-[24px] text-[#fe932c]">landscape</span>
                    <p className="text-lg font-bold text-[#0b1c30] mt-1">99 / 100</p>
                    <p className="text-[10px] text-[#76777d] uppercase font-bold">Horizon View Value</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Columns: Sticky Pricing Card & Mortgage Tool */}
            <div className="lg:col-span-4 sticky top-24 flex flex-col gap-6">
              {/* Acquisition Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#cbdbf5] shadow-lg flex flex-col gap-5">
                <div>
                  <p className="text-[10px] text-[#76777d] uppercase font-bold tracking-widest">Offered At</p>
                  <p className="font-headline-lg text-3xl font-bold text-[#0b1c30]">
                    ${(property.estimated_value || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-[#20c997] font-semibold mt-1">
                    AI Fair Market Value: ${(property.estimated_value * 0.98).toLocaleString()} – ${(property.estimated_value * 1.04).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => setShowTourModal(true)}
                    className="w-full py-3 bg-[#904d00] hover:bg-[#663500] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    Schedule Private Viewing
                  </button>

                  <button
                    onClick={handleDownloadDossier}
                    className="w-full py-3 bg-white hover:bg-[#eff4ff] border border-[#cbdbf5] text-[#0b1c30] rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Download Certified Dossier (PDF)
                  </button>
                </div>

                {/* Advisor Contact Card */}
                <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] flex items-center gap-3">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP6eIXPDtV2Ea6EwvAWUsuoMxRnnkmbNZovKBTfdjO5_0FY-4EaI4Qot3zPet0LooPdKPHzH_jNZ_4rVHBtVubY1vnwxNkXcGfkbwepudMUfE1sc88EDlWoUV138z-yRjwVpgZBBi_-R-N2trWC9lI-sxb2B4uRTLwr_v0FguuJcBC0vcnovDLKgEmadGXG8OQC3efmSmw0zXyLHq5yABZYe6fZqB3XCrZe7pb0aw"
                    alt="Eleanor Vance"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#904d00]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#0b1c30]">Eleanor Vance</p>
                    <p className="text-[10px] text-[#76777d]">Managing Partner · Private Advisory</p>
                    <p className="text-[11px] font-semibold text-[#904d00] mt-0.5">+1 (415) 890-4200</p>
                  </div>
                </div>
              </div>

              {/* Interactive Mortgage Debt Service Calculator */}
              <div className="bg-white p-6 rounded-2xl border border-[#e5eeff] shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline-sm text-base text-[#0b1c30] font-semibold">
                    Financing &amp; Debt Service
                  </h4>
                  <span className="text-[10px] font-bold uppercase text-[#904d00] bg-[#eff4ff] px-2 py-0.5 rounded">
                    Underwriting
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#76777d]">Loan Principal</span>
                    <span className="font-bold text-[#0b1c30]">${loanAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="5000000"
                    max={property.estimated_value || 35000000}
                    step="500000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full accent-[#904d00] cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#76777d] uppercase font-bold block mb-1">Interest Rate</label>
                    <input
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full p-2 bg-[#f8f9ff] border border-[#cbdbf5] rounded text-xs text-[#0b1c30] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#76777d] uppercase font-bold block mb-1">Tenure (Years)</label>
                    <select
                      value={tenureYears}
                      onChange={(e) => setTenureYears(Number(e.target.value))}
                      className="w-full p-2 bg-[#f8f9ff] border border-[#cbdbf5] rounded text-xs text-[#0b1c30] font-bold"
                    >
                      <option value="15">15 Years</option>
                      <option value="20">20 Years</option>
                      <option value="30">30 Years</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#76777d] uppercase font-bold">Estimated Monthly Debt Service</p>
                    <p className="text-xl font-bold text-[#0b1c30]">${monthlyPayment.toLocaleString()} <span className="text-xs text-[#76777d] font-normal">/ mo</span></p>
                  </div>
                  <Link
                    to={`/dashboard/mortgage?property_id=${property.id}&amount=${loanAmount}`}
                    className="px-3 py-1.5 bg-[#000000] text-white text-xs font-semibold rounded hover:bg-[#131b2e] transition-colors"
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
          <div className="fixed inset-0 z-50 bg-[#0b1c30]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#cbdbf5] relative">
              <button
                onClick={() => setShowTourModal(false)}
                className="absolute top-4 right-4 text-[#76777d] hover:text-[#0b1c30] p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <h3 className="font-headline-sm text-xl text-[#0b1c30] font-semibold mb-1">
                Schedule a Private Residence Viewing
              </h3>
              <p className="text-xs text-[#45464d] mb-4">
                Private escorted tour of {property.name}. An advisor will review discretion protocols prior to access.
              </p>

              {tourStatus === 'success' ? (
                <div className="p-4 rounded-xl bg-[#20c997]/15 border border-[#20c997] text-center">
                  <span className="material-symbols-outlined text-[36px] text-[#20c997]">check_circle</span>
                  <p className="text-sm font-bold text-[#0b1c30] mt-2">Private Tour Requested</p>
                  <p className="text-xs text-[#45464d] mt-1">Our private client desk has logged your mandate and will contact you directly.</p>
                </div>
              ) : (
                <form onSubmit={handleBookTour} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={tourForm.name}
                      onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                      placeholder="e.g. Richard Hendricks"
                      className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs text-[#0b1c30] outline-none focus:border-[#904d00]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Corporate / Private Email</label>
                      <input
                        type="email"
                        required
                        value={tourForm.email}
                        onChange={(e) => setTourForm({ ...tourForm, email: e.target.value })}
                        placeholder="richard@piedpiper.com"
                        className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs text-[#0b1c30] outline-none focus:border-[#904d00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Direct Phone</label>
                      <input
                        type="tel"
                        value={tourForm.phone}
                        onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                        placeholder="+1 (415) 000-0000"
                        className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs text-[#0b1c30] outline-none focus:border-[#904d00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Preferred Viewing Date</label>
                    <input
                      type="date"
                      required
                      value={tourForm.date}
                      onChange={(e) => setTourForm({ ...tourForm, date: e.target.value })}
                      className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs text-[#0b1c30] outline-none focus:border-[#904d00]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Special Advisory Requirements (Optional)</label>
                    <textarea
                      rows="2"
                      value={tourForm.notes}
                      onChange={(e) => setTourForm({ ...tourForm, notes: e.target.value })}
                      placeholder="e.g. Architect consultation, escrow verification, private helicopter landing..."
                      className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs text-[#0b1c30] outline-none focus:border-[#904d00]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={tourStatus === 'submitting'}
                    className="w-full py-3 bg-[#904d00] hover:bg-[#663500] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer mt-2"
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
