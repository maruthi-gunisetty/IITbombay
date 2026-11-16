import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HavenNavbar from '../../components/haven/HavenNavbar';
import HavenFooter from '../../components/haven/HavenFooter';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('curated');
  const [locationInput, setLocationInput] = useState('Mumbai & Top Metros');
  const [propertyType, setPropertyType] = useState('modern');
  const [priceScale, setPriceScale] = useState('5-10');
  const [bedrooms, setBedrooms] = useState('3');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryEmail, setInquiryEmail] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locationInput) params.set('location', locationInput);
    if (propertyType && propertyType !== 'all') params.set('type', propertyType);
    if (priceScale) params.set('price', priceScale);
    if (bedrooms && bedrooms !== 'any') params.set('beds', bedrooms);
    if (activeTab === 'offmarket') params.set('category', 'offmarket');
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <div className="bg-[#080E1B] text-[#F5F7FC] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#3978F6] selection:text-white">
      <HavenNavbar />

      <main className="flex-1 w-full">
<div className="flex flex-col w-full">
{/* Immersive Editorial Hero */}
<section className="relative w-full -mt-20 pt-28 pb-20 md:pb-28 bg-[#0D1628] overflow-hidden">
<div className="absolute inset-0 w-full h-full bg-cover bg-center" data-alt="Ultra-luxury architectural minimalist villa overlooking the Pacific ocean coastline at golden twilight hour with floor to ceiling glass walls, warm ambient interior lighting, manicured cedar terraces, and sleek infinity pool reflecting slate blue dusk tones and warm amber hues, architectural photography 8k resolution" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCnhhYbMFDT8kVBABLGaAsWFEzKiwfkb5G48FnvTc_ZnnxmDQXec3EkqK9cmkAoNKa84ndWqNM_NIityqIT4IySs_SzM3Jvi8SqpKaW6eXdNy2iEzsIU4X2n_utjkLbunTPG_BAgePKCfiuB83tTqcvw6UnM4vpEAMg8-DAi3WM8nhLQXsQtYkXiZ3A_qUKgAzN_e58gEJXWtNuJ74bSfWhaP2KzFBLEMHT3At8uSQ\')'}}>
</div>
{/* Editorial Gradient Scrim */}
<div className="absolute inset-0 bg-gradient-to-t from-on-background via-on-background/60 to-on-background/30 mix-blend-multiply pointer-events-none"></div>
<div className="absolute inset-0 bg-gradient-to-r from-on-background/80 via-transparent to-transparent pointer-events-none"></div>
<div className="relative max-w-7xl mx-auto px-margin z-10 flex flex-col pt-12 md:pt-16">
{/* Monogram Tag & Issue Stamp */}
<div className="flex items-center gap-space-sm mb-space-md">
<span className="px-space-sm py-1 rounded bg-secondary/90 text-on-secondary font-label-caps text-label-caps uppercase tracking-widest shadow-sm">
          Volume XXVI · Autumn Portfolio
        </span>
<span className="text-surface-variant font-label-md text-label-md tracking-wider uppercase opacity-80">
          Private Client Advisory
        </span>
</div>
{/* Main Headline & Subtitle */}
<div className="max-w-3xl mb-space-xl">
<h1 className="font-display-hero text-display-hero text-surface-bright tracking-tight mb-space-md drop-shadow-sm font-light">
          Exceptional Estates for <span className="italic font-normal text-[#29C5E8]-fixed">Discerning Lives.</span>
</h1>
<p className="font-body-lg text-body-lg text-surface-variant max-w-xl leading-relaxed opacity-95">
          Discover premier architectural residences, off-market penthouses, and bespoke coastal sanctuaries curated for generational legacy.
        </p>
