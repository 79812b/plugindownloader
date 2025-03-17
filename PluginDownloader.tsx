import React, { useState } from 'react';

const PluginDownloader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [plugins, setPlugins] = useState<any[]>([]);
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setStatus('Searching...');
    setError('');
    try {
      const response = await fetch(`/api/plugins/search?query=${searchQuery}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setPlugins(data.plugins);
      }
    } catch (err) {
      setError('Failed to fetch plugins. Please try again.');
    }
    setStatus('');
  };

  const handlePluginSelect = async (pluginId: number) => {
    setStatus('Fetching versions...');
    setError('');
    try {
      const response = await fetch(`/api/plugins/versions?id=${pluginId}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSelectedPlugin(plugins.find((p) => p.id === pluginId));
        setVersions(data.versions);
      }
    } catch (err) {
      setError('Failed to fetch versions. Please try again.');
    }
    setStatus('');
  };

  const handleDownload = async () => {
    if (!selectedVersion) {
      setError('Please select a version.');
      return;
    }
    setStatus('Downloading...');
    setError('');
    try {
      const response = await fetch(`/api/plugins/download?id=${selectedVersion.id}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setStatus('Plugin downloaded successfully!');
      }
    } catch (err) {
      setError('Failed to download plugin. Please try again.');
    }
    setStatus('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Plugin Downloader</h2>
        {!selectedPlugin ? (
          <>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search plugins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleSearch}
                className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
              >
                Search
              </button>
            </div>
            {status && <p className="text-blue-500">{status}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="max-h-64 overflow-y-auto">
              {plugins.map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <span>{plugin.name}</span>
                  <button
                    onClick={() => handlePluginSelect(plugin.id)}
                    className="bg-green-500 text-white p-1 rounded"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-bold">{selectedPlugin.name}</h3>
              <select
                value={selectedVersion?.id || ''}
                onChange={(e) =>
                  setSelectedVersion(
                    versions.find((v) => v.id === parseInt(e.target.value))
                  )
                }
                className="w-full p-2 border border-gray-300 rounded mt-2"
              >
                <option value="">Select a version</option>
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.name}
                  </option>
                ))}
              </select>
            </div>
            {status && <p className="text-blue-500">{status}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedPlugin(null)}
                className="bg-gray-500 text-white p-2 rounded mr-2"
              >
                Back
              </button>
              <button
                onClick={handleDownload}
                className="bg-green-500 text-white p-2 rounded mr-2"
              >
                Download
              </button>
              <button
                onClick={() => setSelectedPlugin(null)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PluginDownloader;
