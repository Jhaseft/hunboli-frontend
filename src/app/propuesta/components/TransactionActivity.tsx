import { Search, Filter, Download } from 'lucide-react';

export function TransactionActivity() {
  return (
    <div>
      <h1 className="text-gray-900 text-3xl mb-16">Transaction Activity</h1>

      {/* Two-Factor Authentication Message */}
      <div className="max-w-lg mx-auto text-center py-24">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 border-2 border-teal-500 rounded-lg flex items-center justify-center">
            <svg className="w-16 h-16 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10" />
            </svg>
          </div>
        </div>
        <h2 className="text-gray-900 text-xl mb-4">Two-factor authentication required</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          You can enable Two-Factor authentication on the{' '}
          <a href="#" className="text-teal-500 hover:text-teal-600">
            Security page
          </a>
          .
        </p>
      </div>
    </div>
  );
}