</div>
{/* Modern Multi-Tab Search Filter Container */}
<div className="w-full max-w-5xl bg-[#111D32]/95 backdrop-blur-md rounded-xl p-space-md md:p-space-lg shadow-xl shadow-[#3978F6]/10">
{/* Search Category Tabs */}
<div className="flex items-center gap-space-md mb-space-md overflow-x-auto pb-1" id="search-tabs">
<button onClick={handleSearch} className="w-full sm:w-auto px-10 py-3 bg-[#3978F6] text-white rounded-lg text-sm font-semibold hover:bg-[#2457C5] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer" type="button"><span className="material-symbols-outlined text-[18px]">search</span><span>Search 1,420 Exclusive Estates</span></button>
</div>
</div>
</div>
</section>
{/* Live Market Intelligence Ticker / Stats Bar */}
<section className="w-full bg-[#0D1628] py-space-md shadow-inner">
<div className="max-w-7xl mx-auto px-margin">
<div className="grid grid-cols-2 md:grid-cols-4 gap-space-lg items-center">
{/* Stat Item 1 */}
<div className="flex flex-col items-start">
<div className="flex items-center gap-1.5 text-[#29C5E8]">
<span className="font-headline-md text-headline-md font-bold tracking-tight text-[#F5F7FC]">₹48,500 Cr+</span>
<span className="material-symbols-outlined text-[20px]">trending_up</span>
</div>
<span className="font-label-caps text-label-caps uppercase tracking-wider text-[#98A7BD]">Closed Career Volume</span>
</div>
{/* Stat Item 2 */}
<div className="flex flex-col items-start">
<div className="flex items-center gap-1.5 text-[#29C5E8]">
<span className="font-headline-md text-headline-md font-bold tracking-tight text-[#F5F7FC]">14 Days</span>
<span className="material-symbols-outlined text-[20px]">timer</span>
</div>
<span className="font-label-caps text-label-caps uppercase tracking-wider text-[#98A7BD]">Avg. Days on Market</span>
</div>
{/* Stat Item 3 */}
<div className="flex flex-col items-start">
<div className="flex items-center gap-1.5 text-[#29C5E8]">
<span className="font-headline-md text-headline-md font-bold tracking-tight text-[#F5F7FC]">98.6%</span>
<span className="material-symbols-outlined text-[20px]">verified</span>
</div>
<span className="font-label-caps text-label-caps uppercase tracking-wider text-[#98A7BD]">List-to-Sale Ratio</span>
</div>
{/* Stat Item 4 */}
<div className="flex flex-col items-start">
<div className="flex items-center gap-1.5 text-[#29C5E8]">
<span className="font-headline-md text-headline-md font-bold tracking-tight text-[#F5F7FC]">180+</span>
<span className="material-symbols-outlined text-[20px]">visibility_off</span>
</div>
<span className="font-label-caps text-label-caps uppercase tracking-wider text-[#98A7BD]">Private Off-Market Briefs</span>
</div>
</div>
</div>
</section>
{/* Featured Curated Collections (Editorial 3-Card Spread) */}
<section className="w-full py-space-xl bg-[#080E1B]">
<div className="max-w-7xl mx-auto px-margin">
{/* Section Header */}
<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
<div className="max-w-xl">
<div className="flex items-center gap-space-xs text-[#29C5E8] font-label-caps text-label-caps uppercase tracking-widest mb-space-xs">
<span className="material-symbols-outlined text-[16px]">stars</span>
<span>Hand-Selected Masterworks</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-[#F5F7FC] font-light">
            Premier Curated Collections
          </h2>
<p className="font-body-md text-body-md text-[#98A7BD] mt-space-xs">
            Distinctive architectural residences vetted for historical significance, bespoke interior provenance, and prime geography.
          </p>
</div>
<div className="flex items-center gap-space-sm">
<button className="px-space-md py-2.5 rounded-lg bg-[#0D1628] text-[#F5F7FC] font-label-md text-label-md hover:bg-[#111D32] transition-colors flex items-center gap-1" type="button">
<span>Filter By Region</span>
<span className="material-symbols-outlined text-[16px]">tune</span>
</button>
<Link className="px-space-md py-2.5 rounded-lg bg-[#3978F6] text-white font-label-md text-label-md hover:bg-on-tertiary-container transition-colors flex items-center gap-1" data-path="exclusive-estates"  to="/catalog">
<span>View All Curations (42)</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</Link>
</div>
</div>
{/* 3-Column Architectural Cards */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
{/* Card 1: Bel Air Glass Pavilion */}
<article className="group bg-[#111D32] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
{/* Image Canvas with Overlay Badges */}
<div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0D1628]">
<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Modern architectural glass pavilion villa in Bel Air California with panoramic infinity pool looking out over city lights, travertine stone accents, sculptural black steel frames, warm minimalist interior glow, professional luxury real estate capture" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuAHcITZRaYwsrBLg4LtnJp7A21QnKSwagwTa_dIDwJO8nBKdrJ2xtLX3ihULXQewMnx4KSWlizWMMjm4zIwvOjP9U1S5PpIBLzIgZgQgVXusVoBVT-IPH62bh0KoTtH39VaXWS_7DhZ-Tgi2QIb91_L8nh0XFC8DIc0B2Rql4kejM4XSivNefodVgvaraqi43wFtqowMJdtm894r-b36ANn8Bhdes2Ek5R1QFxOB9o\')'}}>
</div>
{/* Status Chips */}
<div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
<span className="px-2.5 py-1 rounded bg-secondary text-on-secondary font-label-caps text-label-caps uppercase tracking-wider shadow">
                New Exclusive
              </span>
<span className="px-2.5 py-1 rounded bg-[#080E1B]/90 backdrop-blur-md text-[#F5F7FC] font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-1 shadow">
<span className="material-symbols-outlined text-[14px] text-[#29C5E8]">view_in_ar</span> 3D Tour
              </span>
</div>
{/* Favorite Quick Action */}
<button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#080E1B]/80 backdrop-blur-md flex items-center justify-center text-[#F5F7FC] hover:text-[#29C5E8] hover:bg-[#080E1B] transition-colors shadow" type="button">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
<div className="absolute bottom-3 left-3">
<span className="px-2 py-0.5 rounded bg-on-background/70 backdrop-blur-sm text-surface-bright font-label-caps text-label-caps tracking-widest uppercase">
                Bel Air · Los Angeles
              </span>
</div>
</div>
{/* Metadata & Details */}
<div className="p-space-lg flex-1 flex flex-col justify-between">
<div>
<div className="flex items-baseline justify-between gap-space-sm mb-1">
<h3 className="font-headline-sm text-headline-sm text-[#F5F7FC] group-hover:text-[#29C5E8] transition-colors font-medium">
                  The Bel Air Glass Pavilion
                </h3>
</div>
<p className="font-title-lg text-title-lg font-bold text-[#F5F7FC] mb-space-md">
                ₹18.50 Cr
              </p>
{/* Specifications Strip */}
<div className="grid grid-cols-4 gap-space-xs py-space-sm bg-[#0D1628] rounded-lg text-center mb-space-md">
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">5</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Beds</div>
</div>
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">7.5</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Baths</div>
</div>
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">9,420</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Sq Ft</div>
</div>
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">1.2 AC</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Lot</div>
</div>
</div>
<p className="font-body-sm text-body-sm text-[#98A7BD] line-clamp-2 mb-space-md">
                Masterfully engineered by Olson Kundig collaborators, cantilevered glass expanses frame 270-degree canyon vistas with zero-edge reflection ponds.
              </p>
</div>
{/* Agent & Inquire Row */}
<div className="pt-space-sm flex items-center justify-between bg-[#111D32]">
<div className="flex items-center gap-space-xs">
<div className="w-7 h-7 rounded-full bg-[#0D1628] overflow-hidden">
<div className="w-full h-full bg-cover bg-center" data-alt="Monochrome professional headshot of executive luxury real estate director in tailored blazer" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ-2ccnheJQMUP_hFtTaCBWm-B32jPa0q8VyXJ683_qkiVUAVitaSV4egO37w8BUrC2NQWQcNIoP8nWLryReiH3jl3WA6t51Cwdc2fP_BRZxkuCwHPL84FoFfQiDrVw6VOYgnp-woEjEEejuoz5BhL5_VDkhi-lzT4joJpggcczYV_51pmNX7dLH1fn4ktAwRB7eHwLJLCrkcz0tcNgwiBCRm_q4tn9Ps3VSKlPvg\')'}}></div>
</div>
<span className="font-label-md text-label-md text-[#98A7BD]">Julian Vance · Partner</span>
</div>
<Link className="font-label-md text-label-md text-[#29C5E8] hover:text-on-tertiary-container font-semibold flex items-center gap-0.5" data-path="exclusive-estates"  to="/catalog">
<span>View Dossier</span>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
</Link>
</div>
</div>
</article>
{/* Card 2: Pacific Heights Historic Villa */}
<article className="group bg-[#111D32] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
{/* Image Canvas */}
<div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0D1628]">
<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Restored historic Beaux-Arts European style villa in Pacific Heights San Francisco with limestone facade, classic arched entryways, private manicured courtyard with classical fountain, warm ambient evening interior light" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuAb01jMwKpWj8sCYypE8rhoPMuXjxIV3cg2TkuFB3A78aHe85QtmPD4FO2IY-Jxm5zMLGKCpkXyW2p8zWLn2Sf6eUpin5BRNeAb8BBgadNOzyH9iDJnEhv_Hl_bAMiaRx1kT53pE4-VKnvI4Ydook1ammIl4nI_JIknx4h7dEXzuyCJcrt_Egxs2ikY4NVSc-BfKCwXDz60f0JUFDEQwuOkxV3PXkeOFJSv3Co6ABs\')'}}>
</div>
<div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
<span className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-label-caps text-label-caps uppercase tracking-wider shadow">
                Historic Landmark
              </span>
