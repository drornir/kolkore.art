import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center bg-gray-900 p-4 text-white shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <h1 className="font-semibold text-xl">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text font-bold text-2xl text-transparent">
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
