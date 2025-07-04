import AppNavigation from "@/components/AppNavigation";

export default function ChatSimple() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <AppNavigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">AI Chat Assistant</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Chat functionality coming soon...
          </p>
        </div>
        
        <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-lg p-8">
          <div className="text-center">
            <div className="text-blue-400 text-6xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-4">Chat Feature</h2>
            <p className="text-gray-300 text-lg">
              The AI chat assistant will be available here soon. You'll be able to upload files and ask questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}