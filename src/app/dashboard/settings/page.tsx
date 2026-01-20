import { redirect } from 'next/navigation';

export default function SettingsPage() {
  // En cuanto entran aquí, los empujamos a la primera opción
  redirect('/dashboard/settings/profile');
}