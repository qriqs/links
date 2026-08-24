import { useState } from "react";
import Threads from "@/components/Threads";
import SplitText from "@/components/SplitText";
import TextType from "@/components/TextType";
import BorderGlow from "@/components/BorderGlow";
import AnimatedContent from "@/components/AnimatedContent";
import Icon from "@/components/Icon";
import { profile, links, socials } from "@/data/profile";

export default function App() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text, e) => {
    e.preventDefault();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans">
      
      {/* React Bits: Single High-Performance Animated Threads Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="w-full h-full opacity-65">
          <Threads
            color={[0.15, 0.72, 1.0]}
            amplitude={1.3}
            distance={0.35}
            enableMouseInteraction={true}
          />
        </div>
        {/* Soft Radial Vignette for Content Readability */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(3,7,18,0.7)_50%,#030712_95%]" />
        {/* Modern Cyber Grid Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Container */}
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 py-12 sm:px-6 sm:py-16">
        
        {/* Hero Section */}
        <header className="flex flex-col items-center text-center">
          
          {/* Status Badge */}
          <AnimatedContent duration={0.5} distance={15} initialOpacity={0}>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1 text-xs font-medium text-cyan-300 backdrop-blur-md mb-6 shadow-[0_0_25px_rgba(6,182,212,0.25)] font-mono">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              {profile.status}
            </div>
          </AnimatedContent>

          {/* Avatar with Neon Ring */}
          <AnimatedContent duration={0.7} initialOpacity={0} scale={0.9} delay={0.08}>
            <div className="relative group mb-5">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-500 animate-spin-slow" />
              <div className="relative h-28 w-28 rounded-full border-2 border-white/25 p-1 bg-[#060a14] backdrop-blur-2xl shadow-2xl overflow-hidden">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
          </AnimatedContent>

          {/* Role label */}
          <AnimatedContent duration={0.5} delay={0.12} distance={10}>
            <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-cyan-400/90 mb-1.5 font-mono">
              {profile.role}
            </p>
          </AnimatedContent>

          {/* Animated Name */}
          <div className="mt-1">
            <SplitText
              text={profile.name}
              tag="h1"
              delay={40}
              duration={0.8}
              splitType="chars"
              className="text-4xl font-black tracking-tight text-white sm:text-6xl drop-shadow-[0_0_40px_rgba(56,189,248,0.35)]"
              textAlign="center"
            />
          </div>

          {/* Quote */}
          <p className="mt-2 text-xs italic text-zinc-400 font-mono">
            {profile.quote}
          </p>

          {/* Dynamic Typewriter Bio */}
          <div className="mt-3 min-h-[30px] flex items-center justify-center max-w-md px-2">
            <TextType
              text={profile.bio}
              typingSpeed={38}
              pauseDuration={2200}
              deletingSpeed={18}
              showCursor={true}
              cursorCharacter="▋"
              cursorClassName="text-cyan-400"
              className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed text-center"
            />
          </div>

          {/* Location & Handle & Organizations */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-zinc-400 font-mono">
            <span>{profile.location}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-cyan-400 font-medium">{profile.handle}</span>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1.5">
              {profile.orgs.map((org) => (
                <a
                  key={org.name}
                  href={`https://github.com/${org.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                  title={`@${org.name}`}
                >
                  <img src={org.avatar} alt={org.name} className="w-3.5 h-3.5 rounded-full" />
                  <span>@{org.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Tech stack chips */}
          <div className="mt-5 flex flex-wrap justify-center gap-1.5 max-w-md">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-mono text-zinc-300 backdrop-blur-sm transition-all duration-200 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </header>

        {/* Links & Projects Section */}
        <section aria-label="Links and Projects" className="mt-10 flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Destinations & Work
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {links.length} links
            </span>
          </div>

          {links.map((link, idx) => (
            <AnimatedContent
              key={link.id}
              distance={25}
              duration={0.55}
              delay={0.05 * idx}
              ease="power2.out"
              initialOpacity={0}
            >
              <BorderGlow
                className="group relative cursor-pointer overflow-hidden transition-transform duration-200 hover:scale-[1.012] active:scale-[0.99]"
                edgeSensitivity={25}
                glowColor={link.glowColor || "190 95 65"}
                backgroundColor="#080d1a"
                borderRadius={20}
                glowRadius={35}
                glowIntensity={1.3}
                coneSpread={28}
                colors={link.colors || ["#00f0ff", "#7000ff", "#ff007b"]}
                fillOpacity={0.35}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 sm:p-5 w-full text-left"
                >
                  {/* Icon Box */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] text-white shadow-inner transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-400/40">
                    <span className="text-cyan-300 group-hover:text-cyan-200 transition-colors">
                      <Icon name={link.icon} className="h-5 w-5" />
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold text-white text-base tracking-tight group-hover:text-cyan-200 transition-colors">
                        {link.title}
                      </h2>
                      {link.badge && (
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-mono font-medium tracking-wide text-cyan-300 uppercase">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-snug">
                      {link.description}
                    </p>
                    {link.tags && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        {link.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-white/[0.04] border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Arrow */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] text-zinc-500 transition-all duration-300 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 group-hover:translate-x-0.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              </BorderGlow>
            </AnimatedContent>
          ))}
        </section>

        {/* Quick Copy Command / GitHub profile link */}
        <div className="mt-6">
          <button
            onClick={(e) => handleCopy("https://github.com/qriqs", e)}
            className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-3.5 text-xs text-zinc-400 backdrop-blur-md transition-all duration-200 hover:border-cyan-500/30 group cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Icon name="terminal" className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-zinc-300">github.com/qriqs</span>
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 group-hover:text-cyan-300">
              <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
              {copied ? "Copied profile URL!" : "Copy URL"}
            </span>
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-auto flex flex-col items-center gap-4 pt-14 text-center">
          {/* Socials dock */}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-xl shadow-xl">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-all duration-200 hover:bg-white/10 hover:text-cyan-300 hover:scale-110"
              >
                <Icon name={s.icon} className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-zinc-400 font-mono">
              Designed & Engineered with <span className="text-cyan-400 font-semibold">React Bits</span>
            </p>
            <p className="text-[11px] text-zinc-400 font-mono">
              © {new Date().getFullYear()} {profile.name} (@{profile.username})
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
