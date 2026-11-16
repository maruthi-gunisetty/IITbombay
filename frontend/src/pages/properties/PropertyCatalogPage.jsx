import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import HavenNavbar from '../../components/haven/HavenNavbar';
import HavenFooter from '../../components/haven/HavenFooter';

export default function PropertyCatalogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'all');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all');
  const [viewMode, setViewMode] = useState('grid');
  const [savedProperties, setSavedProperties] = useState([1, 2, 3, 4]);

  const toggleSave = (id) => {
    if (savedProperties.includes(id)) {
      setSavedProperties(savedProperties.filter(p => p !== id));
    } else {
      setSavedProperties([...savedProperties, id]);
    }
  };

  return (
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#904d00] selection:text-white">
      <HavenNavbar savedCount={savedProperties.length} />

      <main className="flex-1 w-full">
<div className="flex flex-col w-full">
{/* Sticky Context & Filter Control Suite */}
<section className="sticky top-20 z-40 bg-surface/95 backdrop-blur-md shadow-sm">
<div className="max-w-7xl mx-auto px-margin py-space-sm flex flex-col gap-space-sm">
{/* Top Primary Filtering Strip */}
<div className="flex flex-wrap items-center justify-between gap-space-sm">
<div className="flex flex-1 flex-wrap items-center gap-space-sm min-w-0">
{/* Keyword Search */}
<div className="relative flex items-center min-w-[260px] flex-1 max-w-sm bg-surface-container-lowest rounded-lg shadow-sm">
<span className="material-symbols-outlined text-outline pl-space-sm text-[20px]">search</span>
<input className="w-full bg-transparent px-space-sm py-space-xs font-body-md text-body-md text-on-surface outline-none placeholder:text-outline" placeholder="City, neighborhood, or address..." type="text" value="San Francisco &amp; Marin County"/>
<button className="pr-space-sm text-outline hover:text-on-surface">
<span className="material-symbols-outlined text-[18px]">cancel</span>
</button>
</div>
{/* Price Range Filter Pill */}
<div className="relative group">
<button className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container transition-all" type="button">
<span className="text-on-surface-variant font-normal">Price:</span>
<span className="font-semibold">$4.5M – $25M+</span>
<span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
</button>
</div>
{/* Bedroom Selector Pills */}
<div className="flex items-center bg-surface-container-low p-0.5 rounded-lg shadow-sm">
<button className="px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md rounded">Any</button>
<button className="px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md rounded">2+</button>
<button className="px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md rounded">3+</button>
<button className="px-space-sm py-space-xs bg-primary text-on-primary font-label-md text-label-md rounded shadow-sm">4+</button>
<button className="px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface font-label-md text-label-md rounded">5+</button>
</div>
{/* Property Type Dropdown */}
<div className="relative">
<button className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container transition-all" type="button">
<span>Single Family &amp; Penthouses</span>
<span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
</button>
</div>
{/* More Filters Trigger */}
<button className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container transition-all" type="button">
<span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
<span>Filters</span>
<span className="px-1.5 py-0.2 bg-secondary text-on-secondary rounded text-[10px] font-bold">3</span>
</button>
</div>
{/* Action Tools & Layout Controls */}
<div className="flex items-center gap-space-sm">
<button className="flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-lowest text-on-surface rounded-lg font-label-md text-label-md shadow-sm hover:bg-surface-container transition-colors" type="button">
<span className="material-symbols-outlined text-[18px] text-secondary">notifications_active</span>
<span className="hidden sm:inline">Save Search</span>
</button>
{/* View Mode Selector */}
<div className="flex items-center bg-surface-container-lowest rounded-lg p-0.5 shadow-sm">
<button className="p-space-xs rounded bg-surface-container text-on-surface" title="Split Map View">
<span className="material-symbols-outlined text-[18px]">vertical_split</span>
</button>
<button className="p-space-xs rounded text-outline hover:text-on-surface transition-colors" title="Grid Only">
<span className="material-symbols-outlined text-[18px]">grid_view</span>
</button>
<button className="p-space-xs rounded text-outline hover:text-on-surface transition-colors" title="List View">
<span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
</button>
</div>
</div>
</div>
{/* Applied Filter Tags Row */}
<div className="flex items-center gap-space-xs overflow-x-auto pb-1 text-on-surface-variant">
<span className="font-label-caps text-label-caps uppercase text-outline">Active:</span>
<span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-2 py-0.5 rounded text-[11px] font-medium">
          SF &amp; Marin Bay
          <span className="material-symbols-outlined text-[12px] cursor-pointer hover:text-error">close</span>
</span>
<span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-2 py-0.5 rounded text-[11px] font-medium">
          Ocean / Bay View
          <span className="material-symbols-outlined text-[12px] cursor-pointer hover:text-error">close</span>
</span>
<span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-2 py-0.5 rounded text-[11px] font-medium">
          Private Pool
          <span className="material-symbols-outlined text-[12px] cursor-pointer hover:text-error">close</span>
</span>
<span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface px-2 py-0.5 rounded text-[11px] font-medium">
          Wine Cellar
          <span className="material-symbols-outlined text-[12px] cursor-pointer hover:text-error">close</span>
</span>
<button className="text-secondary hover:underline font-label-caps text-label-caps uppercase ml-space-xs">Reset All</button>
</div>
</div>
</section>
{/* Metric Breadcrumb & Results Header Bar */}
<section className="max-w-7xl mx-auto w-full px-margin pt-space-md pb-space-xs flex flex-wrap items-center justify-between gap-space-md">
<div className="flex items-baseline gap-space-sm">
<h1 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Residences in San Francisco &amp; Marin</h1>
<span className="font-body-sm text-body-sm text-on-surface-variant font-medium">(48 available)</span>
</div>
{/* Sorting & Speed Toggles */}
<div className="flex items-center gap-space-md">
<div className="flex items-center gap-space-xs">
<span className="font-label-md text-label-md text-on-surface-variant">Sort:</span>
<select className="bg-surface-container-lowest text-on-surface font-label-md text-label-md py-1 px-space-sm rounded-lg shadow-sm outline-none cursor-pointer">
<option>Price: High to Low</option>
<option>Curated / Exclusive First</option>
<option>Newest Additions</option>
<option>Price: Low to High</option>
</select>
</div>
</div>
</section>
{/* Main Content: Split Catalog & Interactive Vector Map View */}
<section className="max-w-7xl mx-auto w-full px-margin py-space-sm mb-space-xl">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
{/* Left Column (60% Desktop): Curated Property Cards Grid */}
<div className="lg:col-span-7 flex flex-col gap-space-lg">
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
{/* Card 1: Masterpiece Estate */}
<article className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
<div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Ultra-luxury modern limestone mansion in Pacific Heights San Francisco, massive bronze framed panoramic windows framing the Golden Gate Bridge, evening twilight lighting, warm amber architectural illumination, minimalist luxury interior glimpse, pristine slate driveway" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQlESAfsGJxFGVQ9hT2ml4Sg8FOWdrsQd3b4dlbd6YH8tG89-kVwUGZzSmkfnxllzRnOyaXZVr6De9fBqhbAiQqFMT1MIfHTs3OeHHRaO_d3QB4F68O_gf49VMzXtPLRHdj9yrzWO6ZT4MT_9-haDEFCFnU7DWdPmds75AedZaupinB9ROORjhLpLJQtuPj244KpBd6QAR3LXGEEKQcpVq_Gb9WO-GwH6J2SMovkA"/>
{/* Status & Badges */}
<div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
<span className="bg-secondary text-on-secondary px-2 py-0.5 rounded font-label-caps text-label-caps uppercase tracking-wider shadow-sm">Haven Exclusive</span>
<span className="bg-surface-container-lowest/90 backdrop-blur-md text-on-surface px-2 py-0.5 rounded font-label-caps text-label-caps uppercase tracking-wider">3D Tour</span>
</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary hover:bg-surface-container-lowest transition-all shadow-sm">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
{/* Open House Ribbon */}
<div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur-sm px-2.5 py-1 rounded text-on-surface font-label-caps text-label-caps flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-secondary text-[14px]">event_available</span>
<span>Open Sun 1:00 PM – 4:00 PM</span>
</div>
{/* Dots Gallery Pagination */}
<div className="absolute bottom-3 right-3 flex items-center gap-1 bg-surface/60 backdrop-blur-sm px-2 py-1 rounded-full">
<div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></div>
<div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest/40"></div>
<div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest/40"></div>
<span className="font-body-sm text-[10px] text-surface-container-lowest pl-1 leading-none">1/14</span>
</div>
</div>
{/* Card Meta */}
<div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
<div>
<div className="flex items-baseline justify-between">
<div className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">$18,450,000</div>
<span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Active Listing</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mt-1 group-hover:text-secondary transition-colors">2840 Pacific Avenue</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Pacific Heights, San Francisco, CA 94115</p>
</div>
{/* Specification Metrics Grid */}
<div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low px-space-sm py-2 rounded-lg">
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">5</strong> Beds</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">6.5</strong> Baths</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">7,820</strong> Sq Ft</span>
</div>
</div>
</article>
{/* Card 2: Belvedere Bayfront Villa */}
<article className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
<div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Architectural modern waterfront luxury villa on the cliffs of Belvedere Island Marin County, cantilevered teak wood terrace, infinity edge lap pool reflecting blue ocean bay and San Francisco skyline horizon, crisp sunny coastal light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBN3Vqw4Wv1PoK1Duoyco2O6oEkze68sqlH5PP_SxfaNg5EFmCJjj3bgdAgWRMD_-qZAGmVXyF6bVW5X-IFF6mD6QVPD_ykuj1g0-xMvayFzXaa6aWqVlgb9nEN8VS3TqDzvej5cQn0mRk7wNJ5YX1Nuon7vePsrzoygNxwYDxEzdTXceuojWAUio3ksAil6808GiHod1R-GzhIldYIpq4yLjWp5XE-ewi4D_0D11E"/>
<div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
<span className="bg-surface-container-lowest/90 backdrop-blur-md text-on-surface px-2 py-0.5 rounded font-label-caps text-label-caps uppercase tracking-wider">Waterfront</span>
</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary hover:bg-surface-container-lowest transition-all shadow-sm">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
<div className="absolute bottom-3 right-3 flex items-center gap-1 bg-surface/60 backdrop-blur-sm px-2 py-1 rounded-full">
<div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></div>
<div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest/40"></div>
<span className="font-body-sm text-[10px] text-surface-container-lowest pl-1 leading-none">1/22</span>
</div>
</div>
<div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
<div>
<div className="flex items-baseline justify-between">
<div className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">$14,200,000</div>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-medium">Price Adjusted</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mt-1 group-hover:text-secondary transition-colors">84 Golden Gate Avenue</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Belvedere Island, Marin County, CA 94920</p>
</div>
<div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low px-space-sm py-2 rounded-lg">
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">4</strong> Beds</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">5</strong> Baths</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">6,140</strong> Sq Ft</span>
</div>
</div>
</article>
{/* Card 3: Presidio Heights Classical Revival */}
<article className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
<div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Stately red brick and carved French limestone mansion in Presidio Heights San Francisco, tall wrought iron gates, lush private courtyard with manicured boxwood parterres, dramatic bespoke arched doorway, dignified editorial luxury" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiftPs23sHDP_AB_cr69zxZy-xu6AUvxbmrXJCMGtWyVbOT0dEtw2utjERoWkezh6pLkuy_sdQYpIzgF2iSgQXrz4lqLHjuAa-CChnELxHVrWpVpUH8XjJ20ug7WPAto4FXoNJ6yn4YRnc6F2xT07QkUIfIeSzqIOEdXPStyT3u0Sc9WL37Lf_bE5GzOHYVbaVWUwP8wjUzL8GE5ax_Z1TBbW9burZLjbYp5NQkpM"/>
<div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
<span className="bg-secondary text-on-secondary px-2 py-0.5 rounded font-label-caps text-label-caps uppercase tracking-wider shadow-sm">Haven Exclusive</span>
<span className="bg-surface-container-lowest/90 backdrop-blur-md text-on-surface px-2 py-0.5 rounded font-label-caps text-label-caps uppercase tracking-wider">Historic</span>
</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary hover:bg-surface-container-lowest transition-all shadow-sm">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
<div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur-sm px-2.5 py-1 rounded text-on-surface font-label-caps text-label-caps flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-secondary text-[14px]">event_available</span>
<span>Private Showing by Appt</span>
</div>
</div>
<div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
<div>
<div className="flex items-baseline justify-between">
<div className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">$12,900,000</div>
<span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">New Today</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mt-1 group-hover:text-secondary transition-colors">3410 Washington Street</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Presidio Heights, San Francisco, CA 94118</p>
</div>
<div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low px-space-sm py-2 rounded-lg">
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">6</strong> Beds</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">7</strong> Baths</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">8,450</strong> Sq Ft</span>
</div>
</div>
</article>
{/* Card 4: Telegraph Hill Glass Pavilion Penthouse */}
<article className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
<div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Penthouse interior with floor to ceiling curved structural glass walls looking out over the San Francisco Bay and Coit Tower, polished concrete and white oak floors, sculptural minimalist bronze fireplace, warm amber morning sunrise" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTOm6WuVFvmaAN0EfgmkKIIckxWv2EG6vW04kRPXegeNJn3JFI9gPhHERQPfwYt5nfhGXWe-_Mg7y7Er8X0KHJwF41PETFHdvcC_JCOc1GQ11qfftFOOryeYJpena3eRdsO4ADlPwsnp5P7xcaXq9VIFyFoKxFSve0qQeILY5xpkKWL-_kpWBa9TA2fnR0qkopNkllLEpVswK9M8SThYAIRMAWRbBixL6TRFz4aHQ"/>
<div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
<span className="bg-surface-container-lowest/90 backdrop-blur-md text-on-surface px-2 py-0.5 rounded font-label-caps text-label-caps uppercase tracking-wider">Penthouse</span>
</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary hover:bg-surface-container-lowest transition-all shadow-sm">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
<div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur-sm px-2.5 py-1 rounded text-on-surface font-label-caps text-label-caps flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-secondary text-[14px]">event_available</span>
<span>Open Sat 2:00 PM – 4:30 PM</span>
</div>
</div>
<div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
<div>
<div className="flex items-baseline justify-between">
<div className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">$8,750,000</div>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-medium">Active Listing</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mt-1 group-hover:text-secondary transition-colors">115 Montgomery Street, PH-B</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Telegraph Hill, San Francisco, CA 94133</p>
</div>
<div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low px-space-sm py-2 rounded-lg">
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">3</strong> Beds</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">3.5</strong> Baths</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">4,280</strong> Sq Ft</span>
</div>
</div>
</article>
{/* Card 5: Ross Valley Contemporary Sanctuary */}
<article className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
<div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Modern organic estate set in private redwood groves of Ross Valley Marin County, board-formed concrete and cedar siding, outdoor fire lounge, infinity plunge pool mirroring mature towering trees, serene dappled sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB87kWJh4Mvk71srSRPk1KIG0FUluagQoFBJcUdIM0tvGXbYTpK5vUsLUNO5svIfQ3oFZlEaagLh0ymqIC7qF6lYDF9hLuQIqG0KrQuWsQQd9ZyNFlwHLnchRZrAlRk8J2djKnoImj3UFZ_t3u51vRiLzbDE4x7hN9TmKuw__11XzmuMmE7OceU6nUDTdoCRrMvltsiS5dIuqEsA3BIdOVwrDGrvjgq3BgW8GY2ivc"/>
<div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
<span className="bg-secondary text-on-secondary px-2 py-0.5 rounded font-label-caps text-label-caps uppercase tracking-wider shadow-sm">Haven Exclusive</span>
</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary hover:bg-surface-container-lowest transition-all shadow-sm">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
</div>
<div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
<div>
<div className="flex items-baseline justify-between">
<div className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">$9,800,000</div>
<span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Price Confirmed</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mt-1 group-hover:text-secondary transition-colors">12 Shady Lane</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Ross, Marin County, CA 94957</p>
</div>
<div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low px-space-sm py-2 rounded-lg">
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">5</strong> Beds</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">5.5</strong> Baths</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">5,890</strong> Sq Ft</span>
</div>
</div>
</article>
{/* Card 6: Sea Cliff Oceanfront Modernist Landmark */}
<article className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
<div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Dramatic white stucco oceanfront villa overlooking Pacific surf cliffs in Sea Cliff San Francisco, tiered stone balconies, private gated courtyard, sweeping views of Marin Headlands and deep cobalt ocean, bright coastal architecture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTuqJriRJzaqewrYj4cQV-LYE0AhTy7h2GQo_uWjPifrrHnMeziSz9TTOzxH_RP-1CIBMuCXJgxwPyVvVM2DwAyBa5n4WK4T_wS_q6jSUbeePYochFSRTlI7DKDHaJo5kkt0kusfTmAvDJX7WlvN-VC__mvYDZH6ER5uraEHpTrFnANHdN0deQPpO2FEU1BsnbtnDSe9vqBGyPDoHEE8p8UMGp1qgL5YCNCxl77bw"/>
<div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
<span className="bg-surface-container-lowest/90 backdrop-blur-md text-on-surface px-2 py-0.5 rounded font-label-caps text-label-caps uppercase tracking-wider">Ocean Front</span>
</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary hover:bg-surface-container-lowest transition-all shadow-sm">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
</div>
<div className="p-space-md flex flex-col flex-1 justify-between gap-space-sm">
<div>
<div className="flex items-baseline justify-between">
<div className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">$16,500,000</div>
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-medium">Off-Market Portal</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mt-1 group-hover:text-secondary transition-colors">450 El Camino Del Mar</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Sea Cliff, San Francisco, CA 94121</p>
</div>
<div className="pt-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low px-space-sm py-2 rounded-lg">
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">4</strong> Beds</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">5</strong> Baths</span>
<span className="text-outline-variant">•</span>
<span className="flex items-center gap-1 font-medium"><strong className="text-on-surface">6,700</strong> Sq Ft</span>
</div>
</div>
</article>
</div>
{/* Pagination & Load More Module */}
<div className="flex flex-col items-center justify-center pt-space-md pb-space-lg gap-space-sm bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
<div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
<span>Showing <strong className="text-on-surface">6</strong> of <strong className="text-on-surface">48</strong> residences</span>
<div className="w-32 h-1.5 bg-surface-container-high rounded-full overflow-hidden ml-space-xs">
<div className="w-[12.5%] h-full bg-secondary"></div>
</div>
</div>
<button className="px-space-xl py-space-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-all shadow-sm flex items-center gap-space-xs" type="button">
<span>Load 24 More Properties</span>
<span className="material-symbols-outlined text-[18px]">expand_more</span>
</button>
</div>
</div>
{/* Right Column (40% Desktop): Fixed Architectural Interactive Map Panel */}
<div className="lg:col-span-5 sticky top-48 h-[calc(100vh-14rem)] min-h-[620px] rounded-xl overflow-hidden shadow-md flex flex-col bg-surface-container-lowest">
{/* Interactive Vector Map Surface Container */}
<div className="relative w-full h-full bg-surface-container-low overflow-hidden">
{/* Stylized Architectural Base Map with Waterway and Districts */}
<svg className="w-full h-full object-cover select-none pointer-events-none" fill="none" viewbox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
{/* SF Bay / Pacific Waterways */}
<path d="M0 0H600V800H0V0Z" fill="#EBF2FA"></path>
<path d="M70 0C130 90 220 180 340 230C430 268 530 230 600 240V800H280C220 780 180 710 130 630C90 560 20 520 0 510V0H70Z" fill="#F4F8FD"></path>
{/* Coastline hairline styling */}
<path d="M70 0C130 90 220 180 340 230C430 268 530 230 600 240" stroke="#CBDCF5" strokeLinecap="round" strokeWidth="2.5"></path>
<path d="M600 310C510 320 460 380 430 460C400 540 430 640 410 730C390 800 370 800 350 800" stroke="#CBDCF5" strokeWidth="2"></path>
{/* Marin Headlands Landmass (Top Left) */}
<path d="M0 0C80 20 140 70 160 140C120 190 60 210 0 220V0Z" fill="#E8EEF5"></path>
{/* San Francisco Peninsula Core (Bottom Center/Left) */}
<path d="M120 420C210 400 360 410 420 490C460 550 430 680 440 800H90C40 730 60 620 80 540C90 490 100 450 120 420Z" fill="#F4F7FC"></path>
<path d="M120 420C210 400 360 410 420 490C460 550 430 680 440 800" stroke="#DFE7F2" strokeWidth="2"></path>
{/* Major Architectural Arterials & Bridges */}
{/* Golden Gate Bridge Span */}
<path d="M160 140L185 410" opacity="0.65" stroke="#E28743" stroke-dasharray="4 3" strokeWidth="2.5"></path>
{/* Bay Bridge Span */}
<path d="M420 490C470 470 530 460 600 440" stroke="#94A3B8" stroke-dasharray="3 3" strokeWidth="2"></path>
{/* City Grid Texture lines (Light Architectural Cadence) */}
<path d="M160 460H380M150 490H400M150 520H410M160 550H390M170 580H370M180 610H350" opacity="0.75" stroke="#FFFFFF" strokeWidth="2.5"></path>
<path d="M210 440V630M250 440V630M290 440V630M330 440V630M370 470V610" opacity="0.75" stroke="#FFFFFF" strokeWidth="2.5"></path>
{/* Sub-neighborhood demarcations */}
<text fill="#94A3B8" font-family="Manrope" font-size="10" font-weight="700" letter-spacing="0.1em" x="210" y="475">PACIFIC HEIGHTS</text>
<text fill="#94A3B8" font-family="Manrope" font-size="10" font-weight="700" letter-spacing="0.1em" x="140" y="520">PRESIDIO</text>
<text fill="#94A3B8" font-family="Manrope" font-size="10" font-weight="700" letter-spacing="0.1em" x="310" y="530">RUSSIAN HILL</text>
<text fill="#94A3B8" font-family="Manrope" font-size="10" font-weight="700" letter-spacing="0.1em" x="330" y="110">BELVEDERE / TIBURON</text>
</svg>
{/* Interactive Real Estate Pricing Map Pins */}
{/* Pin 1: Pacific Heights ($18.4M) - ACTIVE SELECTED */}
<div className="absolute top-[48%] left-[42%] -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer">
<div className="flex items-center gap-1 bg-primary text-on-primary px-3 py-1.5 rounded-lg shadow-lg hover:scale-110 transition-transform">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span className="font-label-md text-label-md font-bold tracking-tight">$18.4M</span>
</div>
<div className="w-2 h-2 bg-primary rotate-45 mx-auto -mt-1 shadow-sm"></div>
{/* Hover Preview Popup Card */}
<div className="hidden group-hover:flex absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-surface-container-lowest rounded-xl p-2 shadow-2xl flex-col gap-2 z-30 pointer-events-auto">
<div className="h-28 w-full rounded-lg overflow-hidden relative">
<img className="w-full h-full object-cover" data-alt="Close up architectural detail of limestone luxury facade with bronze framed entrance and lush ivy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWpbbVOeDQLNo0Ylizt-lVjdKJy0FKszp4DdEs-ZiAHU_0PuAMsmZncwsG_H9BpMIJZmg_CPHvHULS3fJRYV2m9qzXypwA43GijnLT3OyAzRg1IcvbkrRZJmi6-UidhxdCHZg-BdjmMkWVS-zG30Dkd7wh8-IBaGS3382W2rtR2Co-vtl08T-B1RiK3LQhhVj1tNADNBylbNBO-3WOX16Q-rVQeH-0q5t641H0RrE"/>
<span className="absolute top-1.5 left-1.5 bg-secondary text-on-secondary px-1.5 py-0.2 rounded text-[9px] font-bold">Haven Exclusive</span>
</div>
<div className="px-1 pb-1">
<div className="font-title-lg text-title-lg text-on-surface font-semibold leading-tight">$18,450,000</div>
<div className="font-body-sm text-[12px] text-on-surface-variant truncate">2840 Pacific Avenue, Pacific Heights</div>
<div className="font-body-sm text-[11px] text-outline mt-0.5">5 Beds · 6.5 Baths · 7,820 Sq Ft</div>
</div>
</div>
</div>
{/* Pin 2: Belvedere Island ($14.2M) */}
<div className="absolute top-[18%] left-[62%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group">
<div className="flex items-center gap-1 bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-lg shadow-md hover:bg-primary hover:text-on-primary transition-all">
<span className="font-label-md text-label-md font-semibold tracking-tight">$14.2M</span>
</div>
<div className="w-1.5 h-1.5 bg-surface-container-lowest rotate-45 mx-auto -mt-0.5 shadow-sm group-hover:bg-primary"></div>
</div>
{/* Pin 3: Presidio Heights ($12.9M) */}
<div className="absolute top-[52%] left-[28%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group">
<div className="flex items-center gap-1 bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-lg shadow-md hover:bg-primary hover:text-on-primary transition-all">
<span className="font-label-md text-label-md font-semibold tracking-tight">$12.9M</span>
</div>
<div className="w-1.5 h-1.5 bg-surface-container-lowest rotate-45 mx-auto -mt-0.5 shadow-sm group-hover:bg-primary"></div>
</div>
{/* Pin 4: Telegraph Hill Penthouse ($8.7M) */}
<div className="absolute top-[44%] left-[68%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group">
<div className="flex items-center gap-1 bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-lg shadow-md hover:bg-primary hover:text-on-primary transition-all">
<span className="font-label-md text-label-md font-semibold tracking-tight">$8.75M</span>
</div>
<div className="w-1.5 h-1.5 bg-surface-container-lowest rotate-45 mx-auto -mt-0.5 shadow-sm group-hover:bg-primary"></div>
</div>
{/* Pin 5: Sea Cliff ($16.5M) */}
<div className="absolute top-[49%] left-[16%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group">
<div className="flex items-center gap-1 bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-lg shadow-md hover:bg-primary hover:text-on-primary transition-all">
<span className="font-label-md text-label-md font-semibold tracking-tight">$16.5M</span>
</div>
<div className="w-1.5 h-1.5 bg-surface-container-lowest rotate-45 mx-auto -mt-0.5 shadow-sm group-hover:bg-primary"></div>
</div>
{/* Pin 6: Ross Valley Marin ($9.8M) */}
<div className="absolute top-[12%] left-[28%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group">
<div className="flex items-center gap-1 bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-lg shadow-md hover:bg-primary hover:text-on-primary transition-all">
<span className="font-label-md text-label-md font-semibold tracking-tight">$9.8M</span>
</div>
<div className="w-1.5 h-1.5 bg-surface-container-lowest rotate-45 mx-auto -mt-0.5 shadow-sm group-hover:bg-primary"></div>
</div>
{/* Pin 7: Marina / Cow Hollow ($6.5M) */}
<div className="absolute top-[42%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group">
<div className="flex items-center gap-1 bg-surface-container-lowest text-on-surface px-2.5 py-1 rounded-lg shadow-md hover:bg-primary hover:text-on-primary transition-all">
<span className="font-label-md text-label-md font-semibold tracking-tight">$6.5M</span>
</div>
<div className="w-1.5 h-1.5 bg-surface-container-lowest rotate-45 mx-auto -mt-0.5 shadow-sm group-hover:bg-primary"></div>
</div>
{/* Floating Map View Controls */}
<div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20">
<div className="bg-surface-container-lowest rounded-lg shadow-md overflow-hidden flex flex-col">
<button className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors" title="Zoom In">
<span className="material-symbols-outlined text-[18px]">add</span>
</button>
<button className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors" title="Zoom Out">
<span className="material-symbols-outlined text-[18px]">remove</span>
</button>
</div>
<button className="w-8 h-8 rounded-lg bg-surface-container-lowest shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors" title="Locate SF Area">
<span className="material-symbols-outlined text-[18px]">my_location</span>
</button>
<button className="w-8 h-8 rounded-lg bg-surface-container-lowest shadow-md flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors" title="Layers &amp; Satellite">
<span className="material-symbols-outlined text-[18px]">layers</span>
</button>
</div>
{/* Map Boundary Draw & Area Pill */}
<div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
<button className="px-space-sm py-1.5 bg-surface-container-lowest/90 backdrop-blur-md text-on-surface rounded-lg font-label-caps text-label-caps uppercase tracking-wider shadow-md hover:bg-surface-container-lowest flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-secondary">gesture</span>
<span>Draw Boundary</span>
</button>
<div className="px-space-sm py-1.5 bg-surface-container-lowest/90 backdrop-blur-md text-on-surface-variant rounded-lg font-label-caps text-label-caps uppercase tracking-wider shadow-md hidden sm:block">
              Marin Headlands · Bay Arc
            </div>
</div>
</div>
</div>
</div>
</section>
{/* Advisory Contact Strip */}
<section className="max-w-7xl mx-auto w-full px-margin pb-space-xl">
<div className="bg-surface-container-high rounded-xl p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-sm">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
<span className="material-symbols-outlined text-[24px]">key</span>
</div>
<div>
<h2 className="font-title-lg text-title-lg text-on-surface font-semibold">Seeking Off-Market or Private Placements?</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Over 35% of Haven &amp; Key’s premier estate transactions occur discreetly without public index listings.</p>
</div>
</div>
<div className="flex items-center gap-space-sm shrink-0">
<button className="px-space-lg py-space-sm bg-surface-container-lowest text-on-surface font-label-md text-label-md rounded-lg shadow-sm hover:bg-surface-container transition-colors" type="button">
          Browse Private Registry
        </button>
<button className="px-space-lg py-space-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors" type="button">
          Contact Managing Partner
        </button>
</div>
</div>
</section>
</div>
      </main>

      <HavenFooter />
    </div>
  );
}
