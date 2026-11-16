import React, { useState, useEffect } from 'react';
import {
  Scale, ShieldCheck, CheckCircle2, FileText, Lock,
  AlertCircle, History, UserCheck
} from 'lucide-react';
import { complianceAPI } from '../../services/api';

const ComplianceCenter = () => {
  const [consents, setConsents] = useState([]);
  const [governance, setGovernance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, gRes] = await Promise.all([
          complianceAPI.listConsents(),
          complianceAPI.getGovernance()
        ]);
        setConsents(cRes.data || []);
        setGovernance(gRes.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#F5F7FC] tracking-tight">Compliance & Responsible AI Governance</h2>
        <p className="text-xs text-[#98A7BD]">
          Digital lending compliance policies, user consent tracking, and ethical algorithmic guardrails.
        </p>
      </div>

      {/* Governance Charter Box */}
      <div className="bg-[#111D32] border border-[#23324A] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#23324A]">
          <Scale className="w-5 h-5 text-[#20C997]" />
          <h3 className="text-sm font-bold text-[#F5F7FC]">
            {governance?.framework_version || 'PropWise Responsible AI Charter v2.4 (2026)'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-[#080E1B] rounded-xl border border-[#23324A] space-y-2">
            <span className="font-bold text-[#20C997] block">Non-Delegable Human Lending Mandate</span>
            <p className="text-[#98A7BD] leading-relaxed">
              {governance?.human_in_the_loop_mandate || 'All underwriting decisions and mortgage sanctions require explicit human officer verification.'}
            </p>
          </div>

          <div className="p-4 bg-[#080E1B] rounded-xl border border-[#23324A] space-y-2">
            <span className="font-bold text-[#3978F6] block">Protected Attributes Exclusion</span>
            <p className="text-[#98A7BD] leading-relaxed">
              {governance?.protected_characteristics_policy || 'Strict exclusion of protected attributes from all predictive valuation and credit models.'}
            </p>
          </div>

          <div className="p-4 bg-[#080E1B] rounded-xl border border-[#23324A] space-y-2">
            <span className="font-bold text-[#29C5E8] block">Statutory Banking Data Retention</span>
            <p className="text-[#98A7BD] leading-relaxed">
              Enforced data retention window: 1,825 days (5 years) pursuant to financial recordkeeping mandates.
            </p>
          </div>

          <div className="p-4 bg-[#080E1B] rounded-xl border border-[#23324A] space-y-2">
            <span className="font-bold text-[#F5B942] block">Institutional Grievance Contact</span>
            <p className="text-[#98A7BD] leading-relaxed">
              Official Grievance Officer: <strong className="text-[#F5F7FC]">compliance@propwise.ai</strong>. Inquiries addressed within 48 business hours.
            </p>
          </div>
        </div>
      </div>

      {/* User Consent Registry */}
      <div className="bg-[#111D32] border border-[#23324A] rounded-2xl overflow-hidden shadow-xl p-5 space-y-4">
        <div className="pb-3 border-b border-[#23324A]">
          <h3 className="text-xs font-bold text-[#F5F7FC] uppercase tracking-wider">
            Active Digital Consent Records ({consents.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0D1628] text-[#98A7BD] border-b border-[#23324A]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Consent Category</th>
                <th className="py-2.5 px-3 font-semibold">Version Stamped</th>
                <th className="py-2.5 px-3 font-semibold">Authorization Date</th>
                <th className="py-2.5 px-3 font-semibold text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23324A]">
              {consents.map(c => (
                <tr key={c.id} className="hover:bg-[#0D1628]/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#F5F7FC]">{c.consent_type}</td>
                  <td className="py-3 px-3 font-mono text-[#29C5E8]">{c.consent_version}</td>
                  <td className="py-3 px-3 text-[#98A7BD]">{new Date(c.granted_at).toLocaleDateString()}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#20C997]/15 text-[#20C997] border border-[#20C997]/30">
                      Consented & Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ComplianceCenter;