<span className="px-2.5 py-1 rounded bg-[#080E1B]/90 backdrop-blur-md text-[#F5F7FC] font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-1 shadow">
<span className="material-symbols-outlined text-[14px] text-[#29C5E8]">verified</span> Arch Digest 2024
              </span>
</div>
<button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#080E1B]/80 backdrop-blur-md flex items-center justify-center text-[#F5F7FC] hover:text-[#29C5E8] hover:bg-[#080E1B] transition-colors shadow" type="button">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
<div className="absolute bottom-3 left-3">
<span className="px-2 py-0.5 rounded bg-on-background/70 backdrop-blur-sm text-surface-bright font-label-caps text-label-caps tracking-widest uppercase">
                Pacific Heights · San Francisco
              </span>
</div>
</div>
{/* Metadata & Details */}
<div className="p-space-lg flex-1 flex flex-col justify-between">
<div>
<div className="flex items-baseline justify-between gap-space-sm mb-1">
<h3 className="font-headline-sm text-headline-sm text-[#F5F7FC] group-hover:text-[#29C5E8] transition-colors font-medium">
                  Pacific Heights Historic Villa
                </h3>
</div>
<p className="font-title-lg text-title-lg font-bold text-[#F5F7FC] mb-space-md">
                ₹14.50 Cr
              </p>
{/* Specifications Strip */}
<div className="grid grid-cols-4 gap-space-xs py-space-sm bg-[#0D1628] rounded-lg text-center mb-space-md">
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">6</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Beds</div>
</div>
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">6.5</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Baths</div>
</div>
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">7,850</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Sq Ft</div>
</div>
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">Bay View</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Aspect</div>
</div>
</div>
<p className="font-body-sm text-body-sm text-[#98A7BD] line-clamp-2 mb-space-md">
                A 1922 Willis Polk triumph, comprehensively modernized with custom Boffi culinary suites, subterranean 800-bottle wine cellar, and Golden Gate view salon.
              </p>
