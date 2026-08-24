import { useState } from "react";
import FaultyTerminal from "@/components/FaultyTerminal";
import Dither from "@/components/Dither";
import Aurora from "@/components/Aurora";
import SplitText from "@/components/SplitText";
import TextType from "@/components/TextType";
import BorderGlow from "@/components/BorderGlow";
import AnimatedContent from "@/components/AnimatedContent";
import Icon from "@/components/Icon";
import { profile, links, socials } from "@/data/profile";

export default function App() {
  const [bgMode, setBgMode] = useState("terminal"); // 'terminal' | 'dither' | 'aurora'
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText("hello@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic Backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {bgMode === "terminal" && (
          <div className="w-full h-full opacity-60 transition-opacity duration-700">
            <FaultyTerminal
              scale={1.2}
              gridMul={[2, 1]}
              digitSize={1.4}
              timeScale={0.25}
              scanlineIntensity={0.25}
              glitchAmount={0.75}
              flickerAmount={0.5}
              noiseAmp={0.8}
              chromaticAberration={1.5}
              dither={0.4}
              curvature={0.06}
              tint="#38bdf8"
              brightness={0.65}
              mouseReact={true}
              mouseStrength={0.25}
            />
          </div>
        )}

        {bgMode === "dither" && (
          <div className="w-full h-full opacity-70 transition-opacity duration-700">
            <Dither
              waveSpeed={0.04}
              waveFrequency={2.5}
              waveAmplitude={0.35}
              waveColor={[0.1, 0.4, 0.7]}
              colorNum={4}
              pixelSize={2.5}
              enableMouseInteraction={true}
              mouseRadius={1.2}
            />
          </div>
        )}

        {bgMode === "aurora" && (
          <div className="w-full h-full opacity-75 transition-opacity duration-700">
            <Aurora
              colorStops={["#00f0ff", "#7000ff", "#ff007b"]}
              amplitude={1.2}
              blend={0.65}
            />
          </div>
        )}

        {/* Cinematic Vignette Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(3,7,18,0.78)_60%,#030712_100%]" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-4 py-12 sm:px-6 sm:py-16">
        
        {/* Top Controls: Background Mode Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-xl shadow-2xl">
            <button
              onClick={() => setBgMode("terminal")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                bgMode === "terminal"
                  ? "bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.35)] border border-cyan-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Terminal
            </button>
            <button
              onClick={() => setBgMode("dither")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                bgMode === "dither"
                  ? "bg-purple-500/20 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)] border border-purple-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Dither
            </button>
            <button
              onClick={() => setBgMode("aurora")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                bgMode === "aurora"
                  ? "bg-pink-500/20 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.35)] border border-pink-500/30"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              Aurora
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <header className="flex flex-col items-center text-center">
          {/* Status Pill */}
          <AnimatedContent duration={0.6} initialOpacity={0} animateOpacity distance={20}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {profile.status}
            </div>
          </AnimatedContent>

          {/* Avatar with Cyber Glow */}
          <AnimatedContent duration={0.8} initialOpacity={0} animateOpacity scale={0.85}>
            <div className="relative group mb-5">
              {/* Outer neon aura */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 opacity-75 blur-md group-hover:opacity-100 transition-all duration-500 animate-spin-slow" />
              <div className="relative h-28 w-28 rounded-full border-2 border-white/20 p-1 bg-[#090d16] backdrop-blur-xl shadow-2xl">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
          </AnimatedContent>

          {/* Role badge */}
          <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-cyan-400/90 mb-1">
            {profile.role}
          </p>

          {/* Animated Name */}
          <div className="mt-1">
            <SplitText
              text={profile.name}
              tag="h1"
              delay={50}
              duration={0.8}
              splitType="chars"
              className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              textAlign="center"
            />
          </div>

          {/* Dynamic Typewriter Bio */}
          <div className="mt-3 min-h-[32px] flex items-center justify-center max-w-md px-2">
            <TextType
              text={profile.bio}
              typingSpeed={45}
              pauseDuration={2400}
              deletingSpeed={25}
              showCursor={true}
              cursorCharacter="▋"
              cursorClassName="text-cyan-400"
              className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed"
            />
          </div>

          {/* Location & Handle */}
          <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              {profile.location}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-cyan-400/80">{profile.handle}</span>
          </div>

          {/* Skills / Tech Badges */}
          <div className="mt-5 flex flex-wrap justify-center gap-1.5 max-w-md">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-mono text-zinc-400 backdrop-blur-sm transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </header>

        {/* Links & Projects Section */}
        <section aria-label="Links and Projects" className="mt-10 flex flex-col gap-3.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Featured Destinations
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              {links.length} links
            </span>
          </div>

          {links.map((link, idx) => (
            <AnimatedContent
              key={link.id}
              distance={40}
              duration={0.7}
              delay={0.07 * idx}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
            >
              <BorderGlow
                className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.015] active:scale-[0.99]"
                edgeSensitivity={25}
                glowColor={link.glowColor || "190 95 65"}
                backgroundColor="#0a0f1d"
                borderRadius={20}
                glowRadius={35}
                glowIntensity={1.3}
                coneSpread={30}
                animated={false}
                colors={link.colors || ["#00f0ff", "#7000ff", "#ff007b"]}
                fillOpacity={0.35}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 sm:p-5 w-full"
                >
                  {/* Icon Box */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] text-white shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:border-cyan-400/40">
                    <span className="text-cyan-300 group-hover:text-cyan-200 transition-colors">
                      <Icon name={link.icon} className="h-5 w-5" />
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-white text-base tracking-tight group-hover:text-cyan-200 transition-colors">
                        {link.title}
                      </h3>
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

        {/* Quick Email Copy Bar */}
        <div className="mt-6">
          <button
            onClick={handleCopyEmail}
            className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-3.5 text-xs text-zinc-400 backdrop-blur-md transition-all duration-200 hover:border-cyan-500/30 group"
          >
            <span className="flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4 text-cyan-400" />
              <span className="font-mono text-zinc-300">hello@example.com</span>
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 group-hover:text-cyan-300">
              <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
              {copied ? "Copied to clipboard!" : "Copy email"}
            </span>
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-auto flex flex-col items-center gap-4 pt-12 text-center">
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
              Designed & Engineered with <span className="text-cyan-400 font-bold">React Bits</span>
            </p>
            <p className="text-[11px] text-zinc-400">
              © {new Date().getFullYear()} {profile.name} • All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
