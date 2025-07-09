import { generateMetadata } from "@/app/helper/generateMetadata";

export const metadata = generateMetadata(
  "JadenX.AI - System Status",
  "Real-time system status monitoring for JadenX.AI platform"
);


export default async function StatusCard() {
  const res = await fetch('http://localhost:3000/api/status', {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!res.ok) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 text-red-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-semibold text-red-900">Connection Error</h3>
            <p className="text-sm text-red-700">Unable to fetch system status. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const status = await res.json();

  if (!status) { 
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 text-yellow-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-semibold text-yellow-900">No Data Available</h3>
            <p className="text-sm text-yellow-700">System status information is currently unavailable.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!status.services) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 text-orange-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-semibold text-orange-900">Incomplete Data</h3>
            <p className="text-sm text-orange-700">Service status information is incomplete or corrupted.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIndicator = (isActive: boolean) => {
    return isActive ? (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-700 font-medium">Active</span>
      </div>
    ) : (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="text-red-700 font-medium">Inactive</span>
      </div>
    );
  };

  const getOverallStatus = () => {
    const isSystemRunning = status?.status === 'running';
    const servicesActive = status?.services ? Object.values(status.services).filter(Boolean).length : 0;
    const totalServices = status?.services ? Object.keys(status.services).length : 0;
    
    if (isSystemRunning && servicesActive === totalServices) {
      return { status: 'Operational', color: 'green', message: 'All systems are running normally' };
    } else if (isSystemRunning && servicesActive > 0) {
      return { status: 'Partial Outage', color: 'yellow', message: `${servicesActive}/${totalServices} services are operational` };
    } else {
      return { status: 'Major Outage', color: 'red', message: 'System is experiencing issues' };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="bg-white shadow-lg border border-gray-200 overflow-hidden">
      {/* Header with overall status */}
      <div className={`bg-gradient-to-r ${
        overallStatus.color === 'green' ? 'from-green-500 to-green-600' :
        overallStatus.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
        'from-red-500 to-red-600'
      } text-white p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">JadenX.AI Status</h2>
            <p className="text-white/90 text-sm mt-1">{overallStatus.message}</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              overallStatus.color === 'green' ? 'bg-green-600/20 text-green-100' :
              overallStatus.color === 'yellow' ? 'bg-yellow-600/20 text-yellow-100' :
              'bg-red-600/20 text-red-100'
            }`}>
              {overallStatus.status}
            </div>
          </div>
        </div>
      </div>

      {/* Status details */}
      <div className="p-6">
        <div className="grid gap-4">
          {/* System Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              System Core
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Main System</span>
              {getStatusIndicator(status?.status === 'running')}
            </div>
          </div>

          {/* Services Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              External Services
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-xs">CG</span>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">CoinGecko API</span>
                    <p className="text-xs text-gray-500">Cryptocurrency data provider</p>
                  </div>
                </div>
                {getStatusIndicator(status?.services?.coinGecko)}
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">TA</span>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">TAAPI</span>
                    <p className="text-xs text-gray-500">Technical analysis indicators</p>
                  </div>
                </div>
                {getStatusIndicator(status?.services?.taapi)}
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xs">AI</span>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">OpenAI</span>
                    <p className="text-xs text-gray-500">AI processing engine</p>
                  </div>
                </div>
                {getStatusIndicator(status?.services?.openai)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer with timestamp */}
        {status?.timestamp && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Last updated: {new Date(status.timestamp).toLocaleString('vi-VN', {
                timeZone: 'Asia/Ho_Chi_Minh',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <span>Auto-refresh: 60s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}