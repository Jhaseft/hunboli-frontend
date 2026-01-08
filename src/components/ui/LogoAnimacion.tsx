import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="relative flex items-center justify-center md:w-28 md:h-28 w-16 h-16 ">
  
      <span className="logoGlow"></span>
 
      <img
        src="https://res.cloudinary.com/dnbklbswg/image/upload/v1767889917/apple-icon-removebg-preview_cjptux.png"
        alt="Hunboli"
        className="relative w-24 h-24 object-contain rounded-full"
      />
    </Link>
  );
}
