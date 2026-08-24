import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { profile, links, socials } from "@/data/profile";

const filters = ["All links", "Work", "Code", "Social"];
const getType = (link) => ["instagram", "twitter"].includes(link.id) ? "Social" : link.id === "orbitly" ? "Work" : "Code";

export default function App() {
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState("All links");
  const visibleLinks = useMemo(() => links.filter((link) => filter === "All links" || getType(link) === filter), [filter]);
  const handleCopy = async () => {
    await navigator.clipboard.writeText("https://github.com/qriqs");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <main className="page-wrap">
        <nav className="topbar" aria-label="Primary navigation">
          <a className="wordmark" href="#top" aria-label="Go to top"><span className="seal-wing seal-left">𓆩</span><span className="seal-core">CA</span><span className="seal-wing seal-right">𓆪</span></a>
          <div className="topbar-meta"><span className="availability"><i /> Available for select projects</span><a className="email-link" href="mailto:hello@qriqs.dev">Let&apos;s talk <span>↗</span></a></div>
        </nav>

        <section className="hero" id="top">
          <div className="hero-copy"><p className="eyebrow">Independent engineer · Lima, Peru</p><h1>Build less noise.<br /><em>Ship more.</em></h1><p className="intro">I&apos;m Cristopher — a DevOps &amp; Cloud Engineer focused on reliable infrastructure, useful tools, and web systems that stay out of the way.</p><div className="hero-actions"><a className="primary-button" href="https://github.com/qriqs" target="_blank" rel="noopener noreferrer">Explore my work <span>↗</span></a><a className="text-button" href="mailto:hello@qriqs.dev">Get in touch</a></div></div>
          <div className="profile-card"><div className="profile-topline"><span>01 / Profile</span><span>Scroll to explore ↓</span></div><div className="portrait-wrap"><div className="portrait-orbit orbit-a" /><div className="portrait-orbit orbit-b" /><img src={profile.avatar} alt={profile.name} className="portrait" /></div><div className="profile-details"><div><h2>{profile.name}</h2><p>{profile.role}</p></div><span className="profile-mark">✳</span></div><div className="stats">{profile.stats.map((stat) => <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div></div>
        </section>

        <section className="links-section" aria-label="Links and work"><div className="section-heading"><div><p className="eyebrow">02 / Selected links</p><h2>A few places<br /><em>you can find me.</em></h2></div><div className="filter-list" role="tablist" aria-label="Filter links">{filters.map((item) => <button className={filter === item ? "filter active" : "filter"} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div></div><div className="link-list">{visibleLinks.map((link, index) => <a className={index === 0 && filter === "All links" ? "link-card featured" : "link-card"} href={link.url} target="_blank" rel="noopener noreferrer" key={link.id}><span className="link-index">0{index + 1}</span><span className="link-icon"><Icon name={link.icon} /></span><span className="link-content"><span className="link-title">{link.title} <span className="link-arrow">↗</span></span><span className="link-description">{link.description}</span><span className="tag-row">{link.tags?.map((tag) => <span key={tag}>{tag}</span>)}</span></span>{link.badge && <span className="link-badge">{link.badge}</span>}</a>)}</div></section>

        <section className="connect-row"><div><p className="eyebrow">03 / Keep in touch</p><h2>Good work starts<br /><em>with a hello.</em></h2></div><div className="connect-actions"><button onClick={handleCopy} className="copy-button"><Icon name={copied ? "check" : "copy"} />{copied ? "Profile URL copied" : "Copy profile URL"}</button><div className="socials">{socials.map((social) => <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label} key={social.label}><Icon name={social.icon} /></a>)}</div></div></section>
        <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>{profile.quote}</span><span>Made with care in 🇵🇪</span></footer>
      </main>
    </div>
  );
}
