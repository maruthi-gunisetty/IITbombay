import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, ShieldAlert, CheckCircle2, Search, Filter,
  Eye, Edit3, X, UserCheck, ShieldCheck, Clock
} from 'lucide-react';
import { fraudAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FraudDetectionWorkspace = () => {
  const { user, canReviewLoans } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  // Investigation form state
  const [investigationStatus, setInvestigationStatus] = useState('Under Investigation');
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAlertsAndStats = async () => {
    setLoading(true);
    try {
      const [alertsRes, statsRes] = await Promise.all([
        fraudAPI.listAlerts({
          status: statusFilter || undefined,
          severity: severityFilter || undefined
        }),
        fraudAPI.getStats()
      ]);
      setAlerts(alertsRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsAndStats();
  }, [statusFilter, severityFilter]);

  const handleOpenInvestigation = (alert) => {
    setSelectedAlert(alert);
    setInvestigationStatus(alert.status || 'Under Investigation');
    setInvestigationNotes(alert.investigation_notes || '');
    setModalOpen(true);
  };

  const handleUpdateAlert = async (e) => {
    e.preventDefault();
    if (!selectedAlert) return;
    setSubmitting(true);
    try {
      await fraudAPI.updateAlert(selectedAlert.id, {
        status: investigationStatus,
        investigation_notes: investigationNotes
      });
      setModalOpen(false);
      fetchAlertsAndStats();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return 'bg-[#EF5B67]/15 text-[#EF5B67] border-[#EF5B67]/40';
      case 'High':
        return 'bg-[#F5B942]/15 text-[#F5B942] border-[#F5B942]/40';
      case 'Medium':
        return 'bg-[#3978F6]/15 text-[#3978F6] border-[#3978F6]/40';
      default:
        return 'bg-[#20C997]/15 text-[#20C997] border-[#20C997]/40';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#F5F7FC] tracking-tight">Fraud & Anomaly Intelligence Studio</h2>
        <p className="text-xs text-[#98A7BD]">
          Continuous screening for valuation spikes, dimensional inconsistencies, excessive leverage, and duplicate asset filings.
        </p>
      </div>

      {/* Institutional Notice */}
      <div className="p-4 rounded-xl bg-[#111D32] border border-[#23324A] flex items-center space-x-3 text-xs text-[#98A7BD]">
        <ShieldCheck className="w-5 h-5 text-[#20C997] flex-shrink-0" />
        <span>
          Investigation Guideline: Statistical outliers and automated flags represent risk indicators requiring due diligence.
          An anomaly does not constitute legal proof of fraudulent intent.
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4">
          <span className="text-xs text-[#98A7BD] font-medium block">Total Flags Recorded</span>
          <div className="text-2xl font-black text-[#F5F7FC] mt-1">{stats?.total_alerts || 0}</div>
        </div>
        <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4">
          <span className="text-xs text-[#98A7BD] font-medium block">High Priority Outliers</span>
          <div className="text-2xl font-black text-[#EF5B67] mt-1">{stats?.high_priority_alerts || 0}</div>
        </div>
        <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4">
          <span className="text-xs text-[#98A7BD] font-medium block">Under Investigation</span>
          <div className="text-2xl font-black text-[#F5B942] mt-1">{stats?.under_investigation || 0}</div>
        </div>
        <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4">
          <span className="text-xs text-[#98A7BD] font-medium block">Adjudicated & Resolved</span>
          <div className="text-2xl font-black text-[#20C997] mt-1">{stats?.resolved_alerts || 0}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4 flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#0D1628] border border-[#23324A] rounded-lg px-3 py-1.5 text-xs text-[#F5F7FC]"
        >
          <option value="">All Review Statuses</option>
          <option value="Open">Open</option>
          <option value="Under Investigation">Under Investigation</option>
          <option value="Escalated">Escalated</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-[#0D1628] border border-[#23324A] rounded-lg px-3 py-1.5 text-xs text-[#F5F7FC]"
        >
          <option value="">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Alerts Table */}
      <div className="bg-[#111D32] border border-[#23324A] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="text-center py-12 text-xs text-[#98A7BD]">Scanning anomaly flags...</div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#98A7BD]">No fraud flags or statistical anomalies detected.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D1628] text-[#98A7BD] border-b border-[#23324A]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Alert Reference</th>
                  <th className="py-3 px-4 font-semibold">Anomaly Category</th>
                  <th className="py-3 px-4 font-semibold">Severity</th>
                  <th className="py-3 px-4 font-semibold">Detection Methodology</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Investigation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23324A]">
                {alerts.map(a => (
                  <tr key={a.id} className="hover:bg-[#0D1628]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#29C5E8]">{a.alert_code}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#F5F7FC]">{a.alert_type}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(a.severity)}`}>
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#98A7BD] max-w-xs truncate">{a.detection_method}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-[#F5F7FC]">{a.status}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenInvestigation(a)}
                        className="px-3 py-1.5 rounded-lg bg-[#3978F6]/20 hover:bg-[#3978F6] border border-[#3978F6]/40 text-[#29C5E8] hover:text-white font-semibold transition-colors"
                      >
                        Investigate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Investigation Modal */}
      {modalOpen && selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D1628] border border-[#23324A] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#23324A]">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FC]">Investigation: {selectedAlert.alert_code}</h3>
                <p className="text-[11px] text-[#98A7BD]">{selectedAlert.alert_type}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[#98A7BD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#111D32] border border-[#23324A] space-y-1.5">
              <span className="text-[#F5F7FC] font-bold block">Flag Reason & Statistical Detail:</span>
              <p className="text-[#98A7BD] leading-relaxed">{selectedAlert.reason}</p>
            </div>

            <form onSubmit={handleUpdateAlert} className="space-y-3.5">
              <div>
                <label className="block text-[#F5F7FC] font-semibold mb-1">Investigation Review Status</label>
                <select
                  value={investigationStatus}
                  onChange={(e) => setInvestigationStatus(e.target.value)}
                  className="w-full bg-[#111D32] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC]"
                >
                  <option value="Under Investigation">Under Active Investigation</option>
                  <option value="Escalated">Escalated to Forensic Due Diligence</option>
                  <option value="Resolved">Resolved / Cleared as False Positive</option>
                  <option value="Open">Open</option>
                </select>
              </div>

              <div>
                <label className="block text-[#F5F7FC] font-semibold mb-1">Investigator Analysis Notes</label>
                <textarea
                  rows={3}
                  required
                  value={investigationNotes}
                  onChange={(e) => setInvestigationNotes(e.target.value)}
                  placeholder="Record verification deeds, registry verification, or explanation"
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
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Save Investigation Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FraudDetectionWorkspace;
