import { FaFacebook, FaGithub, FaInstagram } from "react-icons/fa";

export default function FooterComponent() {
  return (
    <footer className="bg-gray-900 text-gray-300 w-full border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Redes Sociales */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold mb-2 text-center">
              Síguenos
            </h3>
            <div className="flex space-x-4 justify-center">
              <a
                href="https://facebook.com/tu-pagina"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
                title="Facebook"
              >
                <FaFacebook width={35} height={35} />
              </a>
              <a
                href="https://instagram.com/tu-cuenta"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition-colors"
                title="Instagram"
              >
                <FaInstagram width={35} height={35} />
              </a>
            </div>
          </div>
        </div>

        {/* Créditos */}
        <div className="border-t border-gray-800 pt-6 text-center md:flex md:items-center md:justify-between">
          <p className="mb-4 md:mb-0">
            Clinic-Cell © {new Date().getFullYear()} - Todos los derechos
            reservados
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span>Desarrollado por</span>
            <a
              href="https://github.com/lukkas98"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center"
              title="Ver código en GitHub"
            >
              <FaGithub width={24} height={24} className="mr-1" />
              Lucas Palma
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