</div>
{/* Agent & Inquire Row */}
<div className="pt-space-sm flex items-center justify-between bg-[#111D32]">
<div className="flex items-center gap-space-xs">
<div className="w-7 h-7 rounded-full bg-[#0D1628] overflow-hidden">
<div className="w-full h-full bg-cover bg-center" data-alt="Monochrome professional portrait of female luxury residential advisor in sharp minimalist attire" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDuYwskQXYPTOHS3QftG33zFPnpK6ow9AF1KRLX4Ajefx8t9ILJmofGJUyT3SUfMFjzv4J7xPBW0_4Sz1S7NkQOU_j1wuMdBuOe_rMAFcyA35go6LoWP1DVcMu-nh6Lbu8NFpnzmVRDlo5B8Arqx2CudZbrWA5fOR9LdYOM_AvQwKhtsR2oUXm9eWqVcHKAYb5Xk-a90_wEhDqQNp5b24Jt4C1sEn4Ld6eEWWz2dnw\')'}}></div>
</div>
<span className="font-label-md text-label-md text-[#98A7BD]">Eleanor Sterling · MD</span>
</div>
<Link className="font-label-md text-label-md text-[#29C5E8] hover:text-on-tertiary-container font-semibold flex items-center gap-0.5" data-path="exclusive-estates"  to="/catalog">
<span>View Dossier</span>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
</Link>
</div>
</div>
</article>
{/* Card 3: Aspen Alpine Sanctuary */}
<article className="group bg-[#111D32] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
{/* Image Canvas */}
<div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0D1628]">
<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" data-alt="Modern alpine luxury retreat in Aspen Colorado nestled among snow tipped aspen trees and pines, dark timber and charcoal slate exterior, warm glowing hearth through floor to ceiling glass, twilight dusk winter mountain ambiance" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuAvEGNDT4SaJKcbjc2iOJA7ZFTzgSfuFM_zyLQt0QfF6zbQKM7OOrYGwo19D6VxWBpt7lVgmMvWE9Si72-Obp4eQFs7hwWFl1M3S55FILTHwLooNomIxjjNAdYA7rBIYg-nfEcY5ktq0Stse9Oic09eKIRQctSu9FuZ__CMtQ2GoTIKUYErMYKDseTGHImhXYQ5suuDGGWn4cFdXaTYlykhTRlylNBYweKAjEJh7l0\')'}}>
</div>
<div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
<span className="px-2.5 py-1 rounded bg-[#3978F6] text-white font-label-caps text-label-caps uppercase tracking-wider shadow">
                Ski-In / Ski-Out
              </span>
<span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase tracking-wider shadow">
                Price Upon Request
              </span>
</div>
<button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#080E1B]/80 backdrop-blur-md flex items-center justify-center text-[#F5F7FC] hover:text-[#29C5E8] hover:bg-[#080E1B] transition-colors shadow" type="button">
<span className="material-symbols-outlined text-[18px]">favorite</span>
</button>
<div className="absolute bottom-3 left-3">
<span className="px-2 py-0.5 rounded bg-on-background/70 backdrop-blur-sm text-surface-bright font-label-caps text-label-caps tracking-widest uppercase">
                Red Mountain · Aspen
              </span>
</div>
</div>
{/* Metadata & Details */}
<div className="p-space-lg flex-1 flex flex-col justify-between">
<div>
<div className="flex items-baseline justify-between gap-space-sm mb-1">
<h3 className="font-headline-sm text-headline-sm text-[#F5F7FC] group-hover:text-[#29C5E8] transition-colors font-medium">
                  Aspen Alpine Sanctuary
                </h3>
</div>
<p className="font-title-lg text-title-lg font-bold text-[#F5F7FC] mb-space-md">
                ₹38.50 Cr
              </p>
{/* Specifications Strip */}
<div className="grid grid-cols-4 gap-space-xs py-space-sm bg-[#0D1628] rounded-lg text-center mb-space-md">
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">4</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Beds</div>
</div>
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">5</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Baths</div>
</div>
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">6,120</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Sq Ft</div>
</div>
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">3.8 AC</div>
<div className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Private</div>
</div>
</div>
<p className="font-body-sm text-body-sm text-[#98A7BD] line-clamp-2 mb-space-md">
                Direct ski access to Buttermilk Mountain, wrapped in blackened cedar and rough-cut Colorado granite with heated outdoor swimming grotto and private heli-pad.
              </p>
</div>
{/* Agent & Inquire Row */}
<div className="pt-space-sm flex items-center justify-between bg-[#111D32]">
<div className="flex items-center gap-space-xs">
<div className="w-7 h-7 rounded-full bg-[#0D1628] overflow-hidden">
<div className="w-full h-full bg-cover bg-center" data-alt="Monochrome portrait of senior mountain luxury real estate director" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuBR5XXVMbTSBDDjZK6BMw6hPFunPARl4_R6YewhztsEM_AlC53yteALWagDA__ww6_zAbPuf-xIZ3XeZiJZO1davUwkvmPEwARO7jcWULltNKxSuS13oaTVNqBRMf-0LD5rtfHqSiToGluVaVH2ujdMvgp4bnN6Bb9ucITPMvWzL6UrwsSjcY8-bDf3eRpLUoSk0fUpnxJ44VwX7RBGEEepa1yvYaoeU5Xiu9qfE_Y\')'}}></div>
</div>
<span className="font-label-md text-label-md text-[#98A7BD]">Marcus Thorne · Principal</span>
</div>
<Link className="font-label-md text-label-md text-[#29C5E8] hover:text-on-tertiary-container font-semibold flex items-center gap-0.5" data-path="exclusive-estates"  to="/catalog">
<span>View Dossier</span>
<span className="material-symbols-outlined text-[16px]">chevron_right</span>
</Link>
</div>
</div>
</article>
</div>
</div>
</section>
{/* Neighborhood Exploration Guide (Bento Map & Zip Codes) */}
<section className="w-full py-space-xl bg-[#0D1628]">
<div className="max-w-7xl mx-auto px-margin">
{/* Section Heading */}
<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
<div>
<span className="font-label-caps text-label-caps uppercase tracking-widest text-[#29C5E8] font-bold">Geographic Authority</span>
<h2 className="font-headline-lg text-headline-lg text-[#F5F7FC] font-light mt-1">
            Prime Metro Micro-Market Indices
          </h2>
