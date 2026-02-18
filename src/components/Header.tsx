import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

const navItems = [
  { href: "/", label: "Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-slate-900">
          <Image src="/toolnest-logo.svg" alt="ToolNest logo" width={28} height={28} />
          ToolNest
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <SearchBar />
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-0.5 sm:gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
