import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="top-0 flex flex-none items-center bg-primary-foreground p-4 text-secondary shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <h1 className="font-semibold text-xl">
          <Link to="/" className="flex items-center gap-2">
            <span className="bg-linear-to-r from-primary/85 to-primary bg-clip-text font-bold text-3xl text-transparent md:text-4xl">
              קול קורא לאמנות
            </span>
          </Link>
        </h1>
        {/* Placeholder for future simple nav if needed, currently empty as requested */}
        <nav></nav>
      </div>
    </header>
  )
}
