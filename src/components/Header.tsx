import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-4 flex items-center bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              קול קורא
            </span>
          </Link>
        </h1>
        {/* Placeholder for future simple nav if needed, currently empty as requested */}
        <nav></nav>
      </div>
    </header>
  )
}