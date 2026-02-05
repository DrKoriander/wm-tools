/**
 * Dashboard-Startseite (/)
 *
 * Zeigt eine Übersicht aller verfügbaren Tools als Kacheln.
 * Neue Tools werden hier als weitere <a>-Kacheln im Grid ergänzt.
 */
export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Tool-Kacheln: Grid-Layout, responsiv (1/2/3 Spalten je nach Bildschirmbreite) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Übersetzer-Tool */}
        <a
          href="/translator"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
        >
          <h2 className="text-lg font-semibold mb-2">Übersetzer</h2>
          <p className="text-sm text-gray-500">
            Texte übersetzen via n8n Workflow
          </p>
        </a>

        {/* Weitere Tools hier ergänzen, z.B.:
        <a href="/atradius" className="block p-6 bg-white rounded-lg border ...">
          <h2>Atradius</h2>
          <p>Kreditprüfung via n8n Workflow</p>
        </a>
        */}

      </div>
    </div>
  );
}
