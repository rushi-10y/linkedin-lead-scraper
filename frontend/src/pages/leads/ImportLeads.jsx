import React, { useState } from 'react';
import { useLeads } from '../../context/LeadContext.jsx';
import Button from '../../components/common/Button.jsx';
import Table from '../../components/common/Table.jsx';
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ImportLeads = () => {
  const { addLead } = useLeads();

  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Only CSV files are supported');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setFile(selectedFile);

    // Simulated CSV parse
    setPreview([
      { name: 'Alice Johnson', email: 'alice@example.com', company: 'TechCorp' },
      { name: 'Bob Smith', email: 'bob@startup.io', company: 'StartupIO' },
      { name: 'Carol Davis', email: 'carol@consulting.com', company: 'Consulting LLC' }
    ]);
  };

  const handleImport = async () => {
    if (!file || importing) return;

    setImporting(true);
    setResults(null);

    setTimeout(() => {
      const successfulLeads = preview.slice(0, -1);

      successfulLeads.forEach((lead) =>
        addLead({ ...lead, source: 'import', status: 'new' })
      );

      setResults({
        total: preview.length,
        successful: successfulLeads.length,
        failed: preview.length - successfulLeads.length,
        errors: [{ row: 3, error: 'Invalid email format' }]
      });

      setImporting(false);
    }, 2000);
  };

  const handleDownloadTemplate = () => {
    const csv =
      'name,email,company\nJohn Doe,john@example.com,Tech Corp\nJane Smith,jane@acme.com,Acme Inc';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Import Leads</h1>

      <div className="max-w-4xl space-y-6">
        {/* Upload */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upload CSV File</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              Drag & drop your CSV file or click to browse
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />

            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
            >
              Choose File
            </label>

            {file && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-sm">{file.name}</span>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="secondary" onClick={handleDownloadTemplate}>
              Download Template
            </Button>

            <Button
              variant="primary"
              onClick={handleImport}
              disabled={!file || importing}
            >
              {importing ? 'Importing...' : 'Import Leads'}
            </Button>
          </div>
        </div>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              Preview ({preview.length} rows)
            </h2>

            <Table
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'company', label: 'Company' }
              ]}
              data={preview}
            />
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Import Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ResultStat icon={CheckCircle} value={results.successful} label="Successful" color="text-green-600" />
              <ResultStat icon={XCircle} value={results.failed} label="Failed" color="text-red-600" />
              <ResultStat icon={FileText} value={results.total} label="Total" color="text-blue-600" />
            </div>

            {results.errors?.length > 0 && (
              <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-1" />
                  <ul className="text-sm text-red-700">
                    {results.errors.map((e, i) => (
                      <li key={i}>Row {e.row}: {e.error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const ResultStat = ({ icon: Icon, value, label, color }) => (
  <div className="text-center">
    <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

export default ImportLeads;