</div>
<p className="font-body-sm text-body-sm text-[#98A7BD] max-w-md">
          Live liquidity metrics, median values, and off-market inventory levels across America's most fortified high-wealth enclaves.
        </p>
</div>
{/* Bento Grid of Neighborhoods */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/* Neighborhood 1: Presidio Heights */}
<div className="group bg-[#111D32] rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-pointer">
<div>
<div className="relative w-full h-44 rounded-lg overflow-hidden mb-space-md bg-[#0D1628]">
<div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" data-alt="Quiet tree-lined residential street of grand brick colonial revival mansions in Presidio Heights San Francisco with fog clearing over greenery" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuAUZFYpy2p1Deujak9WuE_nnFX5TAqWZgUGWnVJwrjjY3fC7D4ze1nm00EMeQAJTk5jAcJSMWaULJYQ_TWn3yZQPs7d42lesR8StqDcxg1VtrP1iUjZPrO6K7JOnYeGyImQpFXEvbkJOu5wi2ZbLzPaqLPfhBD5F-QXO3UQJNo50KrzODPnJvReop5Qfy2YAX4Ot0OpTnE3AHHVgxo4tQeK0QJtSipp7Hllhy27ivM\')'}}></div>
<div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#080E1B]/90 text-[#F5F7FC] font-label-caps text-label-caps">
                ZIP 94118
              </div>
</div>
<div className="flex items-center justify-between mb-1">
<h4 className="font-title-lg text-title-lg text-[#F5F7FC] font-bold">Presidio Heights</h4>
<span className="material-symbols-outlined text-[#29C5E8] text-[20px]">north_east</span>
</div>
<p className="font-body-sm text-body-sm text-[#98A7BD] mb-space-md">San Francisco, CA</p>
</div>
<div className="pt-space-sm bg-[#0D1628] rounded-lg p-space-sm flex items-center justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-[#98A7BD] block">Avg. Price</span>
<span className="font-title-md text-title-md font-bold text-[#F5F7FC]">₹11.40 Cr</span>
</div>
<div className="text-right">
<span className="font-label-caps text-label-caps uppercase text-[#98A7BD] block">Active Supply</span>
<span className="font-title-md text-title-md font-bold text-[#29C5E8]">8 Private Briefs</span>
</div>
</div>
</div>
{/* Neighborhood 2: Tribeca */}
<div className="group bg-[#111D32] rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-pointer">
<div>
<div className="relative w-full h-44 rounded-lg overflow-hidden mb-space-md bg-[#0D1628]">
<div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" data-alt="Historic cobblestone street in Tribeca New York City with cast iron facade buildings, boutique residential entrance, dusk lighting, warm urban luxury editorial" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuA7jk2YJX1310OP8nju0c3cC0oQzkE5HKG40I5kMMqQLz1bj-OjwAlVnVEK0dWwpJ57oczE1u7GK2F0BIDkCswMzgVl35ngMhW_MNWpKPJ70bu9UtuTQljXClRwGv8BaJC7T1ptEyBnxDup3vTc_4baJebqSrBGrX2893yzWDtqy7Bsjt1PdkLY8pqKkPwhVKMo4HTbIJ1DpiOyfMUC5AnA5ZqloaKMYYEc5vGianE\')'}}></div>
<div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#080E1B]/90 text-[#F5F7FC] font-label-caps text-label-caps">
                ZIP 10013
              </div>
</div>
<div className="flex items-center justify-between mb-1">
<h4 className="font-title-lg text-title-lg text-[#F5F7FC] font-bold">Tribeca</h4>
<span className="material-symbols-outlined text-[#29C5E8] text-[20px]">north_east</span>
</div>
<p className="font-body-sm text-body-sm text-[#98A7BD] mb-space-md">New York City, NY</p>
</div>
<div className="pt-space-sm bg-[#0D1628] rounded-lg p-space-sm flex items-center justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-[#98A7BD] block">Avg. Price</span>
<span className="font-title-md text-title-md font-bold text-[#F5F7FC]">₹14.20 Cr</span>
</div>
<div className="text-right">
<span className="font-label-caps text-label-caps uppercase text-[#98A7BD] block">Active Supply</span>
<span className="font-title-md text-title-md font-bold text-[#29C5E8]">14 Penthouses</span>
</div>
</div>
</div>
{/* Neighborhood 3: Beverly Hills */}
<div className="group bg-[#111D32] rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-pointer">
<div>
<div className="relative w-full h-44 rounded-lg overflow-hidden mb-space-md bg-[#0D1628]">
<div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" data-alt="Lush palm tree lined wide avenue in Beverly Hills California with Mediterranean estate gates and sculpted private hedgerows bathed in golden sunlight" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuB15037MU-vbRvfQIfv69xxt1Ts6gMMHUEiAieLiRIff53GhcAOM9JUFOS0eGJOrCuAOQuPWLTivL5ij1ucLnVhUbSThz04EeNh14MuOSUF0Wv2CLVzH9LGeM9R6wK1IuqbZofQRox0symd54gVkx0hgO08XFIeHH0IPH0LAS3NUXebAmXZbU35208-izFfLQIj2ltzBTvl9onK1MX4CyyL-5SM6X8aMxooCuCR23I\')'}}></div>
<div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#080E1B]/90 text-[#F5F7FC] font-label-caps text-label-caps">
                ZIP 90210
              </div>
