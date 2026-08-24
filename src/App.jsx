import Aurora from "@/components/Aurora";
import SplitText from "@/components/SplitText";
import TextType from "@/components/TextType";
import SpotlightCard from "@/components/SpotlightCard";
import AnimatedContent from "@/components/AnimatedContent";
import Icon from "@/components/Icon";
import { profile, links, socials } from "@/data/profile";

function LinkCard({ link, index }) {
  return (
    <AnimatedContent
      distance={60}
      duration={0.8}
      delay={0.08 * index}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
    >
      <SpotlightCard
        className="group block w-full rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md transition-colors duration-300 hover:border-white/20"
        spotlightColor="rgba(34, 211, 238, 0.18)"
      >
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-5 py-4 sm:px-6 sm:py-5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 text-cyan-300 transition-transform duration-300 group-hover:scale-110">
            <Icon name={link.icon} className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-white">
              {link.label}
              {link.featured && (
                <span className="ml-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wider text-cyan-300">
                  featured
                </span>
              )}
            </span>
            <span className="block truncate text-sm text-zinc-400">
              {link.description}
            </span>
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0 text-zinc-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-300"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </SpotlightCard>
    </AnimatedContent>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-70">
        <Aurora colorStops={["#22d3ee", "#a78bfa", "#f472b6"]} amplitude={1.1} blend={0.6} />
      </div>
      {/* Vignette for readability */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,7,18,0.75)_75%)]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-14 sm:py-20">
        {/* Hero */}
        <header className="flex flex-col items-center text-center">
          <AnimatedContent duration={0.7} initialOpacity={0} animateOpacity scale={0.9}>
            <div className="relative mb-6">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-400 to-pink-400 opacity-60 blur-md" />
              <img
                src={profile.avatar}
                alt={profile.name}
                className="relative h-24 w-24 rounded-full border-2 border-white/20 object-cover"
              />
            </div>
          </AnimatedContent>

          <p className="mb-1 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300/80">
            {profile.role}
          </p>

          <SplitText
            text={profile.name}
            tag="h1"
            delay={60}
            duration={0.9}
            splitType="chars"
            className="text-5xl font-bold tracking-tight text-white sm:text-6xl"
            textAlign="center"
          />

          <TextType
            text={profile.tagline}
            typingSpeed={55}
            pauseDuration={2200}
            deletingSpeed={30}
            showCursor
            cursorCharacter="▍"
            cursorClassName="text-cyan-300"
            className="mt-3 min-h-6 text-base text-zinc-300"
          />

          <p className="mt-2 text-sm text-zinc-500">{profile.location}</p>
        </header>

        {/* Links */}
        <section aria-label="Links" className="mt-12 flex flex-col gap-4">
          {links.map((link, i) => (
            <LinkCard key={link.label} link={link} index={i} />
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-auto flex flex-col items-center gap-3 pt-16">
          <div className="flex items-center gap-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-zinc-500 transition-colors duration-200 hover:text-cyan-300"
              >
                <Icon name={s.icon} className="h-5 w-5" />
              </a>
            ))}
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {profile.name}. Built with React Bits.
          </p>
        </footer>
      </main>
    </div>
  );
}
