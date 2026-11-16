import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HavenNavbar from '../../components/haven/HavenNavbar';
import HavenFooter from '../../components/haven/HavenFooter';

export default function PropertyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [tourBooked, setTourBooked] = useState(false);
  const [loanAmount, setLoanAmount] = useState(20000000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenureYears, setTenureYears] = useState(30);

  // EMI formula
  const monthlyRate = (interestRate / 100) / 12;
  const numMonths = tenureYears * 12;
  const emi = Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1)) || 0;

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#904d00] selection:text-white">
      <HavenNavbar />

      <main className="flex-1 w-full">
<div className="flex flex-col w-full">
{/* Status Bar & Sub-Navigation Header */}
<section className="w-full bg-surface-container-lowest shadow-sm">
<div className="max-w-7xl mx-auto px-margin py-space-md">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
{/* Breadcrumbs & Identifiers */}
<div className="flex flex-col gap-space-xs">
<nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
<Link className="hover:text-primary transition-colors"  to="/catalog">California</Link>
<span className="text-outline-variant">/</span>
<Link className="hover:text-primary transition-colors"  to="/catalog">San Francisco</Link>
<span className="text-outline-variant">/</span>
<Link className="hover:text-primary transition-colors"  to="/catalog">Pacific Heights</Link>
<span className="text-outline-variant">/</span>
<span className="text-on-surface font-semibold">2840 Pacific Ave</span>
</nav>
<div className="flex items-center gap-space-sm flex-wrap">
<span className="bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase px-space-sm py-0.5 rounded">Active Exclusive</span>
<span className="text-on-surface-variant font-label-md text-label-md">MLS #982410</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span className="text-on-surface-variant font-label-md text-label-md">Offered via Private Salon Advisory</span>
</div>
</div>
{/* Utility Action CTAs */}
<div className="flex items-center gap-space-sm flex-wrap">
<button className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-sm" id="savePropertyBtn">
<span className="material-symbols-outlined text-[18px] text-secondary" id="saveIcon">favorite</span>
<span id="saveText">Saved</span>
</button>
<button className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-sm">
<span className="material-symbols-outlined text-[18px]">share</span>
<span>Share Dossier</span>
</button>
<Link className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors shadow-sm"  to="/catalog">
<span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
<span>Architectural PDF</span>
</Link>
<Link className="flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container font-label-md text-label-md shadow-sm transition-all"  to="/catalog">
<span className="material-symbols-outlined text-[18px]">calendar_month</span>
<span>Book Private Salon</span>
</Link>
</div>
</div>
</div>
</section>
{/* Title & Headline Pricing Bar */}
<section className="w-full bg-surface-container-low py-space-lg">
<div className="max-w-7xl mx-auto px-margin">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
<div className="flex flex-col">
<p className="font-label-caps text-label-caps uppercase text-secondary tracking-widest mb-space-xs">Private Architectural Commission • Gold Coast Tier</p>
<h1 className="font-headline-lg text-headline-lg text-on-surface">The Pacific Heights Glass Residence</h1>
<p className="font-title-md text-title-md text-on-surface-variant flex items-center gap-space-xs mt-space-xs">
<span className="material-symbols-outlined text-[20px] text-secondary">pin_drop</span>
            2840 Pacific Avenue, Pacific Heights, San Francisco, CA 94115
          </p>
