export default function Logo() {
    return (
         <svg width="70" height="70" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#ffd700', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#ffed4e', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#ffb700', stopOpacity: 1}} />
                  </linearGradient>
                  <radialGradient id="radGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" style={{stopColor: '#1a1a2e', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#16213e', stopOpacity: 1}} />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="95" fill="url(#radGrad)" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="url(#grad5)" strokeWidth="4" />
                <text x="100" y="125" fontFamily="Georgia, serif" fontSize="85" fontWeight="bold" fill="url(#grad5)" textAnchor="middle">BH</text>
      </svg>

    );
}