</div>
<div className="flex items-center justify-between mb-1">
<h4 className="font-title-lg text-title-lg text-[#F5F7FC] font-bold">Beverly Hills</h4>
<span className="material-symbols-outlined text-[#29C5E8] text-[20px]">north_east</span>
</div>
<p className="font-body-sm text-body-sm text-[#98A7BD] mb-space-md">Los Angeles, CA</p>
</div>
<div className="pt-space-sm bg-[#0D1628] rounded-lg p-space-sm flex items-center justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-[#98A7BD] block">Avg. Price</span>
<span className="font-title-md text-title-md font-bold text-[#F5F7FC]">₹16.80 Cr</span>
</div>
<div className="text-right">
<span className="font-label-caps text-label-caps uppercase text-[#98A7BD] block">Active Supply</span>
<span className="font-title-md text-title-md font-bold text-[#29C5E8]">22 Compounds</span>
</div>
</div>
</div>
{/* Neighborhood 4: Carmel-by-the-Sea */}
<div className="group bg-[#111D32] rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all cursor-pointer">
<div>
<div className="relative w-full h-44 rounded-lg overflow-hidden mb-space-md bg-[#0D1628]">
<div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" data-alt="Rugged granite coastline of Carmel-by-the-Sea with iconic cypress trees framing a modernist cliffside estate overlooking turquoise ocean waves" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCB42M3sLAC7Q6HmOGf1086L0tiqsY69a2DQuPw86bgA047_PFjKwRflwy_UMawo9wZ0z3nkaqmVBFcSAH4WN8UiM-zFFjJNZD1FvePYxAYayvCSWI1_FH3Zzh5bT6rmHXVy6Gsx2SbgxuWVsvWfv3YEAKxqVRzGrOqCAVC0E18cYI2cB2dn3GpRX6YloYmyfHDk8E6AtBCbBoR42raNgaZyW0Z9FRXytRZkefx1Ho\')'}}></div>
<div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#080E1B]/90 text-[#F5F7FC] font-label-caps text-label-caps">
                ZIP 93921
              </div>
</div>
<div className="flex items-center justify-between mb-1">
<h4 className="font-title-lg text-title-lg text-[#F5F7FC] font-bold">Carmel-by-the-Sea</h4>
<span className="material-symbols-outlined text-[#29C5E8] text-[20px]">north_east</span>
</div>
<p className="font-body-sm text-body-sm text-[#98A7BD] mb-space-md">Monterey Peninsula, CA</p>
</div>
<div className="pt-space-sm bg-[#0D1628] rounded-lg p-space-sm flex items-center justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-[#98A7BD] block">Avg. Price</span>
<span className="font-title-md text-title-md font-bold text-[#F5F7FC]">₹9.80 Cr</span>
</div>
<div className="text-right">
<span className="font-label-caps text-label-caps uppercase text-[#98A7BD] block">Active Supply</span>
<span className="font-title-md text-title-md font-bold text-[#29C5E8]">6 Coastal Enclaves</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Interactive Data Feature: The Haven & Key Liquidity Compass */}
<section className="w-full py-space-xl bg-[#080E1B]">
<div className="max-w-7xl mx-auto px-margin">
<div className="bg-[#0D1628] rounded-2xl p-space-lg md:p-space-xl flex flex-col lg:flex-row items-center justify-between gap-space-xl">
<div className="max-w-lg">
<span className="px-space-sm py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase tracking-wider mb-space-sm inline-block">
            Proprietary Valuation Model
          </span>
<h3 className="font-headline-lg text-headline-lg text-[#F5F7FC] font-light leading-snug">
            Institutional Insight. Quiet Capital Precision.
          </h3>
<p className="font-body-md text-body-md text-[#98A7BD] mt-space-sm mb-space-md">
            Our algorithmic valuation platform tracks micro-absorption rates, private non-MLS trades, and cross-border ultra-high-net-worth liquidity shifts with zero public footprint.
          </p>
