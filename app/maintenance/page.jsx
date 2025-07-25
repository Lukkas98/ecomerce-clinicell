export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-100">
      <div className="space-y-6 p-8 max-w-lg text-center">
        {/* Emoji como reemplazo del ícono */}
        <div className="text-6xl animate-pulse">🔧</div>

        <h1 className="text-5xl font-extrabold">¡Tienda en mantenimiento!</h1>
        <p className="text-lg">
          Lo sentimos, estamos trabajando para mejorar tu experiencia.
        </p>
        <p>Vuelve pronto y gracias por tu paciencia.</p>
      </div>
    </main>
  );
}
