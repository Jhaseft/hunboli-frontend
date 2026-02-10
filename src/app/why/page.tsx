'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';

const VALUE_PROPS = [
  {
    title: 'Estabilidad 1:1',
    body: 'Cada Hunboli esta respaldado por activos liquidos equivalentes.',
  },
  {
    title: 'Transparencia verificable',
    body: 'Reportes periodicos, metricas claras y trazabilidad en todo el ciclo.',
  },
  {
    title: 'Usabilidad real',
    body: 'Disenada para pagos, ahorro y operaciones empresariales.',
  },
];

const BENEFITS = [
  {
    title: 'Para usuarios',
    body: 'Proteccion frente a volatilidad, acceso rapido y costos claros.',
  },
  {
    title: 'Para empresas',
    body: 'Liquidacion simple, integracion rapida y control operativo.',
  },
  {
    title: 'Para partners',
    body: 'Un ecosistema listo para integraciones y crecimiento sostenido.',
  },
];

const USE_CASES = [
  'Pagos transfronterizos',
  'Cobros y nomina',
  'Ahorro digital',
  'Tesoreria corporativa',
];

const TRUST_STEPS = [
  'Reserva 1:1 con activos liquidos.',
  'Reportes periodicos y verificables.',
  'Redenciones simples para usuarios y empresas.',
];

export default function WhyHunboliPage() {
  const { user, token, isLoading } = useAuth();
  const isAuthenticated = !isLoading && !!token && !!user;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-teal-400 text-sm uppercase tracking-[0.2em]">
            Por que Hunboli
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold text-white">
            Una stablecoin pensada para confianza, transparencia y uso real
          </h1>
          <p className="mt-4 text-gray-300 text-lg max-w-2xl">
            Hunboli combina respaldo 1:1, procesos claros y una experiencia
            simple para personas y empresas. La meta es mover valor con
            estabilidad, sin fricciones y con visibilidad total.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={ROUTES.HOW_IT_WORKS}
              className="px-6 py-3 rounded-lg bg-teal-500 text-gray-950 font-medium hover:bg-teal-400 transition-colors"
            >
              Como funciona
            </Link>
            <Link
              href={ROUTES.TRANSPARENCY}
              className="px-6 py-3 rounded-lg border border-gray-700 text-gray-200 hover:border-gray-500 transition-colors"
            >
              Transparencia
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
          {VALUE_PROPS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6"
            >
              <h3 className="text-white text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
          {BENEFITS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-800 bg-gray-950/60 p-6"
            >
              <h3 className="text-white text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-400">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-white text-lg font-semibold">
              Confianza y seguridad
            </h3>
            <p className="mt-2 text-gray-400">
              Define el marco de respaldo, custodia y cumplimiento. Este bloque
              es el lugar ideal para detallar como se protege el valor y la
              operacion diaria.
            </p>
            <div className="mt-4 space-y-3">
              {TRUST_STEPS.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-950/40 p-4"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-400" />
                  <p className="text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-white text-lg font-semibold">Casos de uso</h3>
            <p className="mt-2 text-gray-400">
              Muestra escenarios concretos para personas y empresas.
            </p>
            <div className="mt-4 grid gap-3">
              {USE_CASES.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-gray-800 bg-gray-950/40 px-4 py-3 text-gray-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                Hunboli es la base estable para mover valor sin fricciones
              </h2>
              <p className="mt-3 text-gray-300">
                Puedes adaptar este cierre con el mensaje principal del
                proyecto, incluyendo un llamado claro a crear cuenta o empezar.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              {!isAuthenticated && (
                <Link
                  href={ROUTES.SIGN_UP}
                  className="px-6 py-3 rounded-lg bg-teal-500 text-gray-950 font-medium hover:bg-teal-400 transition-colors"
                >
                  Crear cuenta
                </Link>
              )}
              <Link
                href={ROUTES.DASHBOARD}
                className="px-6 py-3 rounded-lg border border-gray-700 text-gray-200 hover:border-gray-500 transition-colors"
              >
                Ir al dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
