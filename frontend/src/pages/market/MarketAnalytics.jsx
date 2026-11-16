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

  const pieColors = ['#3978F6', '#29C5E8', '#20C997', '#F5B942'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#F5F7FC] tracking-tight">Market Intelligence & Price Velocity</h2>
          <p className="text-xs text-[#98A7BD]">
            Longitudinal housing transaction indices, capital appreciation velocity, and locality absorption metrics.
          </p>
        </div>
        <div className="text-xs text-[#98A7BD] bg-[#111D32] border border-[#23324A] px-3.5 py-1.5 rounded-xl font-mono">
          Registry Index Source: {analytics?.data_source || 'Unified Real Estate Registry'}
        </div>
      </div>

      {/* Primary Historical Price Velocity Chart */}
      <div className="bg-[#111D32] border border-[#23324A] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#23324A] gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#F5F7FC]">Metropolitan Price per Square Foot Movement (INR/sqft)</h3>
            <p className="text-[11px] text-[#98A7BD]">Trailing 6 quarters capital value velocity across primary Indian tier-1 economic hubs</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center space-x-1.5 text-[#3978F6]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3978F6]"></span>
              <span>Mumbai</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#29C5E8]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#29C5E8]"></span>
              <span>Bengaluru</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#20C997]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#20C997]"></span>
              <span>Hyderabad</span>
            </span>
            <span className="flex items-center space-x-1.5 text-[#F5B942]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5B942]"></span>
              <span>Pune</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#23324A" />
              <XAxis dataKey="quarter" stroke="#98A7BD" fontSize={11} tickLine={false} />
              <YAxis stroke="#98A7BD" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0D1628', borderColor: '#23324A', borderRadius: '8px', fontSize: '11px' }}
                itemStyle={{ color: '#F5F7FC' }}
              />
              <Line type="monotone" dataKey="mumbai_avg" stroke="#3978F6" strokeWidth={2.5} dot={{ r: 4 }} name="Mumbai Avg" />
              <Line type="monotone" dataKey="bengaluru_avg" stroke="#29C5E8" strokeWidth={2.5} dot={{ r: 4 }} name="Bengaluru Avg" />
              <Line type="monotone" dataKey="hyderabad_avg" stroke="#20C997" strokeWidth={2.5} dot={{ r: 4 }} name="Hyderabad Avg" />
              <Line type="monotone" dataKey="pune_avg" stroke="#F5B942" strokeWidth={2.5} dot={{ r: 4 }} name="Pune Avg" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout: Locality Comparisons & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Locality Comparisons Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#111D32] border border-[#23324A] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#23324A]">
            <h3 className="text-sm font-bold text-[#F5F7FC]">Key Cluster Price & Demand Benchmarks</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D1628] text-[#98A7BD] border-b border-[#23324A]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Locality & City</th>
                  <th className="py-2.5 px-3 font-semibold">Avg Rate / Sqft</th>
                  <th className="py-2.5 px-3 font-semibold">Annual Appreciation</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Liquidity Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23324A]">
                {localities.map((loc, i) => (
                  <tr key={i} className="hover:bg-[#0D1628]/60 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-[#F5F7FC]">{loc.locality}</td>
                    <td className="py-2.5 px-3 font-bold text-[#20C997]">INR {loc.avg_price_sqft.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-[#29C5E8]">+{loc.annual_growth}% YoY</td>
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
        <div className="lg:col-span-5 bg-[#111D32] border border-[#23324A] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-[#23324A]">
              <h3 className="text-sm font-bold text-[#F5F7FC]">Housing Category Volume Share</h3>
              <p className="text-[11px] text-[#98A7BD]">Institutional absorption across unit typologies</p>
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
                    contentStyle={{ backgroundColor: '#0D1628', borderColor: '#23324A', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs">
              {categories.map((cat, i) => (
                <div key={i} className="flex justify-between items-center text-[#98A7BD]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pieColors[i % pieColors.length] }}></span>
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-bold text-[#F5F7FC]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#080E1B] border border-[#23324A] rounded-xl text-[11px] text-[#98A7BD]">
            Sample Base: <strong className="text-[#F5F7FC]">{analytics?.sample_size?.toLocaleString()} transactions</strong> verified through regulatory registries.
          </div>
        </div>

      </div>

    </div>
  );
};

export default MarketAnalytics;