</div>
<div className="flex flex-col md:items-end bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div className="flex items-baseline gap-space-xs">
<span className="font-headline-lg text-headline-lg text-on-surface font-medium">$12,850,000</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Est. <strong className="text-on-surface font-semibold">$68,400/mo</strong> • Private financing available</p>
</div>
</div>
</div>
</section>
{/* Editorial Photo Mosaic Hero */}
<section className="w-full max-w-7xl mx-auto px-margin pt-space-md pb-space-lg">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-sm h-auto lg:h-[620px] relative rounded-xl overflow-hidden shadow-md">
{/* Panoramic Left Primary Image (65% width equiv: 8 cols) */}
<div className="lg:col-span-8 relative group overflow-hidden h-[360px] lg:h-full bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Modern ultra-luxury architectural mansion in Pacific Heights San Francisco, dramatic floor-to-ceiling glass curtain facade, warm amber evening interior lighting, cantilevered black steel terraces framing views of the Golden Gate Bridge and misty blue bay waters under dusk sky, cinematic architectural photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq7mJpGOiK5VwiOU5IDSUSvRCQ2hGD6LI8Sl-FXSHH7w3gVOLBpj0xYUHXFLD1dr4PBPnLyYX32nLp1pOn53BVL5GjHQ0vEvFg9pT4OXcs9UjJazoeRMKZyxca2IXImTTt3UBxc2-gK5HuldGNuWAYFKFZYHL1v_b42odMa-XYZ5Kr0w98lVODRjc2r16P9rYxjj340Yz5adQLz0dcu0DYgfE_30AZHDjHeakM0O4"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>
<div className="absolute bottom-space-lg left-space-lg right-space-lg flex items-center justify-between pointer-events-auto">
<div className="flex items-center gap-space-xs bg-surface/90 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-sm text-on-surface">
<span className="material-symbols-outlined text-[18px] text-secondary">architecture</span>
<span className="font-label-caps text-label-caps uppercase">North-Western Horizon • Custom Triple Acoustic Glazing</span>
</div>
<button className="bg-primary hover:bg-primary-container text-on-primary px-space-md py-space-xs rounded-full font-label-md text-label-md flex items-center gap-space-xs shadow-md transition-all">
<span className="material-symbols-outlined text-[18px]">view_in_ar</span>
<span>Launch 3D Matterport Tour</span>
</button>
</div>
</div>
{/* Right Mosaic (4 cols, 2x2 grid) */}
<div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-space-sm h-full">
{/* Photo 2: Living Room Skyline */}
<div className="relative group overflow-hidden h-[180px] lg:h-[148px] bg-surface-container rounded-lg">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Spacious minimalist living salon with bespoke Italian walnut cabinetry, custom travertine fireplace, modern tailored furniture in oatmeal and navy hues, illuminated city view of San Francisco Bay, warm recessed architectural lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ7OlWfwYAgEQuFAeu_8mx0Fjigt67ic2LTZsXTItU1WmH1YZuiLleeKibtwzBtaPYoL6FaHGFxQHrSgFNfDRnecECxXkubKGtYbdCYxRogLOOr7ZaGSk42dTHIQEtNfzyTnskV_c6ETwP0bDeN7IG3JB29qStYVA5B0DAYwOj6P2ks7yIhKaHrcT6ABqQ6ayuHMpTUY-CNcbf5IfgKbmK21minx1GivwN0OEpwsM"/>
<div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-sm px-space-xs py-0.5 rounded text-on-surface font-label-caps text-label-caps">Grand Salon</div>
</div>
{/* Photo 3: Calacatta Chef Kitchen */}
<div className="relative group overflow-hidden h-[180px] lg:h-[148px] bg-surface-container rounded-lg">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Editorial luxury kitchen with massive honed Calacatta marble island, fluted oak millwork, integrated Gaggenau appliances, minimalist matte brass faucet fixtures, soft daylight pouring through clerestory windows." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC-zHw1I7s0Cs34hoIF_jObWM7LGkcgqD1S1LxVlzRfU9KMq23-ZukUdWwjBqsA-bAzHUN6oZcyxkgj-1MQVo0EFL_wGoZstP8rVXp7VATw3NwvAPFK3jawa9_lp12sNptybbvSgCDklWBljPLseFQvgMVmFfHVW5YJjGhPO62rEfcSTnY_uQarB6I-vIa-iQwuqc2VREgehWfc6D99w8W7P-8xz_hF3vqOiYdpbk"/>
<div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-sm px-space-xs py-0.5 rounded text-on-surface font-label-caps text-label-caps">Culinary Studio</div>
</div>
{/* Photo 4: Primary Spa Bath */}
<div className="relative group overflow-hidden h-[180px] lg:h-[148px] bg-surface-container rounded-lg">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Monolithic bathroom spa with freestanding soaking tub carved from limestone, bookmatched marble slab walls, frameless rain shower with brass detail, overlooking manicured Japanese zen courtyard." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFxaYxtD3KeZIXU4o_AqsVHXAR3V-NuBRgMjBlxhMWh5obTz82XQlp5iuewz03HfABYxGAJZw15vEV6OsM8zQp6txpeHtm_AdlEpLYgxmfUkHAb2F5Q_oPPdFyvzd4oqrjgrIPks6iYu6a5HLyOpnbGXGMd06cydeST5QndQ-IwXrBEq5XhY56CIDJWLKQswJuzNI9hLGUcGroAhbtkib32ybmw5goXCHV99CJVnc"/>
<div className="absolute bottom-2 left-2 bg-surface/90 backdrop-blur-sm px-space-xs py-0.5 rounded text-on-surface font-label-caps text-label-caps">Primary Wellness Bath</div>
</div>
{/* Photo 5: Outdoor Terrace Overlook */}
<div className="relative group overflow-hidden h-[180px] lg:h-[148px] bg-surface-container rounded-lg cursor-pointer">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" data-alt="Sunset view from an expansive rooftop ipe-wood terrace with glass railings, modern linear gas fire pit, outdoor lounge chairs overlooking twilight San Francisco skyline and twinkling bridge lights." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIbYz9hMHQcc1_LJBkZ1AvEoDDRoeoM8IAnABWBrUGciOYoI6TXzZD-wEL-xtNvCPJk3zin7YGoRHOYIEOevRSeavqGRKszZEw2Iayze5pgL9JW6v82QUPTmR2H0rm7MgobrpSCwOgD5bAglOXxxJv6AwqTO8C6Mtarw_AsBjsxo9K2fXK75h96RT0V9d5rsBP_8OJ91Ffc87v4cD_A4QlFYFBU9tdZoUlqWK0l4Q"/>
<div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/50 transition-colors flex items-center justify-center">
<div className="flex items-center gap-space-xs bg-surface-container-lowest text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded-full shadow-md">
<span className="material-symbols-outlined text-[18px]">photo_library</span>
<span>+28 Gallery Views</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Key Specification Attribute Ribbon */}
<section className="w-full max-w-7xl mx-auto px-margin mb-space-xl">
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div className="flex flex-col p-space-sm bg-surface-container-low rounded-lg">
<span className="flex items-center gap-1 font-label-caps text-label-caps uppercase text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">bed</span> Suites
        </span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">5 Beds</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">All En-Suite</span>
