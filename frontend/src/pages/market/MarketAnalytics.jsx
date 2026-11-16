import React, { useState, useEffect } from 'react';
import {
  TrendingUp, BarChart2, PieChart as PieIcon, MapPin,
  Calendar, Layers, ArrowUpRight, ShieldCheck
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { marketAPI } from '../../services/api';

const MarketAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await marketAPI.getAnalytics({ city: cityFilter || undefined });
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [cityFilter]);

  const trends = analytics?.historical_trends || [];
  const localities = analytics?.locality_comparisons || [];
  const categories = analytics?.category_distribution || [];

  const pieColors = ['#3978F6', '#0284C7', '#059669', '#D97706'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Market Intelligence & Price Velocity</h2>
          <p className="text-xs text-[#475569]">
            Longitudinal housing transaction indices, capital appreciation velocity, and locality absorption metrics.
          </p>
        </div>
        <div className="text-xs text-[#475569] bg-[#FFFFFF] border border-[#E2E8F0] px-3.5 py-1.5 rounded-xl font-mono">
          Registry Index Source: {analytics?.data_source || 'Unified Real Estate Registry'}
        </div>
      </div>

      {/* Primary Historical Price Velocity Chart */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E2E8F0] gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Metropolitan Price per Square Foot Movement (INR/sqft)</h3>
            <p className="text-[11px] text-[#475569]">Trailing 6 quarters capital value velocity across primary Indian tier-1 economic hubs</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center space-x-1.5 text-[#3978F6]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3978F6]"></span>
              <span>Mumbai</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#0284C7]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
              <span>Bengaluru</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#059669]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
              <span>Hyderabad</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#D97706]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
              <span>Pune</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="quarter" stroke="#475569" fontSize={11} tickLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '11px' }}
                itemStyle={{ color: '#0F172A' }}
              />
              <Line type="monotone" dataKey="mumbai_avg" stroke="#3978F6" strokeWidth={2.5} dot={{ r: 4 }} name="Mumbai Avg" />
              <Line type="monotone" dataKey="bengaluru_avg" stroke="#0284C7" strokeWidth={2.5} dot={{ r: 4 }} name="Bengaluru Avg" />
              <Line type="monotone" dataKey="hyderabad_avg" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} name="Hyderabad Avg" />
              <Line type="monotone" dataKey="pune_avg" stroke="#D97706" strokeWidth={2.5} dot={{ r: 4 }} name="Pune Avg" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout: Locality Comparisons & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Locality Comparisons Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-sm font-bold text-[#0F172A]">Key Cluster Price & Demand Benchmarks</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F5F9] text-[#475569] border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Locality & City</th>
                  <th className="py-2.5 px-3 font-semibold">Avg Rate / Sqft</th>
                  <th className="py-2.5 px-3 font-semibold">Annual Appreciation</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Liquidity Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {localities.map((loc, i) => (
                  <tr key={i} className="hover:bg-[#F1F5F9]/60 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#0F172A]">{loc.locality}</td>
                    <td className="py-2.5 px-3 font-bold text-[#059669]">INR {loc.avg_price_sqft.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-[#0284C7]">+{loc.annual_growth}% YoY</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#3978F6]/15 border border-[#3978F6]/30 text-[10px] font-bold text-[#3978F6]">
                        {loc.demand_score} / 100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Share Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#0F172A]">Housing Category Volume Share</h3>
              <p className="text-[11px] text-[#475569]">Institutional absorption across unit typologies</p>
            </div>

            <div className="h-56 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs">
              {categories.map((cat, i) => (
                <div key={i} className="flex justify-between items-center text-[#475569]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[i % pieColors.length] }}></span>
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-bold text-[#0F172A]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[11px] text-[#475569]">
            Sample Base: <strong className="text-[#0F172A]">{analytics?.sample_size?.toLocaleString()} transactions</strong> verified through regulatory registries.
          </div>
        </div>

      </div>

    </div>
  );
};

export default MarketAnalytics;
