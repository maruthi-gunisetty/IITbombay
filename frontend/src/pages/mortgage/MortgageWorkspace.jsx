import React, { useState, useEffect } from 'react';
import {
  Landmark, Plus, Search, Filter, CheckCircle2, Clock,
  AlertCircle, ShieldCheck, X, FileText, ChevronRight, UserCheck
} from 'lucide-react';
import { loansAPI, propertiesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MortgageWorkspace = () => {
  const { user, canReviewLoans } = useAuth();
  const [loans, setLoans] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // Application form state
  const [formData, setFormData] = useState({
    applicant_name: user?.full_name || 'Rahul Sharma',
    email: user?.email || 'customer@propwise.ai',
    phone: user?.phone_number || '+91 98200 33000',
    employment_type: 'Salaried',
    employer: 'Tech Innovations Global Pvt Ltd',
    employment_duration_years: 4.5,
    monthly_income: 250000,
    other_income: 20000,
    existing_monthly_emi: 30000,
    existing_debt: 350000,
    credit_score: 780,
    requested_loan_amount: 35000000,
    loan_tenure_years: 20,
    interest_rate_percent: 8.5,
    down_payment: 15000000,
    property_id: null,
    property_market_value: 50000000
  });

  // Human Review Form State
  const [reviewForm, setReviewForm] = useState({
    status: 'Approved',
    reviewer_decision: 'Sanction approved subject to standard title and insurance check',
    officer_notes: 'Borrower exhibits exceptional debt service capacity with verified employment stability and prime CIBIL score.'
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const [lRes, pRes] = await Promise.all([
        loansAPI.list(),
        propertiesAPI.list()
      ]);
      setLoans(lRes.data || []);
      setProperties(pRes.data || []);
      if (pRes.data?.length > 0 && !formData.property_id) {
        setFormData(prev => ({ ...prev, property_id: pRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await loansAPI.apply(formData);
      setModalOpen(false);
      fetchLoans();
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Application failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLoan) return;
    setSubmitting(true);
    try {
      await loansAPI.review(selectedLoan.id, reviewForm);
      setReviewModalOpen(false);
      fetchLoans();
    } catch (err) {
      alert("Review failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Instant front-end financial calculations preview
  const P = formData.requested_loan_amount || 0;
  const r = ((formData.interest_rate_percent || 8.5) / 100) / 12;
  const n = (formData.loan_tenure_years || 20) * 12;
  const previewEMI = P > 0 && r > 0 && n > 0
    ? Math.round(P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1))
    : 0;
  const totalIncome = (formData.monthly_income || 0) + (formData.other_income || 0);
  const previewDTI = totalIncome > 0
    ? (((previewEMI + (formData.existing_monthly_emi || 0)) / totalIncome) * 100).toFixed(1)
    : 0;
  const previewLTV = formData.property_market_value > 0
    ? ((P / formData.property_market_value) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Mortgage Underwriting Engine</h2>
          <p className="text-xs text-[#475569]">
            Automated financial ratio analysis (EMI, DTI, LTV) with human-in-the-loop credit officer decisioning.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-lg shadow-[#3978F6]/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Mortgage Application</span>
        </button>
      </div>

      {/* Human Review Safeguard Notice */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center space-x-3 text-xs text-[#475569]">
        <ShieldCheck className="w-5 h-5 text-[#059669] flex-shrink-0" />
        <span>
          Regulatory Safeguard: Automated debt-to-income and collateral valuations serve strictly as institutional decision support.
          All final loan sanctions enforce certified human credit officer authorization.
        </span>
      </div>

      {/* Applications Table */}
      <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F172A]">Underwriting Dossiers ({loans.length})</span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-[#475569]">Loading underwriting queue...</div>
        ) : loans.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#475569]">No mortgage applications filed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F5F9] text-[#475569] border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Application Reference</th>
                  <th className="py-3 px-4 font-semibold">Borrower Name</th>
                  <th className="py-3 px-4 font-semibold">Requested Loan</th>
                  <th className="py-3 px-4 font-semibold">Monthly EMI</th>
                  <th className="py-3 px-4 font-semibold">DTI %</th>
                  <th className="py-3 px-4 font-semibold">LTV %</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Officer Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {loans.map(l => (
                  <tr key={l.id} className="hover:bg-[#F1F5F9]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0284C7]">{l.application_number}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#0F172A]">{l.applicant_name}</td>
                    <td className="py-3.5 px-4 font-bold text-[#059669]">
                      INR {(l.requested_loan_amount / 10000000).toFixed(2)} Cr
                    </td>
                    <td className="py-3.5 px-4 text-[#0F172A]">
                      INR {l.estimated_monthly_emi?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#0F172A]">{l.debt_to_income_ratio}%</td>
                    <td className="py-3.5 px-4 font-semibold text-[#0F172A]">{l.loan_to_value_ratio}%</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        l.status === 'Approved' ? 'bg-[#059669]/15 text-[#059669] border border-[#059669]/30' :
                        l.status === 'Rejected' ? 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/30' :
                        'bg-[#D97706]/15 text-[#D97706] border border-[#D97706]/30'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canReviewLoans ? (
                        <button
                          onClick={() => {
                            setSelectedLoan(l);
                            setReviewModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#3978F6]/20 hover:bg-[#3978F6] border border-[#3978F6]/40 text-[#0284C7] hover:text-white font-semibold transition-colors"
                        >
                          Adjudicate
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#475569]">In Officer Queue</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Loan Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Submit Mortgage Underwriting File</h3>
                <p className="text-xs text-[#475569]">Financial obligations and collateral information for algorithmic scoring.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[#475569] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 text-xs text-[#DC2626]">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleApply} className="mt-5 space-y-4 text-xs">
              
              {/* Live Calculations Preview Bar */}
              <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#3978F6]/40 grid grid-cols-3 gap-3 text-center">
                <div>
                  <span className="text-[10px] text-[#475569] block">Estimated Monthly EMI</span>
                  <span className="text-sm font-bold text-[#059669]">INR {previewEMI.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#475569] block">Debt-to-Income (DTI)</span>
                  <span className="text-sm font-bold text-[#0284C7]">{previewDTI}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#475569] block">Loan-to-Value (LTV)</span>
                  <span className="text-sm font-bold text-[#D97706]">{previewLTV}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Applicant Name</label>
                  <input
                    type="text"
                    required
                    value={formData.applicant_name}
                    onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Employment Type</label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed Professional">Self-Employed Professional</option>
                    <option value="Business Owner">Business Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Employer / Enterprise</label>
                  <input
                    type="text"
                    value={formData.employer}
                    onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.employment_duration_years}
                    onChange={(e) => setFormData({ ...formData, employment_duration_years: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Monthly Gross (INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.monthly_income}
                    onChange={(e) => setFormData({ ...formData, monthly_income: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Other Income (INR)</label>
                  <input
                    type="number"
                    value={formData.other_income}
                    onChange={(e) => setFormData({ ...formData, other_income: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Existing EMI (INR)</label>
                  <input
                    type="number"
                    value={formData.existing_monthly_emi}
                    onChange={(e) => setFormData({ ...formData, existing_monthly_emi: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Credit Score</label>
                  <input
                    type="number"
                    value={formData.credit_score}
                    onChange={(e) => setFormData({ ...formData, credit_score: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Requested Loan (INR)</label>
                  <input
                    type="number"
                    required
                    value={formData.requested_loan_amount}
                    onChange={(e) => setFormData({ ...formData, requested_loan_amount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Tenure (Years)</label>
                  <input
                    type="number"
                    value={formData.loan_tenure_years}
                    onChange={(e) => setFormData({ ...formData, loan_tenure_years: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.interest_rate_percent}
                    onChange={(e) => setFormData({ ...formData, interest_rate_percent: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
                <div>
                  <label className="block text-[#0F172A] font-semibold mb-1">Property Value (INR)</label>
                  <input
                    type="number"
                    value={formData.property_market_value}
                    onChange={(e) => setFormData({ ...formData, property_market_value: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FFFFFF] text-[#475569] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Assessing Capacity...' : 'Submit Loan Dossier'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Human Review Modal (Bank Officer) */}
      {reviewModalOpen && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Underwriting Adjudication: {selectedLoan.application_number}</h3>
                <p className="text-[11px] text-[#475569]">{selectedLoan.applicant_name} • INR {(selectedLoan.requested_loan_amount / 10000000).toFixed(2)} Cr</p>
              </div>
              <button onClick={() => setReviewModalOpen(false)} className="text-[#475569] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Human Officer Determination</label>
                <select
                  value={reviewForm.status}
                  onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                >
                  <option value="Approved">Approved (Sanctioned)</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Additional Information Required">Additional Information Required</option>
                  <option value="Escalated">Escalated to Credit Committee</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>

              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Decision Summary</label>
                <input
                  type="text"
                  required
                  value={reviewForm.reviewer_decision}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewer_decision: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                />
              </div>

              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Officer Due Diligence Notes</label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.officer_notes}
                  onChange={(e) => setReviewForm({ ...reviewForm, officer_notes: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FFFFFF] text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-[#059669] hover:bg-[#059669]/80 text-[#F8FAFC] font-bold"
                >
                  {submitting ? 'Recording...' : 'Authorize Human Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MortgageWorkspace;