</div>
<div className="flex flex-col p-space-sm bg-surface-container-low rounded-lg">
<span className="flex items-center gap-1 font-label-caps text-label-caps uppercase text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">bathtub</span> Baths
        </span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">6 Baths</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">5 Full, 2 Powder</span>
</div>
<div className="flex flex-col p-space-sm bg-surface-container-low rounded-lg">
<span className="flex items-center gap-1 font-label-caps text-label-caps uppercase text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">square_foot</span> Interior
        </span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">6,850</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Gross Sq Ft ($1,875/sf)</span>
</div>
<div className="flex flex-col p-space-sm bg-surface-container-low rounded-lg">
<span className="flex items-center gap-1 font-label-caps text-label-caps uppercase text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">crop_landscape</span> Grounds
        </span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">0.35 Acre</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">15,246 sq ft parcel</span>
</div>
<div className="flex flex-col p-space-sm bg-surface-container-low rounded-lg">
<span className="flex items-center gap-1 font-label-caps text-label-caps uppercase text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">garage</span> Motor Court
        </span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">3-Car</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Heated + 2 EV Superchargers</span>
</div>
<div className="flex flex-col p-space-sm bg-surface-container-low rounded-lg">
<span className="flex items-center gap-1 font-label-caps text-label-caps uppercase text-on-surface-variant">
<span className="material-symbols-outlined text-[16px] text-secondary">event_available</span> Completed
        </span>
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">2022</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Snohetta Design Collab</span>
</div>
</div>
</section>
{/* Two-Column Master Editorial Grid */}
<section className="w-full max-w-7xl mx-auto px-margin mb-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
{/* Left Column (65% width: 8 columns) */}
<div className="lg:col-span-8 flex flex-col gap-space-xl">
{/* Architectural Narrative */}
<article className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Architectural Dossier</span>
<span className="font-label-md text-label-md text-on-surface-variant">Curated by Studio Pacifica</span>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface">A Monument of Light, Pure Linearity, and Engineering Mastery</h2>
<div className="font-body-lg text-body-lg text-on-surface-variant space-y-space-md leading-relaxed">
<p>
              Commanding one of Pacific Heights’ most sovereign parcels, <strong>2840 Pacific Avenue</strong> introduces an uncompromising dialog between monumental architecture and the natural atmospheric theater of San Francisco Bay. Designed in deliberate contrast to the neighborhood's historic Victorian streetscape, this 2022 residence leverages structural steel moment framing to enable column-free interior expanses wrapped in triple-glazed acoustically isolated glass.
            </p>
<p>
              Interior volumes celebrate pure material honesty: bookmatched Calacatta Borghini marble slabs, continuous planks of sustainably harvested Danish white oak, and hand-troweled Roman clay walls that capture shifting Northern California coastal daylight. An open-concept salon spills seamlessly onto 1,400 square feet of heated exterior terrace space equipped with an integrated stainless plunge spa, gas fire channels, and unobstructed vantage points framing Alcatraz, the Marin Headlands, and the Golden Gate Bridge.
            </p>
