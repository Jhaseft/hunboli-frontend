import Link from 'next/link';

interface LogoProps {
  width?: number;
  height?: number;
}

export function Logo({ width, height }: LogoProps) {
  return (
    <Link href="/" className="flex justify-center">
      <img
        src="https://res.cloudinary.com/dnbklbswg/image/upload/v1767889917/apple-icon-removebg-preview_cjptux.png"
        alt="Hunboli"
        className={`w-${width || 24} h-${height || 24} object-contain rounded-full`}
      />
    </Link>
  );
}
