import { Coins, Linkedin } from "lucide-react"; // LinkedIn de Lucide
import { SiGithub, SiYoutube, SiFacebook, SiInstagram, SiGmail, SiX } from "@icons-pack/react-simple-icons";

export function FooterSection() {

  const socialIcons = [
    { Icon: SiX, name: 'X', href: 'https://twitter.com' },
    { Icon: SiGithub, name: 'GitHub', href: 'https://github.com' },
    { Icon: Linkedin, name: 'LinkedIn', href: 'https://linkedin.com' }, // ahora LinkedIn de Lucide
    { Icon: SiGmail, name: 'Email', href: 'mailto:info@hunboli.com' },
    { Icon: SiYoutube, name: 'YouTube', href: 'https://youtube.com' },
    { Icon: SiFacebook, name: 'Facebook', href: 'https://facebook.com' },
    { Icon: SiInstagram, name: 'Instagram', href: 'https://instagram.com' },
  ];
  
 const footerLinks = {
    empresa: [
      { name: 'Sobre nosotros', href: '/sobre-nosotros' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contacto', href: '/contacto' },
      { name: 'Carreras', href: '/carreras' },
    ],
    legal: [
      { name: 'Términos de servicio', href: '/terminos' },
      { name: 'Política de privacidad', href: '/privacidad' },
      { name: 'Aviso legal', href: '/aviso-legal' },
    ],
    soporte: [
      { name: 'Centro de ayuda', href: '/ayuda' },
      { name: 'Estado del sistema', href: '/estado' },
      { name: 'Seguridad', href: '/seguridad' },
    ],
  };
  return (
    <footer className="bg-gray-900 border-t border-gray-700 py-16 px-6">
      <div className="max-w-7xl mx-auto">

   
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-white">Hunboli</span>
          </div>
          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Hunboli es una moneda nueva enfocada en confianza, estabilidad y oportunidades para todos.
          </p>

         
          <div className="flex gap-3 flex-wrap mt-2">
            {socialIcons.map(({ Icon, name, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-colors"
                title={name}
              >
                <Icon className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
            ))}
          </div>
        </div>

       
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-6 mb-12">
          <div>
            <h3 className="text-white mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map(({ name, href }) => (
                <li key={name}>
                  <a href={href} className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map(({ name, href }) => (
                <li key={name}>
                  <a href={href} className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Soporte</h3>
            <ul className="space-y-3">
              {footerLinks.soporte.map(({ name, href }) => (
                <li key={name}>
                  <a href={href} className="text-gray-400 hover:text-teal-400 text-sm transition-colors">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

       
        <div className="pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © 2026 Hunboli. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-6 text-sm">
              <a href="/accesibilidad" className="text-gray-500 hover:text-teal-400 transition-colors">
                Accesibilidad
              </a>
              <a href="/mapa-del-sitio" className="text-gray-500 hover:text-teal-400 transition-colors">
                Mapa del sitio
              </a>
              <a href="/configuracion-cookies" className="text-gray-500 hover:text-teal-400 transition-colors">
                Configuración de cookies
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
