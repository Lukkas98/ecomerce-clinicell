import { FaFacebook, FaGithub, FaInstagram } from "react-icons/fa";

export default function FooterComponent() {
  return (
    <footer className="w-full border-t border-gray-700 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 grid grid-cols-1 gap-8">
          {/* Redes Sociales */}
          <div className="space-y-3">
            <h3 className="mb-2 text-center font-semibold text-white">
              Síguenos
            </h3>
            <div className="flex justify-center space-x-4">
              <a
                href="https://www.facebook.com/colo.blanca.jesi"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-blue-400"
                title="Facebook"
              >
                <FaFacebook width={35} height={35} />
              </a>
              <a
                href="https://www.instagram.com/clinic.cell.colo?igsh=MXJmbmJlOXRzb2hsNg=="
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-pink-400"
                title="Instagram"
              >
                <FaInstagram width={35} height={35} />
              </a>
            </div>
          </div>
        </div>

        {/* Créditos */}
        <div className="border-t border-gray-800 px-5 pt-6 text-center md:flex md:items-center md:justify-between">
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
              className="flex items-center text-blue-400 hover:text-blue-300"
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
