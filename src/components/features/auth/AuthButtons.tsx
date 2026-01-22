import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function AuthButtons() {
  return (
    <>
      <div className="relative">
        <span className="buttonGlow"></span>
        <Link
          href={ROUTES.LOGIN}
          className="relative text-gray-300 hover:text-teal-400 transition-colors px-4 py-2 rounded-md"
        >
          Iniciar sesión
        </Link>
      </div>

      <div className="relative">
        <span className="buttonGlow"></span>
        <Link
          href={ROUTES.SIGN_UP}
          className="relative px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-full transition-colors"
        >
          Registrarse
        </Link>
      </div>
    </>
  );
}