<div className="flex flex-col gap-space-xs text-[#F5F7FC] font-body-sm text-body-sm mb-space-md">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[#29C5E8] text-[18px]">check_circle</span>
<span>Encrypted client ledger with audited non-disclosure protocols</span>
</div>
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[#29C5E8] text-[18px]">check_circle</span>
<span>Private aircraft apron transfers for discreet inspections</span>
</div>
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-[#29C5E8] text-[18px]">check_circle</span>
<span>Dual-representation mitigation under independent fiduciary oversight</span>
</div>
</div>
<button className="px-space-lg py-space-sm rounded-lg bg-[#3978F6] text-white font-label-md text-label-md hover:bg-on-tertiary-container transition-colors shadow" type="button">
            Request Private Market Dossier
          </button>
</div>
{/* Inline Data Graphic: Absorption Velocity Sparkline & Chart */}
<div className="w-full lg:w-[480px] bg-[#111D32] rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-[#98A7BD]">Q3 / Q4 Absorption Index</span>
<div className="font-headline-sm text-headline-sm text-[#F5F7FC] font-bold">$10M+ Segment Velocity</div>
</div>
<span className="px-2 py-1 rounded bg-[#111D32]est text-white-fixed font-label-caps text-label-caps">
              +18.4% YoY
            </span>
</div>
{/* Minimalist Vector Chart */}
<div className="w-full h-40 flex flex-col justify-end">
<svg className="w-full h-32 overflow-visible" preserveaspectratio="none" viewbox="0 0 400 120">
<defs>
<lineargradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#904d00" stop-opacity="0.3"></stop>
<stop offset="100%" stop-color="#904d00" stop-opacity="0.0"></stop>
</lineargradient>
</defs>
{/* Filled Area */}
<path d="M 0,100 Q 60,85 100,70 T 200,60 T 300,30 T 400,10 L 400,120 L 0,120 Z" fill="url(#chartGrad)"></path>
{/* Primary Line */}
<path d="M 0,100 Q 60,85 100,70 T 200,60 T 300,30 T 400,10" fill="none" stroke="#904d00" strokeLinecap="round" strokeWidth="3"></path>
{/* Dot Anchors */}
<circle cx="100" cy="70" fill="#0b1c30" r="4"></circle>
<circle cx="200" cy="60" fill="#0b1c30" r="4"></circle>
<circle cx="300" cy="30" fill="#0b1c30" r="4"></circle>
<circle cx="400" cy="10" fill="#fe932c" r="5"></circle>
</svg>
<div className="flex justify-between text-[#98A7BD] font-label-caps text-label-caps uppercase pt-2">
<span>Nov 2024</span>
<span>Jan 2025</span>
<span>Mar 2025</span>
<span>May 2025 (Forecast)</span>
</div>
</div>
{/* Quick Metrics Row */}
<div className="grid grid-cols-2 gap-space-sm pt-space-xs bg-[#111D32]">
<div className="bg-[#0D1628] p-space-sm rounded-lg">
<span className="font-label-caps text-label-caps text-[#98A7BD] block uppercase">Domestic Demand</span>
<span className="font-title-md text-title-md font-bold text-[#F5F7FC]">62% Liquidity</span>
</div>
<div className="bg-[#0D1628] p-space-sm rounded-lg">
<span className="font-label-caps text-label-caps text-[#98A7BD] block uppercase">Off-Shore Inflow</span>
<span className="font-title-md text-title-md font-bold text-[#F5F7FC]">38% Global</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Bespoke Concierge & Private Client Services */}
<section className="w-full py-space-xl bg-[#0D1628]">
<div className="max-w-7xl mx-auto px-margin">
<div className="text-center max-w-2xl mx-auto mb-space-xl">
<span className="font-label-caps text-label-caps uppercase tracking-widest text-[#29C5E8] font-bold">Unrivaled Advisory</span>
<h2 className="font-headline-lg text-headline-lg text-[#F5F7FC] font-light mt-1">
          Private Client Services
        </h2>
<p className="font-body-md text-body-md text-[#98A7BD] mt-space-xs">
          Beyond transaction execution. We orchestrate discrete acquisitions with specialized lifestyle infrastructure.
        </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
{/* Service 1 */}
<div className="bg-[#111D32] rounded-xl p-space-lg shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
<div>
<div className="w-12 h-12 rounded-lg bg-[#0D1628] flex items-center justify-center text-[#29C5E8] mb-space-md group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
<span className="material-symbols-outlined text-[24px]">flight_takeoff</span>
</div>
<h3 className="font-title-lg text-title-lg text-[#F5F7FC] font-semibold mb-space-xs">
              Private Aviation Logistics
            </h3>
<p className="font-body-sm text-body-sm text-[#98A7BD] leading-relaxed mb-space-md">
              Seamless charter integration with NetJets and VistaJet for door-to-helipad viewing itineraries across remote coastal and alpine portfolios.
            </p>
</div>
<div className="pt-space-sm flex items-center text-[#29C5E8] font-label-md text-label-md font-bold gap-1">
<span>Charter Concierge</span>
<span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
</div>
</div>
{/* Service 2 */}
<div className="bg-[#111D32] rounded-xl p-space-lg shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
<div>
<div className="w-12 h-12 rounded-lg bg-[#0D1628] flex items-center justify-center text-[#29C5E8] mb-space-md group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
<span className="material-symbols-outlined text-[24px]">security</span>
</div>
<h3 className="font-title-lg text-title-lg text-[#F5F7FC] font-semibold mb-space-xs">
              Confidential Representation
            </h3>
<p className="font-body-sm text-body-sm text-[#98A7BD] leading-relaxed mb-space-md">
              Complete anonymity preservation for family offices, tech founders, and sovereign accounts with encrypted communication channels and blind trust title structuring.
            </p>
</div>
<div className="pt-space-sm flex items-center text-[#29C5E8] font-label-md text-label-md font-bold gap-1">
<span>Fiduciary Protocols</span>
<span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
</div>
</div>
{/* Service 3 */}
<div className="bg-[#111D32] rounded-xl p-space-lg shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
<div>
<div className="w-12 h-12 rounded-lg bg-[#0D1628] flex items-center justify-center text-[#29C5E8] mb-space-md group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
<span className="material-symbols-outlined text-[24px]">chair</span>
</div>
<h3 className="font-title-lg text-title-lg text-[#F5F7FC] font-semibold mb-space-xs">
              Architectural &amp; Curation Advisory
            </h3>
<p className="font-body-sm text-body-sm text-[#98A7BD] leading-relaxed mb-space-md">
              Direct relationships with premier interior ateliers, blue-chip fine art conservators, and historical preservation authorities for post-acquisition turnkey outfitting.
            </p>
</div>
<div className="pt-space-sm flex items-center text-[#29C5E8] font-label-md text-label-md font-bold gap-1">
<span>Atelier Network</span>
<span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
</div>
</div>
</div>
</div>
</section>
{/* Editorial Press Quotes & Client Testimonials */}
<section className="w-full py-space-xl bg-[#080E1B]">
<div className="max-w-7xl mx-auto px-margin">
{/* Section Divider Header */}
<div className="flex items-center justify-between pb-space-md mb-space-lg">
<h3 className="font-label-caps text-label-caps uppercase tracking-widest text-[#98A7BD]">
          Published Recognition · Global Press
        </h3>
<div className="flex items-center gap-space-md text-[#98A7BD]">
<span className="font-label-md text-label-md italic">The Wall Street Journal</span>
<span className="font-label-md text-label-md italic">Architectural Digest</span>
<span className="font-label-md text-label-md italic">Financial Times</span>
<span className="font-label-md text-label-md italic">Robb Report</span>
</div>
</div>
{/* Testimonial Bento */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
{/* Prominent Quote Card */}
<div className="lg:col-span-7 bg-[#0D1628] rounded-2xl p-space-xl relative overflow-hidden">
<span className="material-symbols-outlined text-[#29C5E8]/20 text-[96px] absolute -top-4 -left-2 pointer-events-none select-none">format_quote</span>
<div className="relative z-10">
<div className="flex items-center gap-1 text-[#29C5E8] mb-space-md">
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
<span className="material-symbols-outlined text-[18px]">star</span>
</div>
<blockquote className="font-headline-md text-headline-md text-[#F5F7FC] font-light leading-relaxed mb-space-lg">
              "Haven &amp; Key handled our off-market Sea Cliff acquisition with mathematical discretion. Not a single rumor breached the press, and every closing term reflected genuine fiduciary rigor."
            </blockquote>
<div className="flex items-center gap-space-sm">
<div className="w-12 h-12 rounded-full bg-[#0D1628] overflow-hidden">
<div className="w-full h-full bg-cover bg-center" data-alt="Monochrome close up portrait of tech entrepreneur in subtle dark cashmere sweater looking confident and composed" style={{'backgroundImage': 'url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuD31WQ9lg17wjZNPi7HNHbtn8FkSQne5w66AZCj93VKW69PBeeWSJsXATF-CpyLyG1AH8Xfmm4ijCjc71Xp8M3sDTcFgfzWc8YQyDrfjMGXgRYk0O2T8GBx6loy8DpLssD8x9HGEzS_RYH8Cx6QOQcMqio5chZuVi-ou6vsWtgkeChn6X1-BOBDPGZm3WmTZYcBDcihibvBJu3vAzSXYea11pqqmqxR1S9r8Cnipz4\')'}}></div>
</div>
<div>
<div className="font-title-md text-title-md font-bold text-[#F5F7FC]">Christian &amp; Sophia Lindqvist</div>
<div className="font-body-sm text-body-sm text-[#98A7BD]">Principals, Apex Capital Holdings · San Francisco &amp; Geneva</div>
</div>
</div>
</div>
</div>
{/* Press Snippets Column */}
<div className="lg:col-span-5 flex flex-col gap-space-md">
<div className="bg-[#111D32] p-space-lg rounded-xl shadow-sm">
<span className="font-label-caps text-label-caps uppercase text-[#29C5E8] font-bold block mb-1">Architectural Digest · Private Issue</span>
<p className="font-body-md text-body-md text-[#F5F7FC] italic mb-2">
              "Haven &amp; Key has redefined the ultra-prime residential landscape by treating historic preservation with the curatorial precision of a world-class gallery."
            </p>
<span className="font-label-md text-label-md text-[#98A7BD]">Estate of the Year Feature · 2024</span>
</div>
<div className="bg-[#111D32] p-space-lg rounded-xl shadow-sm">
<span className="font-label-caps text-label-caps uppercase text-[#29C5E8] font-bold block mb-1">The Wall Street Journal · Mansions</span>
<p className="font-body-md text-body-md text-[#F5F7FC] italic mb-2">
              "Leading the California and New York corridors in confidential trades exceeding $20 million, setting consecutive benchmark price-per-square-foot records."
            </p>
<span className="font-label-md text-label-md text-[#98A7BD]">Market Leadership Report</span>
</div>
</div>
</div>
</div>
</section>
{/* Interactive Private Consultation Callout */}
<section className="w-full py-space-xl bg-[#0D1628]">
<div className="max-w-7xl mx-auto px-margin">
<div className="bg-[#3978F6] text-white rounded-2xl p-space-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-space-lg shadow-xl">
{/* Background subtle glow */}
<div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>
<div className="relative z-10 max-w-xl">
<span className="font-label-caps text-label-caps uppercase tracking-widest text-[#29C5E8]-container font-bold mb-space-xs block">
            Direct Principal Access
          </span>
<h3 className="font-headline-lg text-headline-lg text-surface-bright font-light mb-space-xs">
            Contemplating a Confidential Sale or Acquisition?
          </h3>
<p className="font-body-md text-body-md text-surface-variant leading-relaxed">
            Schedule a private consultation with our managing partners. All inquiries are bound by our standard binding institutional non-disclosure protocol.
          </p>
</div>
<div className="relative z-10 flex flex-col sm:flex-row items-center gap-space-sm w-full md:w-auto">
<Link className="w-full sm:w-auto px-space-xl py-3.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:bg-secondary-container transition-all text-center font-bold shadow-md" data-path="list-property"  to="/dashboard/properties">
            Schedule Private Briefing
          </Link>
<Link className="w-full sm:w-auto px-space-lg py-3.5 rounded-lg bg-[#111D32]est text-white-fixed font-label-md text-label-md hover:bg-[#080E1B]-bright transition-all text-center font-bold" data-path="agents"  to="/advisor">
            Meet Our Partners
          </Link>
</div>
</div>
</div>
</section>
{/* Client-side Interactive Tabs Logic */}

</div>
      </main>

      <HavenFooter />
    </div>
  );
}
