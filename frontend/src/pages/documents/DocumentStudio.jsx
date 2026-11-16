import React, { useState, useEffect } from 'react';
import {
  FileText, UploadCloud, Trash2, CheckCircle2, AlertTriangle,
  FileCheck2, Search, ExternalLink, ShieldCheck, Eye, X
} from 'lucide-react';
import { documentsAPI } from '../../services/api';

const DocumentStudio = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [docType, setDocType] = useState('Income Proof');
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await documentsAPI.list();
      setDocuments(res.data || []);
      if (res.data?.length > 0 && !selectedDoc) {
        setSelectedDoc(res.data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!fileToUpload) {
      alert("Please choose a file to upload.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', fileToUpload);
      form.append('document_type', docType);
      await documentsAPI.upload(form);
      setModalOpen(false);
      setFileToUpload(null);
      fetchDocs();
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Confirm deletion of this ingested document record?")) return;
    try {
      await documentsAPI.delete(id);
      fetchDocs();
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
    } catch (err) {
      alert("Deletion failed: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Document Intelligence & OCR</h2>
          <p className="text-xs text-[#475569]">
            Automated text extraction, entity parsing, and cross-consistency validation for lending dossiers.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-lg shadow-[#3978F6]/20"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Ingest New Document</span>
        </button>
      </div>

      {/* Institutional Notice */}
      <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center space-x-3 text-xs text-[#475569]">
        <ShieldCheck className="w-5 h-5 text-[#059669] flex-shrink-0" />
        <span>
          Verification Disclosure: Automated OCR extraction flags textual parameters and anomalies.
          It does not substitute formal legal conveyance title verification or forensic document authentication.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Document Ingestion List (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Ingested Documents ({documents.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-10 text-xs text-[#475569]">Loading records...</div>
            ) : documents.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#475569]">No documents uploaded.</div>
            ) : (
              documents.map(d => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDoc(d)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedDoc?.id === d.id
                      ? 'bg-[#F1F5F9] border-[#3978F6]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#3978F6]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2.5 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-center text-[#0284C7] flex-shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-[#0F172A] truncate">{d.file_name}</h4>
                        <span className="text-[10px] text-[#475569] block">{d.document_type} • {d.file_size_kb} KB</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(d.id, e)}
                      className="p-1 text-[#475569] hover:text-[#DC2626] transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#E2E8F0]/40 text-[10px]">
                    <span className="text-[#059669] font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{d.ocr_status}</span>
                    </span>
                    <span className="text-[#475569]">{new Date(d.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Extraction Inspection Panel (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-xl space-y-5">
          {!selectedDoc ? (
            <div className="text-center py-20 text-xs text-[#475569]">
              Select an ingested document on the left to inspect extracted OCR text and key-value fields.
            </div>
          ) : (
            <>
              {/* Document Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{selectedDoc.file_name}</h3>
                  <p className="text-xs text-[#475569]">{selectedDoc.document_type} • Status: {selectedDoc.verification_status}</p>
                </div>
                <button
                  onClick={() => setPreviewModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#0284C7] flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Raw OCR</span>
                </button>
              </div>

              {/* Extracted Fields Table */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#0F172A] block">Parsed Key-Value Entities</span>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden divide-y divide-[#E2E8F0] text-xs">
                  {Object.entries(selectedDoc.extracted_fields || {}).map(([key, val], idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center">
                      <span className="text-[#475569] capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-semibold text-[#0F172A] text-right">{String(val)}</span>
                    </div>
                  ))}
                  {Object.keys(selectedDoc.extracted_fields || {}).length === 0 && (
                    <div className="p-4 text-center text-[#475569]">No key-value pairs identified.</div>
                  )}
                </div>
              </div>

              {/* Validation & Discrepancy Flags */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0F172A] block">Automated Cross-Validation Checks</span>
                {(selectedDoc.validation_flags || []).length === 0 ? (
                  <div className="p-3 rounded-xl bg-[#059669]/10 border border-[#059669]/30 text-xs text-[#059669] flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>No data discrepancies or name inconsistencies detected.</span>
                  </div>
                ) : (
                  (selectedDoc.validation_flags || []).map((flag, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#D97706]/10 border border-[#D97706]/30 text-xs text-[#D97706] flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))
                )}
              </div>

            </>
          )}
        </div>

      </div>

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#0F172A]">Ingest Supporting Document</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#475569] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Document Category</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A]"
                >
                  <option value="Income Proof">Income Proof / Salary Slip</option>
                  <option value="Bank Statement">Bank Statement</option>
                  <option value="Identity Proof">Identity Proof (Aadhaar / PAN)</option>
                  <option value="Property Document">Property Title Deed</option>
                  <option value="Tax Document">Tax Assessment ITR-V</option>
                </select>
              </div>

              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Select File (PDF, PNG, JPG)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setFileToUpload(e.target.files[0])}
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-2 text-[#475569]"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FFFFFF] text-[#475569]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold disabled:opacity-50"
                >
                  {uploading ? 'Processing OCR...' : 'Upload & Extract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Raw OCR Text Modal */}
      {previewModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#0F172A]">Raw Optical Character Recognition (OCR) Stream</h3>
              <button onClick={() => setPreviewModalOpen(false)} className="text-[#475569] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <pre className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs font-mono text-[#0F172A] max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {selectedDoc.extracted_text || 'No textual content extracted.'}
            </pre>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#3978F6] text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DocumentStudio;
