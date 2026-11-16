import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Calculator, Landmark, ShieldAlert, FileText, AlertTriangle,
  FileCheck2, ArrowUpRight, TrendingUp, CheckCircle2, Clock, Plus
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { dashboardAPI, propertiesAPI, loansAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DashboardOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overviewData, setOverviewData] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentLoans, setRecentLoans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ovRes, propRes, loanRes] = await Promise.all([
          dashboardAPI.getOverview(),
          propertiesAPI.list({ limit: 4 }),
          loansAPI.list()
        ]);
        setOverviewData(ovRes.data);
        setRecentProperties(propRes.data || []);
        setRecentLoans((loanRes.data || []).slice(0, 4));
      } catch (err) {
        console.error("Dashboard overview error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const metrics = overviewData?.metrics || {
    total_properties: 0,
    valuations_completed: 0,
    active_loan_applications: 0,
    applications_under_review: 0,
    risk_assessments: 0,
    documents_processed: 0,
    fraud_alerts: 0,
    reports_generated: 0
  };

  const cards = [
    { title: "Total Properties", value: metrics.total_properties, icon: Building2, color: "text-[#3978F6]", bg: "bg-[#3978F6]/10", border: "border-[#3978F6]/30", link: "/dashboard/properties" },
    { title: "Valuations Completed", value: metrics.valuations_completed, icon: Calculator, color: "text-[#0284C7]", bg: "bg-[#0284C7]/10", border: "border-[#0284C7]/30", link: "/dashboard/valuation" },
    { title: "Active Loan Applications", value: metrics.active_loan_applications, icon: Landmark, color: "text-[#059669]", bg: "bg-[#059669]/10", border: "border-[#059669]/30", link: "/dashboard/mortgage" },
    { title: "Under Officer Review", value: metrics.applications_under_review, icon: Clock, color: "text-[#D97706]", bg: "bg-[#D97706]/10", border: "border-[#D97706]/30", link: "/dashboard/mortgage" },
    { title: "Risk Assessments", value: metrics.risk_assessments, icon: ShieldAlert, color: "text-[#0284C7]", bg: "bg-[#0284C7]/10", border: "border-[#0284C7]/30", link: "/dashboard/risk" },
    { title: "Documents Ingested", value: metrics.documents_processed, icon: FileText, color: "text-[#3978F6]", bg: "bg-[#3978F6]/10", border: "border-[#3978F6]/30", link: "/dashboard/documents" },
    { title: "Fraud & Anomaly Alerts", value: metrics.fraud_alerts, icon: AlertTriangle, color: "text-[#DC2626]", bg: "bg-[#DC2626]/10", border: "border-[#DC2626]/30", link: "/dashboard/fraud" },
    { title: "Reports Generated", value: metrics.reports_generated, icon: FileCheck2, color: "text-[#059669]", bg: "bg-[#059669]/10", border: "border-[#059669]/30", link: "/dashboard/reports" }
  ];

  const chartData = overviewData?.monthly_activity || [
    { month: "Nov 2025", valuations: 28, applications: 14, approved: 11 },
    { month: "Dec 2025", valuations: 35, applications: 19, approved: 15 },
    { month: "Jan 2026", valuations: 42, applications: 26, approved: 20 },
    { month: "Feb 2026", valuations: 49, applications: 31, approved: 24 },
    { month: "Mar 2026", valuations: 58, applications: 38, approved: 29 },
    { month: "Apr 2026", valuations: 64, applications: 44, approved: 36 }
  ];

  const riskChartData = overviewData?.risk_distribution || [
    { category: "Low Risk", count: 68 },
    { category: "Moderate Risk", count: 42 },
    { category: "High Risk", count: 16 },
    { category: "Critical", count: 5 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider block">
            Institutional Valuation & Credit Intelligence
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] mt-1">
            Welcome, {user?.full_name || 'Officer'}
          </h2>
          <p className="text-xs text-[#475569] mt-1">
            Account Clearance: <span className="text-[#3978F6] font-semibold">{user?.account_type}</span> | Active Engine: <span className="text-[#0284C7]">PropWise v3.1 Enterprise</span>
          </p>
        </div>

        {/* Fast Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/dashboard/properties')}
            className="px-4 py-2 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-md shadow-[#3978F6]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Asset</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/valuation')}
            className="px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] transition-colors"
          >
            Execute Valuation
          </button>
          <button
            onClick={() => navigate('/dashboard/mortgage')}
            className="px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] transition-colors"
          >
            New Mortgage File
          </button>
        </div>
      </div>

      {/* 8 Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              onClick={() => navigate(c.link)}
              className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#3978F6]/50 rounded-xl p-4.5 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#475569] font-medium leading-none">{c.title}</span>
                <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.border} border flex items-center justify-center ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#0F172A] tracking-tight">
                {loading ? '...' : c.value}
              </div>
              <div className="mt-2 flex items-center text-[10px] text-[#0284C7] font-medium">
                <span>View workspace</span>
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Valuation & Underwriting Velocity</h3>
              <p className="text-[11px] text-[#475569]">Six-month trend of valuations and completed mortgage reviews</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5 text-[#3978F6]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3978F6]"></span>
                <span className="text-[11px]">Valuations</span>
              </span>
              <span className="flex items-center space-x-1.5 text-[#059669]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
                <span className="text-[11px]">Applications</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3978F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3978F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#0F172A' }}
                />
                <Area type="monotone" dataKey="valuations" stroke="#3978F6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                <Area type="monotone" dataKey="applications" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Chart (1 col) */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Risk Classification Matrix</h3>
            <p className="text-[11px] text-[#475569]">Active underwriting files portfolio risk tiers</p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChartData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis type="category" dataKey="category" stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#0284C7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#475569]">
            Policy Compliance: <strong className="text-[#059669]">84% Low to Moderate Risk</strong> files meeting standard institutional reserve margins.
          </div>
        </div>

      </div>

      {/* Recent Properties & Active Loan Applications Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Assets */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#0F172A]">Recent Property Assets</h3>
            <button
              onClick={() => navigate('/dashboard/properties')}
              className="text-xs text-[#3978F6] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentProperties.length === 0 ? (
              <p className="text-xs text-[#475569] text-center py-6">No properties registered yet.</p>
            ) : (
              recentProperties.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/dashboard/properties`)}
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3978F6]/40 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FFFFFF] overflow-hidden flex-shrink-0">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A] truncate max-w-[200px]">{p.name}</h4>
                      <p className="text-[10px] text-[#475569]">{p.locality}, {p.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#059669]">
                      INR {p.estimated_value ? (p.estimated_value / 10000000).toFixed(2) + ' Cr' : 'Unvalued'}
                    </span>
                    <span className="text-[10px] text-[#475569] block">{p.built_up_area_sqft} sqft</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Loan Applications */}
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#0F172A]">Underwriting Queue</h3>
            <button
              onClick={() => navigate('/dashboard/mortgage')}
              className="text-xs text-[#3978F6] hover:underline"
            >
              View Queue
            </button>
          </div>

          <div className="space-y-3">
            {recentLoans.length === 0 ? (
              <p className="text-xs text-[#475569] text-center py-6">No active loan applications in queue.</p>
            ) : (
              recentLoans.map(l => (
                <div
                  key={l.id}
                  onClick={() => navigate(`/dashboard/mortgage`)}
                  className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#3978F6]/40 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#0F172A]">{l.application_number}</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#D97706]/15 text-[#D97706] text-[9px] font-semibold">
                        {l.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#475569] mt-0.5">{l.applicant_name} | DTI: {l.debt_to_income_ratio}%</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0F172A]">
                      INR {(l.requested_loan_amount / 10000000).toFixed(2)} Cr
                    </span>
                    <span className="text-[10px] text-[#0284C7] block">LTV: {l.loan_to_value_ratio}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardOverview;
