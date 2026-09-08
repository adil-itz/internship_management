import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, AlertCircle } from 'lucide-react';
import { downloadCSV, downloadPDF } from '../../services/report.service';

export default function ReportDownload({ currentFilters = {} }) {
  const [reportType, setReportType] = useState('companies');
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const reportOptions = [
    { value: 'companies', label: 'Company Analytics' },
    { value: 'mentors', label: 'Mentor Analytics' },
    { value: 'students', label: 'Student Analytics' },
  ];

  const handleDownloadCSV = async () => {
    setErrorMsg('');
    setDownloadingCSV(true);
    try {
      await downloadCSV({
        reportType,
        ...currentFilters
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to download CSV report.');
    } finally {
      setDownloadingCSV(false);
    }
  };

  const handleDownloadPDF = async () => {
    setErrorMsg('');
    setDownloadingPDF(true);
    try {
      await downloadPDF({
        reportType,
        ...currentFilters
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to download PDF report.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Download size={18} className="text-blue-500" />
            <span>Download Reports</span>
          </h3>
          <p className="text-[11px] text-slate-400">Export report data in CSV or PDF file format</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 mb-1">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {reportOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleDownloadCSV}
          disabled={downloadingCSV}
          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <FileSpreadsheet size={16} />
          <span>{downloadingCSV ? 'Generating CSV...' : 'Download CSV'}</span>
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={downloadingPDF}
          className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <FileText size={16} />
          <span>{downloadingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
        </button>
      </div>
    </div>
  );
}
