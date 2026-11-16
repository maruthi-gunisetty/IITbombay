import React, { useState, useEffect } from 'react';
import {
  FileCheck2, Download, Search, Filter, Plus, FileText,
  CheckCircle2, Clock, Eye, X, ShieldCheck
} from 'lucide-react';
import { reportsAPI } from '../../services/api';

const ReportsWorkspace = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');

  // Generate Report Form
  const [formData, setFormData] = useState({
    report_type: 'Property Valuation Report',
    title: 'Institutional Collateral Appraisal Dossier',
    reference_id: 'COLL-2026-904',
    summary: 'Comprehensive multi-factor automated property appraisal factoring spatial density, construction quality multipliers, and localized regression parameters.',
    details: {
      Locality: 'Worli, Mumbai',
      Appraised_Valuation: 'INR 21,50,00,000',
      Built_up_Area: '4,100 sqft',
      Unit_Rate_per_sqft: 'INR 52,439',
      Confidence_Score: '94.2%',
      Underwriting_Clearance: 'Recommended for Bank Officer Sign-off'
    }
  });
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await reportsAPI.list({ report_type: typeFilter || undefined });
      setReports(res.data || []);
      if (res.data?.length > 0 && !selectedReport) {
        setSelectedReport(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [typeFilter]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await reportsAPI.generate(formData);
      setModalOpen(false);
      fetchReports();
    } catch (err) {
      alert("Generation failed: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (id) => {
    window.open(reportsAPI.getDownloadUrl(id), '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#F5F7FC] tracking-tight">Institutional Reports & Dossiers</h2>
          <p className="text-xs text-[#98A7BD]">
            Generate, preview, and download cryptographically stamped PDF dossiers for audit and credit committee submission.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-lg shadow-[#3978F6]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Dossier</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4 flex items-center justify-between">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#0D1628] border border-[#23324A] rounded-lg px-3 py-1.5 text-xs text-[#F5F7FC]"
        >
          <option value="">All Report Categories</option>
          <option value="Property Valuation Report">Property Valuation Report</option>
          <option value="Mortgage Underwriting Dossier">Mortgage Underwriting Dossier</option>
          <option value="Unified Risk Report">Unified Risk Report</option>
          <option value="Fraud Audit Report">Fraud Audit Report</option>
          <option value="Market Analytics Dossier">Market Analytics Dossier</option>
        </select>
        <span className="text-xs text-[#98A7BD]">{reports.length} Dossiers in Registry</span>
      </div>

      {/* Reports Table */}
      <div className="bg-[#111D32] border border-[#23324A] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="text-center py-12 text-xs text-[#98A7BD]">Loading reports registry...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#98A7BD]">No dossiers generated yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D1628] text-[#98A7BD] border-b border-[#23324A]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Report Reference</th>
                  <th className="py-3 px-4 font-semibold">Dossier Title</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Officer / Author</th>
                  <th className="py-3 px-4 font-semibold">Date Stamped</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23324A]">
                {reports.map(r => (
                  <tr key={r.id} className="hover:bg-[#0D1628]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#29C5E8]">{r.report_number}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#F5F7FC]">{r.title}</td>
                    <td className="py-3.5 px-4 text-[#98A7BD]">{r.report_type}</td>
                    <td className="py-3.5 px-4 text-[#F5F7FC]">{r.generated_by}</td>
                    <td className="py-3.5 px-4 text-[#98A7BD]">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReport(r);
                          setPreviewModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-[#111D32] border border-[#23324A] text-[#29C5E8] hover:text-white transition-colors"
                        title="Preview Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownload(r.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#20C997]/15 hover:bg-[#20C997] border border-[#20C997]/30 text-[#20C997] hover:text-[#080E1B] font-bold text-[11px] inline-flex items-center space-x-1 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Dossier Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D1628] border border-[#23324A] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#23324A]">
              <h3 className="text-sm font-bold text-[#F5F7FC]">Generate Institutional PDF Dossier</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#98A7BD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3.5">
              <div>
                <label className="block text-[#F5F7FC] font-semibold mb-1">Dossier Category</label>
                <select
                  value={formData.report_type}
                  onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                  className="w-full bg-[#111D32] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC]"
                >
                  <option value="Property Valuation Report">Property Valuation Report</option>
                  <option value="Mortgage Underwriting Dossier">Mortgage Underwriting Dossier</option>
                  <option value="Unified Risk Intelligence Report">Unified Risk Intelligence Report</option>
                  <option value="Fraud Audit Report">Fraud Audit Report</option>
                  <option value="Market Analytics Dossier">Market Analytics Dossier</option>
                </select>
              </div>

              <div>
                <label className="block text-[#F5F7FC] font-semibold mb-1">Dossier Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#111D32] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC]"
                />
              </div>

              <div>
                <label className="block text-[#F5F7FC] font-semibold mb-1">Reference ID</label>
                <input
                  type="text"
                  required
                  value={formData.reference_id}
                  onChange={(e) => setFormData({ ...formData, reference_id: e.target.value })}
                  className="w-full bg-[#111D32] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC]"
                />
              </div>

              <div>
                <label className="block text-[#F5F7FC] font-semibold mb-1">Executive Summary</label>
                <textarea
                  rows={3}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-[#111D32] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC]"
                />
              </div>

              <div className="pt-3 border-t border-[#23324A] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#111D32] text-[#98A7BD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-6 py-2 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold disabled:opacity-50"
                >
                  {generating ? 'Compiling PDF...' : 'Generate & Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D1628] border border-[#23324A] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#23324A]">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FC]">{selectedReport.title}</h3>
                <span className="font-mono text-[10px] text-[#29C5E8]">{selectedReport.report_number}</span>
              </div>
              <button onClick={() => setPreviewModalOpen(false)} className="text-[#98A7BD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#111D32] rounded-xl border border-[#23324A] space-y-1">
              <span className="text-[#98A7BD] block">Executive Summary:</span>
              <p className="text-[#F5F7FC] leading-relaxed">{selectedReport.summary}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[#F5F7FC] font-bold block">Assessment Metrics:</span>
              <div className="bg-[#080E1B] border border-[#23324A] rounded-xl divide-y divide-[#23324A] p-2">
                {Object.entries(selectedReport.details || {}).map(([k, v], i) => (
                  <div key={i} className="py-1.5 px-2 flex justify-between">
                    <span className="text-[#98A7BD] capitalize">{k.replace(/_/g, ' ')}:</span>
                    <span className="font-semibold text-[#F5F7FC]">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#23324A] flex justify-between items-center">
              <span className="text-[10px] text-[#98A7BD]">Generated by {selectedReport.generated_by}</span>
              <button
                onClick={() => handleDownload(selectedReport.id)}
                className="px-4 py-2 rounded-xl bg-[#20C997] hover:bg-[#20C997]/80 text-[#080E1B] font-bold text-xs flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Certified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportsWorkspace;
