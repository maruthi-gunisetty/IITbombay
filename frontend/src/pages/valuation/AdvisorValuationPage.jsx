import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HavenNavbar from '../../components/haven/HavenNavbar';
import HavenFooter from '../../components/haven/HavenFooter';
import { valuationAPI } from '../../services/api';

export default function AdvisorValuationPage() {
  const navigate = useNavigate();
  const [portfolioTab, setPortfolioTab] = useState('all');
  const [valuationData, setValuationData] = useState({
    address: '2840 Pacific Avenue, Pacific Heights',
    propertyType: 'Penthouse',
    builtUpArea: 8200,
    bedrooms: 6,
    bathrooms: 8,
    condition: 'Excellent',
    constructionQuality: 'Luxury'
  });
  const [valuationResult, setValuationResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [consultationBooked, setConsultationBooked] = useState(false);

  const handleCalculateValuation = async (e) => {
    if (e) e.preventDefault();
    setCalculating(true);
    try {
      const res = await valuationAPI.calculate({
        built_up_area: Number(valuationData.builtUpArea) || 8200,
        land_area: 12000,
        bedrooms: Number(valuationData.bedrooms) || 6,
        bathrooms: Number(valuationData.bathrooms) || 8,
        city: 'San Francisco',
        locality: 'Pacific Heights',
        property_type: valuationData.propertyType || 'Penthouse',
        property_age: 4,
        construction_quality: valuationData.constructionQuality || 'Luxury',
        condition: valuationData.condition || 'Excellent',
        amenities: ['Elevator', 'Wine Cellar', 'Terrace', 'Concierge']
      });
      setValuationResult(res.data);
    } catch (err) {
      console.error('Valuation error:', err);
      // Fallback calculation for demo
      setValuationResult({
        estimated_value: 28500000,
        price_per_sqft: 3475,
        lower_bound: 27200000,
        upper_bound: 29800000,
        confidence_score: 94.8,
        market_sentiment: 'Bullish Institutional Flow'
      });
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#904d00] selection:text-white">
      <HavenNavbar />

      <main className="flex-1 w-full">
<div className="flex flex-col w-full">
{/* Top Subtle Context Breadcrumb Bar */}
<div className="w-full bg-surface-container-low py-space-sm px-margin">
<div className="max-w-7xl mx-auto flex items-center justify-between text-on-surface-variant">
<div className="flex items-center gap-space-xs font-label-md text-label-md tracking-wider uppercase">
<Link className="hover:text-primary transition-colors"  to="/catalog">Advisory Network</Link>
<span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
<Link className="hover:text-primary transition-colors"  to="/catalog">Pacific Heights &amp; Napa Valley</Link>
<span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
<span className="text-on-surface font-semibold">Eleanor Vance, Partner</span>
</div>
<div className="flex items-center gap-space-sm font-label-caps text-label-caps uppercase text-secondary">
<span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span>Accepting Private Advisory Q3/Q4</span>
</div>
</div>
</div>
{/* Agent Editorial Profile Hero (Asymmetrical Split Spun with Architectural Discipline) */}
<section className="w-full max-w-7xl mx-auto px-margin pt-space-xl pb-space-lg">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
{/* Left Column: Portrait & Direct Contact Matrix */}
<div className="lg:col-span-5 flex flex-col gap-space-md">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-xl bg-surface-container">
<img className="w-full h-full object-cover grayscale contrast-105" data-alt="Editorial black-and-white portrait of an elegant woman real estate advisor Eleanor Vance in tailored charcoal blazer standing in an architectural modernist interior with soft natural side lighting and travertine stone background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7HiEBZmryUCK7vSBTG9I48jCOF7UyPmA8YrWu2TJO_TDW1aycO1uogSJ6yHhjp9SlE1CnBBEi56O8FIyZXUVT-GKvY1hJwFzLJDXwyDVjdtecTDFY30v_6tBPzXKhXmueiNV1QtdhmZWIaGx5FgiBHtrNNd3GEJslKL7b8C10_5cmhKlNrJ47pNgdoE-rXv0-br01iHsagDK7dwLNFKAf_vJLOWgbhCxPeTsvswk"/>
{/* Floating Status Badge */}
<div className="absolute top-space-md left-space-md bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-sm flex items-center gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>workspace_premium</span>
<span className="font-label-caps text-label-caps text-on-surface tracking-wider uppercase font-bold">Top 0.5% Nationally · WSJ Real Trends</span>
</div>
{/* Discrete Volume Watermark */}
<div className="absolute bottom-space-md right-space-md bg-surface-container-highest/80 backdrop-blur-md px-space-md py-space-xs rounded-lg text-right">
<p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Career Volume</p>
<p className="font-headline-sm text-headline-sm text-on-surface font-semibold">$620,000,000+</p>
</div>
</div>
{/* Contact & Direct Channels Card */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Primary Office</span>
<span className="font-title-md text-title-md text-on-surface">555 California St &amp; St. Helena Salon</span>
</div>
<span className="font-label-caps text-label-caps bg-surface-container text-on-surface-variant px-space-sm py-space-xs rounded">CA DRE #01847291</span>
</div>
<div className="grid grid-cols-2 gap-space-sm pt-space-xs">
<Link className="flex items-center gap-space-xs p-space-sm bg-surface-container-low rounded-lg hover:bg-surface-container transition-all group"  to="/catalog">
<span className="material-symbols-outlined text-secondary text-[18px]">call</span>
<div className="flex flex-col min-w-0">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Direct Wire</span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface truncate group-hover:text-secondary">+1 (415) 555-0198</span>
</div>
</Link>
<Link className="flex items-center gap-space-xs p-space-sm bg-surface-container-low rounded-lg hover:bg-surface-container transition-all group"  to="/catalog">
<span className="material-symbols-outlined text-secondary text-[18px]">mail</span>
<div className="flex flex-col min-w-0">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Concierge Desk</span>
<span className="font-body-sm text-body-sm font-semibold text-on-surface truncate group-hover:text-secondary">vance.desk@...</span>
</div>
</Link>
</div>
<div className="flex items-center justify-between pt-space-xs text-on-surface-variant">
<div className="flex items-center gap-space-xs font-label-md text-label-md">
<span className="material-symbols-outlined text-[16px] text-secondary">translate</span>
<span>English, French, Mandarin (Private Translator Team)</span>
</div>
<div className="flex items-center gap-space-sm">
<button aria-label="LinkedIn Profile" className="p-space-xs rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-[18px]">public</span>
</button>
<button aria-label="Instagram Profile" className="p-space-xs rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-[18px]">photo_camera</span>
</button>
<button aria-label="Share Dossier" className="p-space-xs rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-[18px]">share</span>
</button>
</div>
</div>
</div>
</div>
{/* Right Column: Biography, Accreditations & Key Performance Statistics */}
<div className="lg:col-span-7 flex flex-col justify-between h-full space-y-space-lg">
<div>
{/* Title & Badges */}
<div className="flex flex-wrap items-center gap-space-xs mb-space-sm">
<span className="px-space-sm py-space-xs rounded bg-surface-container-highest text-on-primary-fixed font-label-caps text-label-caps tracking-widest uppercase">Senior Managing Director</span>
<span className="px-space-sm py-space-xs rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps text-label-caps tracking-widest uppercase">Luxury Estates Division</span>
<span className="px-space-sm py-space-xs rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps tracking-widest uppercase">18 Years Tenured</span>
</div>
<h1 className="font-display-hero text-display-hero text-on-surface tracking-tight leading-none mb-space-sm">
            Eleanor Vance
          </h1>
<p className="font-headline-sm text-headline-sm text-secondary font-headline-md italic mb-space-md">
            Architectural Provenance &amp; Discretionary Portfolio Representation
          </p>
{/* Editorial Bio */}
<div className="space-y-space-md text-on-surface-variant font-body-lg text-body-lg leading-relaxed">
<p>
              Recognized as one of the preeminent authorities on trophy properties spanning San Francisco's Gold Coast and the rolling vineyard estates of Napa Valley, Eleanor Vance represents high-net-worth principals, family offices, and architectural collectors globally.
            </p>
<p>
              Her proprietary negotiation methodology and bespoke off-market distribution infrastructure have facilitated over $620 million in career closings—consistently setting square-foot benchmarks across Pacific Heights, Presidio Heights, and Meadowood enclaves.
            </p>
</div>
</div>
{/* 4 Key Accomplishment Stat Cards */}
<div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md pt-space-md">
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col">
<div className="flex items-center justify-between text-secondary mb-space-xs">
<span className="material-symbols-outlined text-[20px]">speed</span>
<span className="font-label-caps text-label-caps bg-surface-container px-1.5 py-0.5 rounded text-on-surface">Q1-Q2</span>
</div>
<span className="font-display-hero-mobile text-display-hero-mobile font-headline-md text-on-surface">11</span>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">Avg. Days on Market</span>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col">
<div className="flex items-center justify-between text-secondary mb-space-xs">
<span className="material-symbols-outlined text-[20px]">verified</span>
<span className="font-label-caps text-label-caps bg-surface-container px-1.5 py-0.5 rounded text-on-surface">Audited</span>
</div>
<span className="font-display-hero-mobile text-display-hero-mobile font-headline-md text-on-surface">99.4%</span>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">Client Retention</span>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col">
<div className="flex items-center justify-between text-secondary mb-space-xs">
<span className="material-symbols-outlined text-[20px]">real_estate_agent</span>
<span className="font-label-caps text-label-caps bg-surface-container px-1.5 py-0.5 rounded text-on-surface">Career</span>
</div>
<span className="font-display-hero-mobile text-display-hero-mobile font-headline-md text-on-surface">240+</span>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">Closed Deals</span>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col">
<div className="flex items-center justify-between text-secondary mb-space-xs">
<span className="material-symbols-outlined text-[20px]">trophy</span>
<span className="font-label-caps text-label-caps bg-secondary-fixed px-1.5 py-0.5 rounded text-on-secondary-fixed">Record</span>
</div>
<span className="font-display-hero-mobile text-display-hero-mobile font-headline-md text-on-surface">$42.5M</span>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mt-1">Belvedere Record</span>
</div>
</div>
{/* Quick Call to Action Bar */}
<div className="flex flex-wrap items-center gap-space-md pt-space-sm">
<Link className="px-space-lg py-space-sm bg-primary text-on-primary font-label-lg text-label-lg rounded-lg hover:bg-primary-container transition-all shadow-md flex items-center gap-space-xs"  to="/catalog">
<span>Request Valuation &amp; Market Strategy</span>
<span className="material-symbols-outlined text-[18px]">arrow_downward</span>
</Link>
<Link className="px-space-lg py-space-sm bg-surface-container-lowest text-on-surface font-label-lg text-label-lg rounded-lg hover:bg-surface-container transition-all shadow-sm flex items-center gap-space-xs"  to="/catalog">
<span className="material-symbols-outlined text-[18px] text-secondary">calendar_today</span>
<span>Book Private Consultation</span>
</Link>
</div>
</div>
</div>
</section>
{/* Interactive Portfolio & Track Record Section */}
<section className="w-full bg-surface-container-low py-space-xl">
<div className="max-w-7xl mx-auto px-margin">
{/* Section Header with Tab Toggles */}
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
<div>
<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Transaction Record</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Curated Portfolio &amp; Record Sales</h2>
</div>
{/* Tab Controls */}
<div className="flex items-center gap-space-xs p-1 bg-surface-container rounded-xl self-start md:self-auto" id="portfolio-tabs">
<button className="portfolio-tab-btn active px-space-md py-space-xs font-label-md text-label-md rounded-lg bg-surface-container-lowest text-on-surface shadow-sm transition-all flex items-center gap-space-xs" data-tab="exclusives">
<span>Current Exclusives</span>
<span className="px-1.5 py-0.2 bg-surface-container text-on-surface-variant rounded-full text-[10px]">6</span>
</button>
<button className="portfolio-tab-btn px-space-md py-space-xs font-label-md text-label-md rounded-lg text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-space-xs" data-tab="sold">
<span>Notable Sold</span>
<span className="px-1.5 py-0.2 bg-surface-container text-on-surface-variant rounded-full text-[10px]">34</span>
</button>
<button className="portfolio-tab-btn px-space-md py-space-xs font-label-md text-label-md rounded-lg text-on-surface-variant hover:text-on-surface transition-all flex items-center gap-space-xs" data-tab="reviews">
<span>Client Reviews</span>
<span className="px-1.5 py-0.2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-[10px]">48</span>
</button>
</div>
</div>
{/* Tab Content 1: Current & Notable Sold Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg" id="tab-content-properties">
{/* Property 1: Pacific Heights Beaux-Arts */}
<div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
<div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Stately limestone Beaux-Arts mansion in San Francisco Pacific Heights with wrought-iron balconies and grand architectural entrance against a twilight sky with warm interior illumination" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSw6vuQMCQvysMb7rb8N3Un0bw6rXluec5QD0CNLHql0NdcUox1VIaQ8wppI5DgL88kzv1QG5oVLc-8eyMR4RWpiMigqamREEtGlsAfgXKr0VHe5JkbitohuHR-JBXh_M3kIislJGTaL7j6yZLNAmSv7DV3ixgyKj7azKhL4Rh28_ngNtNgfLjk6AdF5iPYdHhdNC_KylGVuFmHJg76jiZzCDOo2RkKXb6OikG8zY"/>
<div className="absolute top-space-md left-space-md bg-secondary text-on-secondary px-space-sm py-space-xs rounded font-label-caps text-label-caps uppercase tracking-wider shadow">
              Exclusive Listing
            </div>
<button className="absolute top-space-md right-space-md w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
<div className="absolute bottom-space-xs left-space-xs bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-0.5 rounded font-label-caps text-label-caps text-on-surface">
              Broadway Corridor, SF
            </div>
</div>
<div className="p-space-lg flex flex-col justify-between flex-1">
<div>
<div className="flex items-baseline justify-between mb-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">$24,800,000</span>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Active</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-space-xs">The Bellevue Beaux-Arts Residence</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
                Historic 1912 mansion completely renovated with 180° Golden Gate Bridge views, private wellness center, and French formal garden.
              </p>
</div>
<div className="flex items-center justify-between pt-space-sm bg-surface-container-low px-space-md py-space-xs rounded-lg text-on-surface font-body-sm text-body-sm">
<span className="flex items-center gap-1"><span className="font-semibold">6</span> Beds</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1"><span className="font-semibold">8.5</span> Baths</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1"><span className="font-semibold">9,420</span> Sq Ft</span>
</div>
</div>
</div>
{/* Property 2: St. Helena Modernist Vineyard */}
<div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
<div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Modernist glass pavilion luxury estate in St Helena Napa Valley surrounded by Cabernet Sauvignon vineyards and olive trees with an infinity reflection pool during golden hour" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8hMK_vZt8Ccleotv1BIpM9OG2xNKmVM3w3DYTW39mT_3AYqDYcneSA6pm4WGOALWmq3UrCyKAL8LTfYbqxu_PzOszs7MYq6FvB75rQHF034j4dMP3X4eDOBWIjd3uyT39e7-FUkqvotKl-DIORxkjFmbTMCjNza6YsyYeNS-Xub2Nm0iYQ5xtMqhUNZ8us9DtwBHnceILIiaLZ5S0bzp-xmamL5ReoZK718j55WA"/>
<div className="absolute top-space-md left-space-md bg-surface-container-highest text-on-primary-fixed px-space-sm py-space-xs rounded font-label-caps text-label-caps uppercase tracking-wider shadow">
              Off-Market Placement
            </div>
<div className="absolute bottom-space-xs left-space-xs bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-0.5 rounded font-label-caps text-label-caps text-on-surface">
              St. Helena, Napa Valley
            </div>
</div>
<div className="p-space-lg flex flex-col justify-between flex-1">
<div>
<div className="flex items-baseline justify-between mb-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">$31,500,000</span>
<span className="font-label-caps text-label-caps text-secondary font-bold uppercase">Sold (Record)</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-space-xs">Meadowood Crest Vineyard Estate</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
                14-acre organic vineyard with Howard Backen architectural estate, 2,000-bottle cave, and guest pavilion.
              </p>
</div>
<div className="flex items-center justify-between pt-space-sm bg-surface-container-low px-space-md py-space-xs rounded-lg text-on-surface font-body-sm text-body-sm">
<span className="flex items-center gap-1"><span className="font-semibold">5</span> Beds</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1"><span className="font-semibold">7</span> Baths</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1"><span className="font-semibold">11,200</span> Sq Ft</span>
</div>
</div>
</div>
{/* Property 3: Belvedere Island Waterfront */}
<div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
<div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Cantilevered modern waterfront estate on Belvedere Island Marin County overlooking San Francisco skyline and bay waters with private deep water dock and teak deck" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjzPNhJTeZvcPura40voCVybG6StzWl6DaDkcLrIpsiyBiXxQqme7_fIuA8PyZwz2K1ZrGqXuJbhEYKGQY01Iq22QtKUjREgyCYMrL-PankiKnm6MVKuUcrLS1qUAWysHYwZti79n1jp_nQ3VjVbbusIQeZ5QIEc83Oum6tSjrx5mBbwwP5J9rsZMQ6PcPqwU1WNJIkgEUYgrXmFI6fNrJ09SuGVzCVmtaoz-aOZA"/>
<div className="absolute top-space-md left-space-md bg-surface-container-highest text-on-primary-fixed px-space-sm py-space-xs rounded font-label-caps text-label-caps uppercase tracking-wider shadow">
              Private Placement
            </div>
<div className="absolute bottom-space-xs left-space-xs bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-0.5 rounded font-label-caps text-label-caps text-on-surface">
              Belvedere, Marin County
            </div>
</div>
<div className="p-space-lg flex flex-col justify-between flex-1">
<div>
<div className="flex items-baseline justify-between mb-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface font-semibold">$19,750,000</span>
<span className="font-label-caps text-label-caps text-secondary font-bold uppercase">Sold in 9 Days</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-space-xs">San Rafael Bay Cantilever Villa</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
                Unobstructed panorama of Angel Island and San Francisco skyline with deep-water private dock and resort infinity pool.
              </p>
</div>
<div className="flex items-center justify-between pt-space-sm bg-surface-container-low px-space-md py-space-xs rounded-lg text-on-surface font-body-sm text-body-sm">
<span className="flex items-center gap-1"><span className="font-semibold">4</span> Beds</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1"><span className="font-semibold">5.5</span> Baths</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1"><span className="font-semibold">7,100</span> Sq Ft</span>
</div>
</div>
</div>
</div>
{/* Footer for Tabbed Section */}
<div className="mt-space-lg flex items-center justify-between bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[24px]">lock</span>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Off-Market Private Inventory Access</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Over 40% of Eleanor Vance's annual sales close quietly without MLS publication.</span>
</div>
</div>
<button className="px-space-md py-space-xs bg-surface-container text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-highest transition-colors flex items-center gap-space-xs">
<span>Request NDA Registration</span>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
</div>
</section>
{/* Interactive Property Valuation & Seller Advisory Section */}
<section className="w-full max-w-7xl mx-auto px-margin py-space-xl" id="valuation-engine">
<div className="bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden">
<div className="grid grid-cols-1 lg:grid-cols-12">
{/* Left Side: Editorial Context & Advisor Guarantee */}
<div className="lg:col-span-5 bg-surface-container p-space-xl flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Seller Advisory Suite</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs mb-space-md leading-tight">
              What Is Your Property Worth in Today's Real Market?
            </h2>
<p className="font-body-md text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
              Automated algorithmic algorithms routinely miscalculate high-end architectural finishes, micro-climate views, and zoning expansion potential by up to 28%.
            </p>
<div className="space-y-space-md">
<div className="flex items-start gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[20px] mt-0.5" style={{"fontVariationSettings": "FILL 1"}}>analytics</span>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Comparative Architectural Analysis</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Calibrated against recent off-market transactions and private sales files.</span>
</div>
</div>
<div className="flex items-start gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[20px] mt-0.5" style={{"fontVariationSettings": "FILL 1"}}>security</span>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Strict Privacy &amp; Non-Disclosure</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Your address and valuation parameters remain strictly confidential.</span>
</div>
</div>
<div className="flex items-start gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[20px] mt-0.5" style={{"fontVariationSettings": "FILL 1"}}>trending_up</span>
<div className="flex flex-col">
<span className="font-title-md text-title-md text-on-surface">Optimal Liquidity Windows</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Timing recommendations tailored to seasonal buyer migration.</span>
</div>
</div>
</div>
</div>
<div className="pt-space-lg mt-space-lg bg-surface-container-lowest p-space-md rounded-xl flex items-center gap-space-sm">
<img className="w-12 h-12 rounded-full object-cover" data-alt="Close up crop of advisor Eleanor Vance signature with corporate Haven and Key embossed wax seal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9_wPIwvIrQqUbbtr88joXft87vy2B4r_Br3JxIPCmsfoqtii3YYcZukVrF42NzDHd0WIsr5txTEUaVbqaW9A9Hr1WJbHC1bbFlhYEACNV9oOxAw8XZM9Mo2LqmRDVCRDsi6uM3ihQSxv9AvaVBvMZzJLmmKaZAqG-bNHTgIZ07rFp8B6RK4HPUJUa9j4HHvZMljE5JqVCb0f7GiXCff2er1s0dD2z8_XhOYK2H5U"/>
<div className="flex flex-col">
<span className="font-body-sm text-body-sm font-semibold text-on-surface">Eleanor Vance's Personal Guarantee</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Every appraisal is personally reviewed before publication.</span>
</div>
</div>
</div>
{/* Right Side: 2-Step Interactive Form */}
<div className="lg:col-span-7 p-space-xl flex flex-col justify-between">
<div>
{/* Step Indicators */}
<div className="flex items-center justify-between pb-space-md mb-space-lg bg-surface-container-low px-space-md py-space-sm rounded-lg">
<div className="flex items-center gap-space-xs">
<span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-caps text-label-caps flex items-center justify-center font-bold" id="step-badge-1">1</span>
<span className="font-label-lg text-label-lg font-semibold text-on-surface">Property Baseline</span>
</div>
<span className="material-symbols-outlined text-outline text-[18px]">arrow_forward</span>
<div className="flex items-center gap-space-xs opacity-50" id="step-badge-2-container">
<span className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps flex items-center justify-center font-bold" id="step-badge-2">2</span>
<span className="font-label-lg text-label-lg font-semibold text-on-surface">Bespoke Finishes &amp; Report</span>
</div>
</div>
{/* Form Multi-step Container */}
<form className="space-y-space-md" id="valuation-form" onsubmit="event.preventDefault();">
{/* STEP 1 CONTAINER */}
<div className="space-y-space-md" id="form-step-1">
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Property Location / Street Address *</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-space-md text-outline">location_on</span>
<input className="w-full pl-12 pr-space-md py-3 bg-surface rounded-lg font-body-md text-body-md text-on-surface outline-none shadow-sm placeholder:text-outline focus:ring-2 focus:ring-secondary/40" id="input-address" placeholder="e.g. 2840 Broadway, San Francisco or St. Helena Parcel" required="" type="text"/>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Estimated Living Area (Sq Ft) *</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-space-md text-outline">square_foot</span>
<input className="w-full pl-12 pr-space-md py-3 bg-surface rounded-lg font-body-md text-body-md text-on-surface outline-none shadow-sm placeholder:text-outline focus:ring-2 focus:ring-secondary/40" id="input-sqft" placeholder="e.g. 6,400" required="" type="number"/>
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Property Type</label>
<select className="w-full px-space-md py-3 bg-surface rounded-lg font-body-md text-body-md text-on-surface outline-none shadow-sm focus:ring-2 focus:ring-secondary/40">
<option>Single Family Architectural Estate</option>
<option>Penthouse / Full-Floor Flat</option>
<option>Vineyard / Agricultural Compound</option>
<option>Waterfront Residence</option>
</select>
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Current Condition</label>
<div className="grid grid-cols-3 gap-space-sm">
<button className="cond-btn active p-space-sm rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md text-center transition-all" type="button">
                      Pristine / Turnkey
                    </button>
<button className="cond-btn p-space-sm rounded-lg bg-surface text-on-surface-variant hover:bg-surface-container font-label-md text-label-md text-center transition-all" type="button">
                      Good / Minor Updates
                    </button>
<button className="cond-btn p-space-sm rounded-lg bg-surface text-on-surface-variant hover:bg-surface-container font-label-md text-label-md text-center transition-all" type="button">
                      Architectural Re-imagining
                    </button>
</div>
</div>
<div className="pt-space-sm flex justify-end">
<button className="px-space-xl py-space-sm bg-primary text-on-primary font-label-lg text-label-lg rounded-lg hover:bg-primary-container transition-all flex items-center gap-space-xs" id="btn-next-step" type="button">
<span>Proceed to Luxury Attributes</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
{/* STEP 2 CONTAINER (Hidden initially) */}
<div className="space-y-space-md hidden" id="form-step-2">
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Prime Valuation Multipliers (Select all that apply)</label>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
<label className="flex items-center gap-space-xs p-space-sm bg-surface rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
<input defaultChecked className="accent-secondary w-4 h-4 rounded" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface">Panoramic Bay/Ocean View</span>
</label>
<label className="flex items-center gap-space-xs p-space-sm bg-surface rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
<input className="accent-secondary w-4 h-4 rounded" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface">Pool / Wellness Spa</span>
</label>
<label className="flex items-center gap-space-xs p-space-sm bg-surface rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
<input defaultChecked className="accent-secondary w-4 h-4 rounded" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface">Wine Cellar (500+ Btls)</span>
</label>
<label className="flex items-center gap-space-xs p-space-sm bg-surface rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
<input className="accent-secondary w-4 h-4 rounded" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface">Guest House / Permitted ADU</span>
</label>
<label className="flex items-center gap-space-xs p-space-sm bg-surface rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
<input className="accent-secondary w-4 h-4 rounded" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface">Multi-Car Subterranean Garage</span>
</label>
<label className="flex items-center gap-space-xs p-space-sm bg-surface rounded-lg cursor-pointer hover:bg-surface-container transition-colors">
<input className="accent-secondary w-4 h-4 rounded" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface">Significant Historic Provenance</span>
</label>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Your Name *</label>
<input className="w-full px-space-md py-3 bg-surface rounded-lg font-body-md text-body-md text-on-surface outline-none shadow-sm focus:ring-2 focus:ring-secondary/40" placeholder="Principal or Representative Name" type="text"/>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Confidential Delivery (Email or Mobile) *</label>
<input className="w-full px-space-md py-3 bg-surface rounded-lg font-body-md text-body-md text-on-surface outline-none shadow-sm focus:ring-2 focus:ring-secondary/40" placeholder="e.g. principal@familyoffice.com" type="text"/>
</div>
</div>
<div className="p-space-sm bg-secondary-fixed/30 rounded-lg flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-secondary text-[20px]">door_front</span>
<span className="font-body-sm text-body-sm text-on-secondary-fixed-variant font-medium">Also request Eleanor's discrete 45-minute on-site valuation walkthrough</span>
</div>
<input defaultChecked className="accent-secondary w-5 h-5 rounded cursor-pointer" type="checkbox"/>
</div>
<div className="pt-space-sm flex items-center justify-between">
<button className="px-space-md py-space-sm text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex items-center gap-space-xs transition-colors" id="btn-prev-step" type="button">
<span className="material-symbols-outlined text-[16px]">arrow_back</span>
<span>Back to baseline</span>
</button>
<button className="px-space-xl py-space-sm bg-secondary text-on-secondary font-label-lg text-label-lg rounded-lg hover:bg-secondary-container transition-all shadow-md flex items-center gap-space-xs" id="btn-submit-valuation" type="button">
<span className="material-symbols-outlined text-[18px]">verified</span>
<span>Generate Confidential Valuation Report</span>
</button>
</div>
</div>
{/* SUCCESS MESSAGE (Hidden Initially) */}
<div className="hidden p-space-xl text-center flex-col items-center justify-center space-y-space-sm bg-surface-container rounded-xl" id="valuation-success">
<span className="material-symbols-outlined text-secondary text-[48px]">check_circle</span>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Valuation Dossier Initiated</h4>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
                  Eleanor Vance and our senior luxury analytics team have received your parameters. A personalized 12-page comparative dossier will be transmitted within 4 business hours.
                </p>
<div className="pt-space-sm">
<span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">Priority Code: #HK-VAL-8491</span>
</div>
</div>
</form>
</div>
{/* Bottom Micro Disclaimers */}
<div className="pt-space-md text-on-surface-variant font-body-sm text-[11px] leading-tight">
            * All valuation submissions are protected under institutional NDA standard terms. No automated robocalls or unsolicited public broker solicitations.
          </div>
</div>
</div>
</div>
</section>
{/* Verified Client Testimonials & Institutional Endorsements */}
<section className="w-full bg-surface-container-low py-space-xl">
<div className="max-w-7xl mx-auto px-margin">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
<div>
<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Client Testimonials</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Uncompromising Client Advocacy</h2>
</div>
<div className="flex items-center gap-space-xs text-secondary font-label-lg text-label-lg">
<span className="material-symbols-outlined text-[20px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="font-bold text-on-surface">5.0</span>
<span className="text-on-surface-variant">(48 Verified HNW Transactions)</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
{/* Review 1 */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between space-y-space-md">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="flex items-center gap-1 text-secondary">
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
</div>
<span className="font-label-caps text-label-caps bg-surface-container text-on-surface-variant px-space-xs py-0.5 rounded">Verified Seller</span>
</div>
<p className="font-headline-sm text-[18px] text-on-surface font-headline-md italic leading-snug mb-space-sm">
              "Eleanor orchestrated our Pacific Heights sale completely off-market with absolute privacy and secured 14% over our private reserve."
            </p>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              "Her command of architectural history and deep relations with sovereign wealth family offices completely redefined how we view luxury brokerage."
            </p>
</div>
<div className="pt-space-md bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
<div>
<p className="font-title-md text-body-md font-semibold text-on-surface">David &amp; Camille Sterling</p>
<p className="font-body-sm text-[11px] text-on-surface-variant">Pacific Heights Estate ($28.2M Sold)</p>
</div>
<span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
</div>
</div>
{/* Review 2 */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between space-y-space-md">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="flex items-center gap-1 text-secondary">
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
</div>
<span className="font-label-caps text-label-caps bg-surface-container text-on-surface-variant px-space-xs py-0.5 rounded">Verified Buyer &amp; Seller</span>
</div>
<p className="font-headline-sm text-[18px] text-on-surface font-headline-md italic leading-snug mb-space-sm">
              "Her in-depth knowledge of Napa Valley agricultural zoning and water rights saved us months of due diligence."
            </p>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              "Eleanor is not merely a broker—she is an irreplaceable asset manager and strategic advisor for real estate capital."
            </p>
</div>
<div className="pt-space-md bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
<div>
<p className="font-title-md text-body-md font-semibold text-on-surface">Julian Thorne, Esq.</p>
<p className="font-body-sm text-[11px] text-on-surface-variant">Rutherford Vineyard Estate ($34M Acquisition)</p>
</div>
<span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
</div>
</div>
{/* Review 3 */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between space-y-space-md">
<div>
<div className="flex items-center justify-between mb-space-sm">
<div className="flex items-center gap-1 text-secondary">
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings": "FILL 1"}}>star</span>
</div>
<span className="font-label-caps text-label-caps bg-surface-container text-on-surface-variant px-space-xs py-0.5 rounded">Verified Seller</span>
</div>
<p className="font-headline-sm text-[18px] text-on-surface font-headline-md italic leading-snug mb-space-sm">
              "Executed the disposition of our Sea Cliff coastal contemporary during a turbulent interest rate cycle in exactly 12 days."
            </p>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              "Flawless white-glove staging, cinematic architectural photography, and international press coverage in the FT and Mansion Global."
            </p>
</div>
<div className="pt-space-md bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
<div>
<p className="font-title-md text-body-md font-semibold text-on-surface">Dr. Helene Chen-Kaufman</p>
<p className="font-body-sm text-[11px] text-on-surface-variant">Sea Cliff Oceanfront Compound ($18.5M Sold)</p>
</div>
<span className="material-symbols-outlined text-secondary text-[20px]">verified_user</span>
</div>
</div>
</div>
</div>
</section>
{/* Direct Consultation Booking & Calendar Integration Form */}
<section className="w-full max-w-7xl mx-auto px-margin py-space-xl" id="consultation-booking">
<div className="bg-surface-container-lowest rounded-2xl shadow-xl p-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
{/* Left Column: Context */}
<div className="lg:col-span-5 flex flex-col justify-between space-y-space-md">
<div>
<span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">Direct Salon Advisory</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">Schedule a Private Advisory Session</h2>
<p className="font-body-md text-body-md text-on-surface-variant">
              Whether preparing a signature property for sale, structuring a tax-deferred 1031 exchange, or seeking unlisted coastal estates, reserve dedicated time with Eleanor Vance.
            </p>
</div>
<div className="space-y-space-sm bg-surface-container-low p-space-md rounded-xl">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
<span className="font-body-sm text-body-sm text-on-surface">In-person at San Francisco 555 California or Napa Valley Salon</span>
</div>
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
<span className="font-body-sm text-body-sm text-on-surface">Secure encrypted video conference for international clients</span>
</div>
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
<span className="font-body-sm text-body-sm text-on-surface">Confidential estate walkthrough &amp; valuation audit</span>
</div>
</div>
<div className="flex items-center gap-space-md pt-space-xs">
<div className="flex -space-x-2">
<img className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-surface-container-lowest" data-alt="Portrait avatar of financial family office advisor partner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU_uBra9v-c7iDMWSQNd-rrYBwq7sUc1JUxJVY_hDRe3cD-ZQSoRCyObHCMf3qexRSMr_sqeWXh0xmbEHg0f7Aa1NNKULLlF1ihPW3UlO1S5df263dU5dncNjec-qldfp1YPZZG76og7oB3nH2uso1qSuun0eArMpvCvAmqduRArhQo-QQB8MBtocc-MVeUB8sgA_42yLg7mAI1PSYrZdyf7X69BISjPSVC2uVwUA"/>
<img className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-surface-container-lowest" data-alt="Portrait avatar of luxury architectural preservationist partner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrY_tTT9HzWnRQ6MPRlhbwgTfbiBnHQrGjb2rraE1dNN5NgG3RwKCXtS_eliv2GaisiBOh81WB6dNM1EJpoey08uvN0BgpljqxW7RdJTrcTDnUUSrD4XRPx45Ve2LEvmG50glCxLdkgRvTHrXhV4MlPpMNtEbAtOc0va3T-5HOClRuzEsavg6fCj5mrS_ny5jhc-Urk84bu8TSakFnF2ANUDp6lej60ZJw1ssYtnA"/>
<img className="w-9 h-9 rounded-full object-cover shadow-sm ring-2 ring-surface-container-lowest" data-alt="Portrait avatar of international capital private broker partner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzNccw4jZHrE2X4h-_H1YsKlhW19Y8St4FXXyyDGJj-c-IgtEpNfQFABmeXON01poSnHnp3171LFhKIXMeyi8mPVjkNq4QUQ5T9k0bdnFEG6Bz_E5NKCGQILpfz5KfF93pEi61kZwt77NSDzxCW_y4w25BH-WtG9ApUtQefJv34xTX_qgGUtam5cwhw17tf3qTIZRHfKqU2xXvPMlE7DWs0T25TNNxcbyethPRYXQ"/>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Supported by Eleanor's dedicated 6-person estate team.</span>
</div>
</div>
{/* Right Column: Interactive Consultation Booking Interface */}
<div className="lg:col-span-7 bg-surface-container-low p-space-lg rounded-xl shadow-sm">
<form className="space-y-space-md" onsubmit="event.preventDefault(); alert('Your consultation request has been lodged directly with Eleanor Vance\'s personal executive assistant. Confirmation will follow shortly.');">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Consultation Format</label>
<select className="w-full px-space-md py-3 bg-surface rounded-lg font-body-md text-body-md text-on-surface outline-none shadow-sm focus:ring-2 focus:ring-secondary/40">
<option>In-Person: SF Financial District Salon</option>
<option>In-Person: St. Helena / Napa Salon</option>
<option>On-Site Property Walkthrough</option>
<option>Private Encrypted Video Conference</option>
</select>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Primary Advisory Objective</label>
<select className="w-full px-space-md py-3 bg-surface rounded-lg font-body-md text-body-md text-on-surface outline-none shadow-sm focus:ring-2 focus:ring-secondary/40">
<option>Selling a Signature Residence ($5M+)</option>
<option>Discrete Off-Market Purchase Inquiry</option>
<option>Portfolio Re-balancing &amp; 1031 Exchange</option>
<option>Vineyard / Agricultural Land Acquisition</option>
</select>
</div>
</div>
{/* Date & Time Slot Selector */}
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Select Preferred Advisory Date &amp; Window</label>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
<button className="time-slot-btn active p-space-sm rounded-lg bg-primary text-on-primary text-center font-label-md text-label-md transition-all" type="button">
<span className="block font-bold">Tomorrow</span>
<span className="text-[11px] opacity-80">10:00 AM PST</span>
</button>
<button className="time-slot-btn p-space-sm rounded-lg bg-surface text-on-surface hover:bg-surface-container-highest text-center font-label-md text-label-md transition-all" type="button">
<span className="block font-bold">Thursday</span>
<span className="text-[11px] text-on-surface-variant">2:30 PM PST</span>
</button>
<button className="time-slot-btn p-space-sm rounded-lg bg-surface text-on-surface hover:bg-surface-container-highest text-center font-label-md text-label-md transition-all" type="button">
<span className="block font-bold">Friday</span>
<span className="text-[11px] text-on-surface-variant">11:00 AM PST</span>
</button>
<button className="time-slot-btn p-space-sm rounded-lg bg-surface text-on-surface hover:bg-surface-container-highest text-center font-label-md text-label-md transition-all" type="button">
<span className="block font-bold">Next Mon</span>
<span className="text-[11px] text-on-surface-variant">Custom Time</span>
</button>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Client Full Name *</label>
<input className="w-full px-space-md py-3 bg-surface rounded-lg font-body-md text-body-md text-on-surface outline-none shadow-sm focus:ring-2 focus:ring-secondary/40" placeholder="e.g. Richard Hendricks" required="" type="text"/>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Direct Telephone / Mobile *</label>
<input className="w-full px-space-md py-3 bg-surface rounded-lg font-body-md text-body-md text-on-surface outline-none shadow-sm focus:ring-2 focus:ring-secondary/40" placeholder="+1 (415) 000-0000" required="" type="tel"/>
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface uppercase tracking-wider mb-space-xs">Confidential Notes / Address (Optional)</label>
<textarea className="w-full px-space-md py-2.5 bg-surface rounded-lg font-body-md text-body-md text-on-surface outline-none shadow-sm focus:ring-2 focus:ring-secondary/40" placeholder="Include any specific architectural provenance, timing requirements, or representation parameters..." rows="2"></textarea>
</div>
<div className="pt-space-xs flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-secondary">encrypted</span>
                End-to-End Encrypted Advisory Booking
              </span>
<button className="px-space-xl py-space-sm bg-primary text-on-primary font-label-lg text-label-lg rounded-lg hover:bg-primary-container transition-all shadow-md" type="submit">
                Confirm Consultation Request
              </button>
</div>
</form>
</div>
</div>
</div>
</section>
{/* Interactive JavaScript behaviors */}

</div>
      </main>

      <HavenFooter />
    </div>
  );
}
