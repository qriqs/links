import { useMemo, useState } from "react";
import Icon from "@/components/Icon";
import { profile, links, socials } from "@/data/profile";
import { trackEvent } from "@/utils/analytics";

const filters = ["All links", "Work", "Code", "Social"];
const getType = (link) => ["instagram", "twitter"].includes(link.id) ? "Social" : link.id === "orbitly" ? "Work" : "Code";

const getLinkAnalyticsAttrs = (link) => {
  if (link.id === "github") {
    return {
      "data-umami-event": "github_click",
      "data-umami-event-url": link.url,
      "data-umami-event-title": link.title,
    };
  }
  if (["twitter", "instagram", "linkedin", "telegram"].includes(link.id)) {
    return {
      "data-umami-event": "social_click",
      "data-umami-event-network": link.id === "twitter" ? "x_twitter" : link.id,
      "data-umami-event-url": link.url,
      "data-umami-event-title": link.title,
    };
  }
  if (link.id === "resume") {
    return {
      "data-umami-event": "resume_download",
      "data-umami-event-url": link.url,
      "data-umami-event-title": link.title,
    };
  }
  return {
    "data-umami-event": "project_click",
    "data-umami-event-project": link.id,
    "data-umami-event-title": link.title,
    "data-umami-event-url": link.url,
  };
};

export default function App() {
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState("All links");
  const visibleLinks = useMemo(() => links.filter((link) => filter === "All links" || getType(link) === filter), [filter]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("https://github.com/qriqs");
      setCopied(true);
      trackEvent("copy_profile_url", { target: "https://github.com/qriqs" });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Graceful fallback for clipboard permissions
    }
  };

  const handleFilterChange = (item) => {
    setFilter(item);
    trackEvent("filter_change", { category: item });
  };

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <main className="page-wrap">
        <nav className="topbar" aria-label="Primary navigation">
          <a className="wordmark" href="#top" aria-label="Go to top" data-umami-event="nav_wordmark_click">CA<span>.</span></a>
          <div className="topbar-meta">
            <span className="availability"><i /> Available for select projects</span>
            <a
              className="email-link"
              href="mailto:hello@qriqs.dev"
              data-umami-event="email_click"
              data-umami-event-location="topbar"
            >
              Let&apos;s talk <span>↗</span>
            </a>
          </div>
        </nav>

        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Independent engineer · Lima, Peru</p>
            <h1>Build less noise.<br /><em>Ship more.</em></h1>
            <p className="intro">I&apos;m Cristopher — a DevOps &amp; Cloud Engineer focused on reliable infrastructure, useful tools, and web systems that stay out of the way.</p>
            <div className="hero-actions">
              <a
                className="primary-button"
                href="https://github.com/qriqs"
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="github_click"
                data-umami-event-location="hero"
              >
                Explore my work <span>↗</span>
              </a>
              <a
                className="text-button"
                href="mailto:hello@qriqs.dev"
                data-umami-event="email_click"
                data-umami-event-location="hero"
              >
                Get in touch
              </a>
            </div>
          </div>
          <div className="profile-card">
            <div className="profile-topline"><span>01 / Profile</span><span>Scroll to explore ↓</span></div>
            <div className="portrait-wrap"><div className="portrait-orbit orbit-a" /><div className="portrait-orbit orbit-b" /><img src={profile.avatar} alt={profile.name} className="portrait" /></div>
            <div className="profile-details"><div><h2>{profile.name}</h2><p>{profile.role}</p></div><span className="profile-mark">✳</span></div>
            <div className="stats">{profile.stats.map((stat) => <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>
          </div>
        </section>

        <section className="links-section" aria-label="Links and work">
          <div className="section-heading">
            <div><p className="eyebrow">02 / Selected links</p><h2>A few places<br /><em>you can find me.</em></h2></div>
            <div className="filter-list" role="tablist" aria-label="Filter links">
              {filters.map((item) => (
                <button
                  className={filter === item ? "filter active" : "filter"}
                  onClick={() => handleFilterChange(item)}
                  key={item}
                  data-umami-event="filter_click"
                  data-umami-event-category={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="link-list">
            {visibleLinks.map((link, index) => (
              <a
                className={index === 0 && filter === "All links" ? "link-card featured" : "link-card"}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                key={link.id}
                {...getLinkAnalyticsAttrs(link)}
              >
                <span className="link-index">0{index + 1}</span>
                <span className="link-icon"><Icon name={link.icon} /></span>
                <span className="link-content">
                  <span className="link-title">{link.title} <span className="link-arrow">↗</span></span>
                  <span className="link-description">{link.description}</span>
                  <span className="tag-row">{link.tags?.map((tag) => <span key={tag}>{tag}</span>)}</span>
                </span>
                {link.badge && <span className="link-badge">{link.badge}</span>}
              </a>
            ))}
          </div>
        </section>

        <section className="connect-row">
          <div><p className="eyebrow">03 / Keep in touch</p><h2>Good work starts<br /><em>with a hello.</em></h2></div>
          <div className="connect-actions">
            <button
              onClick={handleCopy}
              className="copy-button"
              data-umami-event="copy_profile_url"
              data-umami-event-target="https://github.com/qriqs"
            >
              <Icon name={copied ? "check" : "copy"} />
              {copied ? "Profile URL copied" : "Copy profile URL"}
            </button>
            <div className="socials">
              {socials.map((social) => {
                const isGithub = social.label.toLowerCase() === "github";
                const eventName = isGithub ? "github_click" : "social_click";
                return (
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    key={social.label}
                    data-umami-event={eventName}
                    data-umami-event-network={social.label.toLowerCase()}
                    data-umami-event-url={social.url}
                  >
                    <Icon name={social.icon} />
                  </a>
                );
              })}
            </div>
          </div>
        </section>
        <footer><span>© {new Date().getFullYear()} {profile.name}</span><span>{profile.quote}</span><span>Made with care in 🇵🇪</span></footer>
      </main>
    </div>
  );
}