</div>
{/* Highlight Metric Badges */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-sm">
<div className="p-space-sm bg-surface-container-low rounded-lg">
<p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Ceiling Height</p>
<p className="font-title-lg text-title-lg text-on-surface font-semibold">11' 6" Vaulted</p>
</div>
<div className="p-space-sm bg-surface-container-low rounded-lg">
<p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Wine Cellar</p>
<p className="font-title-lg text-title-lg text-on-surface font-semibold">900-Bottle Climate</p>
</div>
<div className="p-space-sm bg-surface-container-low rounded-lg">
<p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Private Elevators</p>
<p className="font-title-lg text-title-lg text-on-surface font-semibold">Tri-Level Glass Cab</p>
</div>
</div>
</article>
{/* Comprehensive Features Accordion / Categorized Bento */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Curated Estate Amenities</h3>
<span className="font-label-caps text-label-caps text-secondary uppercase">All Inclusions</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
{/* Column 1: Interior Finishes */}
<div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-space-sm">
<div className="flex items-center gap-space-xs text-secondary">
<span className="material-symbols-outlined text-[20px]">chair</span>
<span className="font-title-md text-title-md text-on-surface font-semibold">Interior Finishes</span>
</div>
<ul className="font-body-md text-body-md text-on-surface-variant space-y-space-xs">
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Poliform bespoke walk-in dressings</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Gaggenau 400 Series Dual Range</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Sculptural floating steel staircase</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Radiant heated Danish oak flooring</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Secondary Butler’s Catering Galley</span>
</li>
</ul>
</div>
{/* Column 2: Grounds & Wellness */}
<div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-space-sm">
<div className="flex items-center gap-space-xs text-secondary">
<span className="material-symbols-outlined text-[20px]">spa</span>
<span className="font-title-md text-title-md text-on-surface font-semibold">Grounds &amp; Spa</span>
</div>
<ul className="font-body-md text-body-md text-on-surface-variant space-y-space-xs">
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Cantilevered infinity plunge spa</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Finnish cedar dry sauna &amp; cold dunk</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Outdoor Kalamazoo kitchen suite</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Zen reflection court with black bamboo</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Rooftop stargazing lounge &amp; hearth</span>
</li>
</ul>
</div>
{/* Column 3: Tech & Security */}
<div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-space-sm">
<div className="flex items-center gap-space-xs text-secondary">
<span className="material-symbols-outlined text-[20px]">nest_eco_leaf</span>
<span className="font-title-md text-title-md text-on-surface font-semibold">Smart &amp; Energy</span>
</div>
<ul className="font-body-md text-body-md text-on-surface-variant space-y-space-xs">
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Full Savant Smart Automation Core</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>14.8 kW Rooftop Solar + 3 Tesla Powerwalls</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Lutron HomeWorks Palladiom Keypads</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Commercial HEPA &amp; UV Air Filtration</span>
</li>
<li className="flex items-start gap-space-xs">
<span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">check_circle</span>
<span>Biometric Entry &amp; Infrared Perimeter</span>
</li>
</ul>
</div>
</div>
</div>
{/* Interactive Floor Plans Preview */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md" id="floorplans">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Architectural Floorplans</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Scale-calibrated schematic blueprints</p>
</div>
{/* Plan Tabs */}
<div className="flex items-center p-1 bg-surface-container-low rounded-lg" id="planTabContainer">
<button className="px-space-md py-space-xs rounded font-label-md text-label-md bg-surface-container-lowest text-on-surface shadow-sm transition-all" id="tab-level1" onclick="switchPlan('level1')">Level 1: Grand Living</button>
<button className="px-space-md py-space-xs rounded font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all" id="tab-level2" onclick="switchPlan('level2')">Level 2: Primary Suite</button>
<button className="px-space-md py-space-xs rounded font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all" id="tab-level3" onclick="switchPlan('level3')">Lower: Cellar &amp; Spa</button>
</div>
</div>
{/* Floorplan Viewport Graphic */}
<div className="relative w-full h-[380px] bg-surface-container-low rounded-xl overflow-hidden flex items-center justify-center p-space-md">
{/* Simulated SVG Blueprint Canvas */}
<div className="w-full h-full flex flex-col items-center justify-center text-center" id="plan-display">
<svg className="w-full max-h-[280px] text-on-surface" viewbox="0 0 760 300">
{/* Outer Envelope */}
<rect fill="none" height="260" opacity="0.85" rx="4" stroke="currentColor" stroke-dasharray="0" strokeWidth="2.5" width="720" x="20" y="20"></rect>
{/* Great Room Zone */}
<rect fill="currentColor" fill-opacity="0.04" height="150" stroke="currentColor" strokeWidth="1.5" width="380" x="30" y="30"></rect>
<text className="font-label-caps text-[11px] fill-current uppercase tracking-wider font-bold" text-anchor="middle" x="220" y="105">Grand Reception &amp; View Loggia (38' x 24')</text>
{/* Calacatta Kitchen Zone */}
<rect fill="currentColor" fill-opacity="0.04" height="150" stroke="currentColor" strokeWidth="1.5" width="310" x="420" y="30"></rect>
<text className="font-label-caps text-[11px] fill-current uppercase tracking-wider font-bold" text-anchor="middle" x="575" y="105">Culinary Studio &amp; Pantry (28' x 20')</text>
{/* Atrium & Elevator Core */}
<rect fill="currentColor" fill-opacity="0.08" height="80" stroke="currentColor" strokeWidth="1.5" width="160" x="300" y="190"></rect>
<text className="font-label-caps text-[10px] fill-current uppercase tracking-wider" text-anchor="middle" x="380" y="235">Glass Atrium / Lift</text>
{/* Library Salon */}
<rect fill="currentColor" fill-opacity="0.04" height="80" stroke="currentColor" strokeWidth="1.5" width="260" x="30" y="190"></rect>
<text className="font-label-caps text-[10px] fill-current uppercase tracking-wider" text-anchor="middle" x="160" y="235">Executive Library (22' x 16')</text>
{/* Dining Pavilion */}
<rect fill="currentColor" fill-opacity="0.04" height="80" stroke="currentColor" strokeWidth="1.5" width="260" x="470" y="190"></rect>
<text className="font-label-caps text-[10px] fill-current uppercase tracking-wider" text-anchor="middle" x="600" y="235">Formal Banquet (24' x 16')</text>
{/* Dimension Marks */}
<line stroke="currentColor" stroke-dasharray="4" strokeWidth="1" x1="20" x2="740" y1="290" y2="290"></line>
<text className="font-label-caps text-[9px] fill-current" text-anchor="middle" x="380" y="298">92 FEET 6 INCHES TOTAL FAÇADE</text>
</svg>
</div>
<div className="absolute bottom-space-md right-space-md flex gap-space-xs">
<button className="bg-surface-container-lowest text-on-surface hover:bg-surface-container px-space-md py-space-xs rounded-lg font-label-md text-label-md flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-[16px]">zoom_in</span> Fullscreen
              </button>
<button className="bg-surface-container-lowest text-on-surface hover:bg-surface-container px-space-md py-space-xs rounded-lg font-label-md text-label-md flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-[16px]">download</span> CAD / Vector Spec
              </button>
</div>
</div>
</div>
{/* Interactive Mortgage & Investment Calculator */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div>
<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Financial Structuring</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Acquisition &amp; Ownership Outlay</h3>
</div>
<span className="font-label-md text-label-md text-on-surface-variant">Assumes 30-Yr Fixed Jumbo Loan</span>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
{/* Inputs (7 cols) */}
<div className="lg:col-span-7 flex flex-col gap-space-md">
<div>
<div className="flex justify-between font-label-md text-label-md mb-space-xs">
<span className="text-on-surface font-medium">Purchase Capital</span>
<span className="font-semibold text-on-surface" id="calcPriceDisplay">$12,850,000</span>
</div>
<input className="w-full accent-secondary cursor-pointer h-2 bg-surface-container-high rounded-lg appearance-none" id="priceSlider" max="20000000" min="8000000" step="250000" type="range" value="12850000"/>
</div>
<div>
<div className="flex justify-between font-label-md text-label-md mb-space-xs">
<span className="text-on-surface font-medium">Down Payment (20%)</span>
<span className="font-semibold text-on-surface" id="downPaymentDisplay">$2,570,000</span>
</div>
<input className="w-full accent-secondary cursor-pointer h-2 bg-surface-container-high rounded-lg appearance-none" id="downSlider" max="60" min="10" step="5" type="range" value="20"/>
</div>
<div className="grid grid-cols-2 gap-space-md">
<div className="p-space-sm bg-surface-container-low rounded-lg">
<label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">Interest Rate</label>
<div className="font-title-md text-title-md text-on-surface font-semibold flex items-center justify-between">
<span>5.85%</span>
<span className="material-symbols-outlined text-[18px] text-outline">tune</span>
</div>
</div>
<div className="p-space-sm bg-surface-container-low rounded-lg">
<label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">Annual Prop Tax Rate</label>
<div className="font-title-md text-title-md text-on-surface font-semibold flex items-center justify-between">
<span>1.18%</span>
<span className="material-symbols-outlined text-[18px] text-outline">account_balance</span>
</div>
</div>
</div>
</div>
{/* Calculated Breakdown Donut & Total (5 cols) */}
<div className="lg:col-span-5 bg-surface-container-low p-space-md rounded-xl flex flex-col items-center">
{/* Inline SVG Donut */}
<div className="relative w-36 h-36 flex items-center justify-center my-space-xs">
<svg className="w-full h-full -rotate-90" viewbox="0 0 100 100">
<circle cx="50" cy="50" fill="none" r="40" stroke="#d3e4fe" strokeWidth="12"></circle>
{/* Principal & Interest: 70% */}
<circle cx="50" cy="50" fill="none" r="40" stroke="#000000" stroke-dasharray="176 251.2" stroke-dashoffset="0" strokeWidth="12"></circle>
{/* Property Tax: 20% */}
<circle cx="50" cy="50" fill="none" r="40" stroke="#904d00" stroke-dasharray="50.2 251.2" stroke-dashoffset="-176" strokeWidth="12"></circle>
{/* Insurance + HOA: 10% */}
<circle cx="50" cy="50" fill="none" r="40" stroke="#fe932c" stroke-dasharray="25 251.2" stroke-dashoffset="-226.2" strokeWidth="12"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total/Mo</span>
<span className="font-title-lg text-title-lg text-on-surface font-bold" id="monthlyTotalDisplay">$68,400</span>
</div>
</div>
{/* Legend */}
<div className="w-full flex flex-col gap-1.5 mt-space-sm font-body-sm text-body-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span className="text-on-surface-variant">Principal &amp; Interest</span>
</div>
<span className="font-semibold text-on-surface">$50,650</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
<span className="text-on-surface-variant">Property Tax (SF)</span>
</div>
<span className="font-semibold text-on-surface">$12,630</span>
</div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
<span className="text-on-surface-variant">Hazard Ins. &amp; Reserve</span>
</div>
<span className="font-semibold text-on-surface">$5,120</span>
</div>
</div>
</div>
</div>
</div>
{/* Neighborhood Context & Walkability Scores */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div>
<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Enclave Intelligence</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Pacific Heights • Gold Coast Corridor</h3>
</div>
<span className="bg-surface-container-high text-on-surface font-label-caps text-label-caps px-space-sm py-1 rounded">Rank #1 SF Luxury ZIP</span>
</div>
{/* Static Map Placeholder */}
<div className="w-full h-56 bg-cover bg-center rounded-xl shadow-inner relative overflow-hidden" data-location="2840 Pacific Avenue, San Francisco, CA" style={{"backgroundImage": "url(https://lh3.googleusercontent.com/aida-public/AB6AXuAVvKzUy73X8ECX1zvnhLpn7zyoJLfsYVNSpRB4Q-nbc5kbqAGQbeCM0a_YR8BJHb3Ll1GtgYdsn-NR01tTewtwvevUfmYDcLZ82AavoddzXtSao9c9IlKdGZWlkjymwnWPcjMiaZrf2JxbdStrRLYRX7jSqps3K6lbB0pq2h-gSj7_NSCSex4sZnJIJTzip_O5UOBId6U-q_EEYdnong4OvUzgWg2MlIIObTzH_kA)"}}>
<div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]"></div>
<div className="absolute top-4 left-4 bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-lg shadow-md flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
<div>
<p className="font-label-md text-label-md text-on-surface font-bold">2840 Pacific Ave</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Between Divisadero &amp; Scott Streets</p>
</div>
</div>
</div>
{/* Metrics Ribbon */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
<div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Walk Score</span>
<span className="material-symbols-outlined text-secondary text-[18px]">directions_walk</span>
</div>
<p className="font-headline-sm text-headline-sm text-on-surface font-bold">96 / 100</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Walker's Paradise • 4 blocks to Fillmore Street Boutiques</p>
</div>
<div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Top Academic Institutions</span>
<span className="material-symbols-outlined text-secondary text-[18px]">school</span>
</div>
<p className="font-headline-sm text-headline-sm text-on-surface font-bold">10 / 10</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Town School for Boys, Hamlin, Convent &amp; Stuart Hall</p>
</div>
<div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Transit &amp; Airport Access</span>
<span className="material-symbols-outlined text-secondary text-[18px]">flight</span>
</div>
<p className="font-headline-sm text-headline-sm text-on-surface font-bold">22 Mins</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">SFO Signature Flight Support • 10 Mins to FiDi Financial</p>
</div>
</div>
</div>
</div>
{/* Right Column (35% width: 4 columns) - Sticky Booking & Advisor Suite */}
<aside className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-space-lg">
{/* Private Tour Concierge Card */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md" id="schedule-tour">
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider">Advisory Booking</span>
<span className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-secondary"></span> Concierge Ready
            </span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Schedule a Private Showing</h3>
{/* Mode Toggle: In-Person vs Live Video */}
<div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-lg gap-1">
<button className="py-space-xs px-space-sm rounded font-label-md text-label-md bg-surface-container-lowest text-on-surface font-semibold shadow-sm transition-all text-center" id="toggleInPerson" onclick="setTourType('in-person')">
              In-Person Salon
            </button>
<button className="py-space-xs px-space-sm rounded font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all text-center" id="toggleVirtual" onclick="setTourType('virtual')">
              Virtual Live Video
            </button>
</div>
{/* Date Selector (Next 4 Days Carousel) */}
<div className="flex flex-col gap-space-xs">
<label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Select Inspection Date</label>
<div className="grid grid-cols-4 gap-space-xs text-center">
<button className="tour-date-btn p-space-xs rounded-lg bg-primary text-on-primary flex flex-col items-center transition-all" onclick="selectDate(this)">
<span className="font-label-caps text-[10px] uppercase opacity-80">Thu</span>
<span className="font-title-md text-title-md font-bold">24</span>
<span className="font-label-caps text-[9px] uppercase">Oct</span>
</button>
<button className="tour-date-btn p-space-xs rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex flex-col items-center transition-all" onclick="selectDate(this)">
<span className="font-label-caps text-[10px] uppercase text-on-surface-variant">Fri</span>
<span className="font-title-md text-title-md font-bold">25</span>
<span className="font-label-caps text-[9px] uppercase text-on-surface-variant">Oct</span>
</button>
<button className="tour-date-btn p-space-xs rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex flex-col items-center transition-all" onclick="selectDate(this)">
<span className="font-label-caps text-[10px] uppercase text-on-surface-variant">Sat</span>
<span className="font-title-md text-title-md font-bold">26</span>
<span className="font-label-caps text-[9px] uppercase text-on-surface-variant">Oct</span>
</button>
<button className="tour-date-btn p-space-xs rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container flex flex-col items-center transition-all" onclick="selectDate(this)">
<span className="font-label-caps text-[10px] uppercase text-on-surface-variant">Mon</span>
<span className="font-title-md text-title-md font-bold">28</span>
<span className="font-label-caps text-[9px] uppercase text-on-surface-variant">Oct</span>
</button>
</div>
</div>
{/* Time Slot Selector */}
<div className="flex flex-col gap-space-xs">
<label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Available Window</label>
<div className="grid grid-cols-2 gap-space-xs">
<button className="time-btn py-space-xs px-space-sm rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors text-center border-0" onclick="selectTime(this)">10:00 AM</button>
<button className="time-btn py-space-xs px-space-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md text-center" onclick="selectTime(this)">1:30 PM</button>
<button className="time-btn py-space-xs px-space-sm rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors text-center" onclick="selectTime(this)">3:45 PM</button>
<button className="time-btn py-space-xs px-space-sm rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors text-center" onclick="selectTime(this)">Sunset 5:30 PM</button>
</div>
</div>
{/* Contact Inputs */}
<div className="flex flex-col gap-space-sm">
<input className="w-full bg-surface-container-low text-on-surface px-space-md py-space-sm rounded-lg font-body-sm text-body-sm outline-none focus:ring-1 focus:ring-secondary" placeholder="Full Legal Name" type="text"/>
<input className="w-full bg-surface-container-low text-on-surface px-space-md py-space-sm rounded-lg font-body-sm text-body-sm outline-none focus:ring-1 focus:ring-secondary" placeholder="Institutional or Private Email" type="email"/>
<input className="w-full bg-surface-container-low text-on-surface px-space-md py-space-sm rounded-lg font-body-sm text-body-sm outline-none focus:ring-1 focus:ring-secondary" placeholder="Mobile / WhatsApp (+1 ...)" type="tel"/>
</div>
{/* Action Button */}
<button className="w-full py-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider transition-all shadow-md" id="requestShowingBtn" onclick="confirmAppointment()">
            Request Private Appointment
          </button>
<p className="font-body-sm text-body-sm text-on-surface-variant text-center">
            Subject to pre-qualification verification. Discrete NDA provided prior to arrival.
          </p>
</div>
{/* Listing Agent Authority Card */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center gap-space-md">
<img className="w-16 h-16 rounded-full object-cover shadow-sm ring-2 ring-secondary/20" data-alt="Monochrome professional headshot portrait of senior luxury real estate partner, elegant tailored dark Italian suit, confident approachable expression, clean architectural office backdrop with soft studio illumination." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk_GJHzxkFUoxB4Ayc3x6GRAnwuQzVAYgDu8I4XmBY677up_cejV0qzGJKyltYiUUMw7dw37-hbZ-DaAcXFQxOLC4cbotkDl-t211b1PR6kdA05rfB-R3YTTPf0Cxz1RUgS_X8_K80ZjEr2Tmgc_cOLY0eVfGz4uH07_dxTH4UUiJNMSPv0v-aebH80ULzeSnlFxXTleWMT0Ji2moFsJzliF6oJ7fw772C633rSGQ"/>
<div className="flex flex-col min-w-0">
<span className="font-label-caps text-label-caps uppercase text-secondary">Exclusive Listing Partner</span>
<h4 className="font-title-lg text-title-lg text-on-surface truncate">Julian Vance-Montague</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant truncate">Managing Director • DRE #01894210</p>
</div>
</div>
{/* Track Record Metrics */}
<div className="grid grid-cols-2 gap-space-sm py-space-xs">
<div className="p-space-sm bg-surface-container-low rounded-lg text-center">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">$1.4B+</span>
<p className="font-label-caps text-label-caps uppercase text-on-surface-variant">Career Volume</p>
</div>
<div className="p-space-sm bg-surface-container-low rounded-lg text-center">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">18 Days</span>
<p className="font-label-caps text-label-caps uppercase text-on-surface-variant">Avg Exclusive Sale</p>
</div>
</div>
<div className="flex items-center gap-space-sm">
<Link className="flex-1 py-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"  to="/catalog">
<span className="material-symbols-outlined text-[16px] text-secondary">call</span> Direct Call
            </Link>
<Link className="flex-1 py-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 transition-colors"  target="_blank" to="/catalog">
<span className="material-symbols-outlined text-[16px] text-secondary">chat</span> WhatsApp
            </Link>
</div>
{/* Instant Question Hook */}
<form className="flex flex-col gap-space-xs pt-space-xs" onsubmit="handleQuickQuestion(event)">
<textarea className="w-full bg-surface-container-low text-on-surface p-space-sm rounded-lg font-body-sm text-body-sm outline-none resize-none focus:ring-1 focus:ring-secondary" placeholder="Send private inquiry to Julian..." rows="2"></textarea>
<button className="w-full py-space-sm bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg transition-colors flex items-center justify-center gap-1" type="submit">
<span className="material-symbols-outlined text-[16px]">send</span> Send Confidential Message
            </button>
</form>
</div>
</aside>
</div>
</section>
{/* Similar Nearby Luxury Estates Section */}
<section className="w-full bg-surface-container-low py-space-xl">
<div className="max-w-7xl mx-auto px-margin flex flex-col gap-space-lg">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
<div>
<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Comparable Portfolios</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Similar Flagship Residences</h2>
</div>
<Link className="font-label-md text-label-md text-secondary hover:text-on-tertiary-container flex items-center gap-1 transition-colors"  to="/catalog">
<span>Explore All 14 Pacific Heights Listings</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</Link>
</div>
{/* Estate Showcase Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
{/* Card 1 */}
<article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
<div className="relative w-full h-64 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" data-alt="Classical San Francisco limestone manor in Presidio Heights with wrought iron entry gates, private hedged garden courtyard, elegant architectural slate mansard roofline, soft golden hour sunshine reflecting off large multi-pane windows." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbbQxd1pHt9oFEHEIA_oCdHQ_7StEAq-qHOfj00itJJp3z1aWTcK_4nivs04hmgXOTGCngPm8FvFkw7mhScLGuqWF38w27lLnA_tVsZCAf6o3VYzYMQVcNS_kqPJxOGRsaeATQgTaL98cDzIlksPdrpkzDj5LwK7lHJdmHyF4T8Ut7DiGTC3eeErINNFzFSrpj6VhgN5kH-gtEfLGXwWXs9EBt7Oc0YEJylAuwhts"/>
<div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-space-sm py-0.5 rounded font-label-caps text-label-caps uppercase text-on-surface">Presidio Heights</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-secondary transition-colors">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
</div>
<div className="p-space-md flex flex-col gap-space-xs flex-1 justify-between">
<div>
<p className="font-headline-sm text-headline-sm text-on-surface font-semibold">$14,500,000</p>
<h3 className="font-title-md text-title-md text-on-surface group-hover:text-secondary transition-colors mt-0.5">The Presidio Limestone Manor</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">3420 Washington Street, San Francisco</p>
</div>
<div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm pt-space-sm">
<span>6 Beds</span>
<span className="text-outline-variant">•</span>
<span>7.5 Baths</span>
<span className="text-outline-variant">•</span>
<span>7,400 Sq Ft</span>
</div>
</div>
</article>
{/* Card 2 */}
<article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
<div className="relative w-full h-64 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" data-alt="Futuristic glass-encased penthouse in Russian Hill San Francisco with 360-degree wrap-around terrace overlooking Coit Tower, Bay Bridge, and downtown financial skyscrapers glowing at blue twilight hour." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWEFkgbVb_JaZc_HsfVGSSR4htdlHtTeXNIORlOqScBOWgAe76xy7G3XAOg5JLuryCemRPyCl6_SGIO2WULgD28QoKjt-0iXfDgpzXyd8ZUs8cXI2IhtQGX2HTww1bBwPNA4dkhyLSYs2Do2oonSGlEZuafmymuCQnbw90KHHgA_e-zI0f7Q-MQPev00POJD8YzzQpcsc99WaBOKnHMFRKriekbhkCp-k9buRfZfs"/>
<div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-space-sm py-0.5 rounded font-label-caps text-label-caps uppercase text-on-surface">Russian Hill</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-secondary transition-colors">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
</div>
<div className="p-space-md flex flex-col gap-space-xs flex-1 justify-between">
<div>
<p className="font-headline-sm text-headline-sm text-on-surface font-semibold">$11,200,000</p>
<h3 className="font-title-md text-title-md text-on-surface group-hover:text-secondary transition-colors mt-0.5">The Summit Crown Penthouse</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">999 Green Street #PH2, San Francisco</p>
</div>
<div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm pt-space-sm">
<span>4 Beds</span>
<span className="text-outline-variant">•</span>
<span>4.5 Baths</span>
<span className="text-outline-variant">•</span>
<span>5,100 Sq Ft</span>
</div>
</div>
</article>
{/* Card 3 */}
<article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
<div className="relative w-full h-64 overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" data-alt="Immaculate Sea Cliff California modern coastal villa perched on rugged ocean cliffs, massive cantilevered concrete and glass terraces overlooking crashing Pacific waves and Golden Gate Bridge tower, minimalist coastal flora landscaping." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtQ88bKmCapYPntHPXJ90G7OZ6fcTF5z_Zj2iAK6CfcJ35C4LQ0mGlUE2g0niZXjO6xL38pow9LWkBgE1czGmORyHg0W4xDtPSO3NjlzFmpspn-1k_5Nq_8m7BpxlfiGPR4-NMh4awr5vDunOMpalNVFlmNFp1kNYuMlgHtTFZnQD_jjmYTwQqcXp0QbVxVE5lCoJvVX5_JJ_Jo3sSTQM7pthTWL0QuQSSYQjG1nU"/>
<div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-space-sm py-0.5 rounded font-label-caps text-label-caps uppercase text-on-surface">Sea Cliff Oceanfront</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-secondary transition-colors">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
</div>
<div className="p-space-md flex flex-col gap-space-xs flex-1 justify-between">
<div>
<p className="font-headline-sm text-headline-sm text-on-surface font-semibold">$16,750,000</p>
<h3 className="font-title-md text-title-md text-on-surface group-hover:text-secondary transition-colors mt-0.5">The Cliffside Cantilever Villa</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">224 Sea Cliff Avenue, San Francisco</p>
</div>
<div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm pt-space-sm">
<span>5 Beds</span>
<span className="text-outline-variant">•</span>
<span>6 Baths</span>
<span className="text-outline-variant">•</span>
<span>6,420 Sq Ft</span>
</div>
</div>
</article>
</div>
</div>
</section>
{/* Interactive Scripts */}

</div>
      </main>

      <HavenFooter />
    </div>
  );
}
