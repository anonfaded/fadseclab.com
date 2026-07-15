import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Camera,
  ExternalLink,
  FileText,
  Heart,
  Keyboard,
  Lock,
  Mail,
  Monitor,
  Palette,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { FaAndroid, FaApple, FaDiscord, FaFirefox, FaGithub, FaLinux, FaPatreon, FaWindows } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { openExternal } from '@/lib/external-nav';
import { useAppContext } from '@/lib/app-context';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import BlogBadge from '@/components/BlogBadge/BlogBadge';
import { buttonVariants } from '@/components/ui/button-variants';

gsap.registerPlugin();

const HeroShield = lazy(() => import('@/components/HeroShield/HeroShield'));
const GlobalFootprintMap = lazy(() => import('@/components/GlobalFootprintMap/GlobalFootprintMap'));

import pilotPicImg from '@/assets/images/fadcam_sam_rutherford.jpg';

const fadCamUrl = 'https://fadcam.fadseclab.com';
const githubOrgUrl = 'https://github.com/fadsec-lab';
const patreonUrl = 'https://patreon.faded.dev';
const discordUrl = 'https://discord.gg/kvAZvdkuuN';

// ── Hooks ──────────────────────────────────────────────────────────────────

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ── Decorative helpers ─────────────────────────────────────────────────────

function HeroSignalBackdrop() {
  return <div className="hero-scene" aria-hidden="true" />;
}

function AnimatedNumber({ value, suffix, start }: { value: number; suffix: string; start: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!start) return;
    const duration = 1200;
    const startTs = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startTs) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, start]);

  return <>{display}<span className="trust-metric-suffix">{suffix}</span></>;
}

function TubelightReveal({ text, start, className, staggerDelay = 0.07 }: { text: string; start: boolean; className?: string; staggerDelay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el || !start) return;
    const targets = el.querySelectorAll<HTMLElement>('.tubelight-word');
    if (targets.length === 0) return;

    gsap.killTweensOf(targets);

    gsap.fromTo(targets,
      { opacity: 0, filter: 'brightness(0.35) saturate(0.4)' },
      {
        keyframes: [
          { opacity: 0.85, filter: 'brightness(0.6) saturate(0.65)', duration: 0.03 },
          { opacity: 0,    filter: 'brightness(0.35) saturate(0.4)', duration: 0.05 },
          { opacity: 1,    filter: 'brightness(0.75) saturate(0.8)', duration: 0.025 },
          { opacity: 0,    filter: 'brightness(0.4) saturate(0.45)', duration: 0.07 },
          { opacity: 0.5,  filter: 'brightness(0.5) saturate(0.55)', duration: 0.035 },
          { opacity: 1,    filter: 'brightness(0.85) saturate(0.9)', duration: 0.04 },
          { opacity: 0.3,  filter: 'brightness(0.45) saturate(0.5)', duration: 0.05 },
          { opacity: 1,    filter: 'brightness(1) saturate(1)',      duration: 0.7, ease: 'power2.out' },
        ],
        stagger: staggerDelay,
        ease: 'none',
      },
    );
  }, [start, staggerDelay]);

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="tubelight-word-wrap">
          <span className="tubelight-word">{word}</span>
          {i < words.length - 1 ? '\u00A0' : null}
        </span>
      ))}
    </span>
  );
}

function WordReveal({ text, start, className, wordClassName, delay = 0 }: { text: string; start: boolean; className?: string; wordClassName?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    if (!start) return;
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll<HTMLElement>('.reveal-word');
    gsap.fromTo(targets,
      { yPercent: 110 },
      {
        yPercent: 0,
        filter: 'blur(0px)',
        opacity: 1,
        duration: 1.6,
        ease: 'expo.out',
        stagger: 0.2,
        delay,
      },
    );
  }, [start, delay]);

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="reveal-word-wrap">
          <span className={cn('reveal-word', wordClassName)}>{word}</span>
          {i < words.length - 1 ? '\u00A0' : null}
        </span>
      ))}
    </span>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────

function HomePage() {
  const navigate = useNavigate();
  const { setActiveDialog, setLightboxSrc, lightboxSrc, isLoading } = useAppContext();

  const [heroPhase, setHeroPhase] = useState(0);
  const [, setActiveSection] = useState('home');

  const { ref: trustRef, inView: trustInView } = useInView<HTMLDivElement>(0);
  const { ref: trustMetricsRef1, inView: trustMetrics1 } = useInView<HTMLDivElement>(0);
  const { ref: trustMetricsRef2, inView: trustMetrics2 } = useInView<HTMLDivElement>(0);
  const { ref: trustMetricsRef3, inView: trustMetrics3 } = useInView<HTMLDivElement>(0);
  const { ref: productRef, inView: productInView } = useInView<HTMLDivElement>(0);
  const { ref: productRestRef, inView: productRestInView } = useInView<HTMLDivElement>(0);
  const { ref: servicesRef, inView: servicesInView } = useInView<HTMLDivElement>(0);
  const { ref: openSourceRef, inView: openSourceInView } = useInView<HTMLDivElement>(0);
  const { ref: missionRef, inView: missionInView } = useInView<HTMLDivElement>(0);
  const { ref: missionDonateRef, inView: missionDonateInView } = useInView<HTMLDivElement>(0);

  // Hero entrance cascade — deferred to next frame so it doesn't fire
  // synchronously within the effect (avoids cascading render warning)
  useEffect(() => {
    if (isLoading) return;
    const frame = requestAnimationFrame(() => setHeroPhase(1));
    const descTimer = setTimeout(() => setHeroPhase(2), 1200);
    const ctasTimer = setTimeout(() => setHeroPhase(3), 2500);
    return () => { cancelAnimationFrame(frame); clearTimeout(descTimer); clearTimeout(ctasTimer); };
  }, [isLoading]);

  // Scroll-spy for nav active state
  useEffect(() => {
    const sectionIds = ['products', 'services', 'open-source', 'mission'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        } else {
          const firstTop = sections[0].getBoundingClientRect().top;
          if (firstTop > window.innerHeight * 0.5) {
            setActiveSection('home');
          }
        }
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <main id="home">
        <section className={cn('hero-section', `hero-phase-${heroPhase}`)}>
          <HeroSignalBackdrop />
          <div className="hero-copy">
            <BlogBadge className="section-badge" />
            <h1 className="hero-headline">
              <WordReveal text="Privacy today," start={heroPhase >= 1} delay={0.2} />
              <br />
              <WordReveal text="tomorrow," start={heroPhase >= 1} delay={0.42} />
              {' '}
              <WordReveal text="forever." start={heroPhase >= 1} delay={0.42} wordClassName="hero-headline-accent" />
            </h1>
            <p className="hero-lede">
              <TubelightReveal text="Anti-adversary, open-source software for Android, iOS, and desktop." start={heroPhase >= 2} />
              <br />
              <TubelightReveal text="Zero tracking, zero telemetry, production-grade engineering." start={heroPhase >= 2} />
            </p>
            <div className="hero-actions">
              <a href="#services" className={buttonVariants({ size: 'lg', className: 'hero-action' })} onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}>
                Explore services
                <ArrowRight />
              </a>
              <Button type="button" variant="outline" size="lg" className="hero-action" onClick={() => setActiveDialog('contact')}>
                Discuss a project
                <Mail />
              </Button>
            </div>
            <Suspense fallback={<div className="hero-shield-placeholder" style={{ width: '100%', maxWidth: 727, height: 640, margin: '0 auto' }} />}>
              <HeroShield />
            </Suspense>
          </div>
        </section>

        <div className="content-wrap">

        <section className="trust-section reveal" aria-label="Users trust us" id="trust" ref={trustRef}>
          <div className="trust-grid">
            <div className="trust-copy">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Users trust us" start={trustInView} /></span>
              <h2 className="trust-headline">
                <TubelightReveal text="A privacy-first company with a global footprint." start={trustInView} />
              </h2>
              <p className="trust-body">
                FadSec Lab products are used worldwide by individuals and teams who value privacy, transparency, and open-source software.
              </p>
              <div className="trust-metric-strip">
                <article className="trust-metric" ref={trustMetricsRef1}>
                  <div className="trust-metric-num">
                    {/* Actual: 71 countries — displayed as 70+ for cleaner UX */}
                    <AnimatedNumber value={70} suffix="+" start={trustMetrics1} />
                  </div>
                  <div className="trust-metric-label">Countries</div>
                  <div className="trust-metric-provenance">with active usage across FadSec Lab open-source software</div>
                </article>
                <article className="trust-metric" ref={trustMetricsRef2}>
                  <div className="trust-metric-num">
                    <AnimatedNumber value={150} suffix="K+" start={trustMetrics2} />
                  </div>
                  <div className="trust-metric-label">Users</div>
                  <div className="trust-metric-provenance">across FadSec Lab releases and distribution channels</div>
                </article>
                <article className="trust-metric" ref={trustMetricsRef3}>
                  <div className="trust-metric-num trust-metric-num--quiet">
                    <AnimatedNumber value={0} suffix="" start={trustMetrics3} />
                  </div>
                  <div className="trust-metric-label">Hidden trackers</div>
                  <div className="trust-metric-provenance">no third-party SDKs, analytics, or advertising identifiers</div>
                </article>
              </div>
            </div>
            <div className="world-map-card">
              <div className="world-map-head">
                <span className="world-map-eyebrow">// GLOBAL FOOTPRINT</span>
                <span className="world-map-meta">by country</span>
              </div>
              <Suspense fallback={<div className="world-map-frame" style={{ minHeight: 400 }} />}>
                <GlobalFootprintMap />
              </Suspense>
              <div className="world-map-foot">
                <span className="world-map-foot-text">
                  Each marker is a country with active users. Hover to read the country name.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="product-section reveal" id="products" ref={productRef}>
          <div className="product-head reveal">
            <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Products" start={productInView} /></span>
            <h2 className="product-section-title">
              <TubelightReveal text="Privacy-first software, shipped in the open." start={productInView} />
            </h2>
            <p className="product-section-lede">
              A focused catalog of native and cross-platform apps, built for people who want full control over what runs on their devices.
            </p>
          </div>

          <div className="product-grid">
            <div className={cn('product-flagship', productInView && 'is-visible')}>
              <div className="product-flagship-copy">
                <span className="eyebrow"><span className="eyebrow-sigil">//</span> FLAGSHIP &middot; <FaAndroid size={12} aria-hidden="true" /> ANDROID</span>
                <h3 className="product-flagship-title">FadCam</h3>
                <p className="product-flagship-desc">
                  Privacy-focused Android multimedia suite: background video recording, dashcam, screen recorder, live streaming and remote camera control — ad-free and open-source.
                </p>
                <ul className="product-flagship-uses">
                  <li><Camera /><div><b>Dashcam & background recording.</b><span>Record video with the screen off with a crash-resistant pipeline that survives interruptions.</span></div></li>
                  <li><ShieldCheck /><div><b>Remote monitoring &amp; control.</b><span>Live stream and control your camera over a local network from any device.</span></div></li>
                  <li><Sparkles /><div><b>Screen recorder.</b><span>Full-featured capture with annotation and multi-layer editing.</span></div></li>
                </ul>
                <div className="product-flagship-cta">
                  <Button type="button" size="lg" onClick={() => openExternal(fadCamUrl)}>
                    Visit FadCam
                    <ExternalLink />
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={() => openExternal(githubOrgUrl)}>
                    <FaGithub /> Source on GitHub
                    <ExternalLink />
                  </Button>
                </div>
              </div>
              <figure className="product-flagship-pilot">
                <div className="pilot-head">
                  <span className="pilot-eyebrow">// IN THE FIELD</span>
                </div>
                <button type="button" className="pilot-img-btn" onClick={() => setLightboxSrc(pilotPicImg)} aria-label="View image larger">
                  <img src={pilotPicImg} alt="A pilot using FadCam in the cockpit" width="512" height="384" />
                </button>
                <div className="pilot-foot">
                  <span className="pilot-caption">Running FadCam in a private aircraft over the North Atlantic, flying from Canada to Greenland.</span>
                  <span className="pilot-credit">Photo by <a href="https://neophile.me" target="_blank">Sam Rutherford</a></span>
                </div>
              </figure>
            </div>

            <aside className="product-rest reveal" ref={productRestRef}>
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Projects" start={productRestInView} /></span>
              <h3 className="product-rest-title"><TubelightReveal text="More from the catalog" start={productRestInView} /></h3>
              <p className="product-rest-body">
                Open-source tools for Android, Windows, Linux, and macOS — all built with the same commitment to privacy, transparency, and real user control. No personally identifiable information (PII) data collection, no telemetry, no hidden trackers.
              </p>
              <div className="product-rest-table-wrap">
              <table className="product-rest-table">
                <thead>
                  <tr>
                    <th className="product-rest-th--project">Project</th>
                    <th className="product-rest-th--platforms">Platforms</th>
                    <th className="product-rest-th--link"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="product-rest-row" onClick={() => openExternal('https://github.com/anonfaded/Fadocx')}>
                    <td className="product-rest-td--project">
                      <span className="product-rest-td--project-inner">
                        <span className="product-rest-link-icon"><FileText size={14} /></span>
                        <span>Fadocx</span>
                      </span>
                      <span className="product-rest-td--desc">Android document viewer with OCR — privacy-first, offline-first.</span>
                    </td>
                    <td className="product-rest-td--platforms"><span className="product-rest-td--platforms-inner">
                      <FaAndroid size={13} />
                      <span className="product-rest-soon"><FaApple size={10} /> soon</span>
                    </span></td>
                    <td className="product-rest-td--link"><ExternalLink size={11} /></td>
                  </tr>
                  <tr className="product-rest-row" onClick={() => openExternal('https://github.com/anonfaded/fadeboard')}>
                    <td className="product-rest-td--project">
                      <span className="product-rest-td--project-inner">
                        <span className="product-rest-link-icon"><Keyboard size={14} /></span>
                        <span>FadeBoard</span>
                      </span>
                      <span className="product-rest-td--desc">Android keyboard that bypasses censorship with special characters.</span>
                    </td>
                    <td className="product-rest-td--platforms"><span className="product-rest-td--platforms-inner">
                      <FaAndroid size={13} />
                    </span></td>
                    <td className="product-rest-td--link"><ExternalLink size={11} /></td>
                  </tr>
                  <tr className="product-rest-row" onClick={() => openExternal('https://github.com/anonfaded/FadCrypt')}>
                    <td className="product-rest-td--project">
                      <span className="product-rest-td--project-inner">
                        <span className="product-rest-link-icon"><Lock size={14} /></span>
                        <span>FadCrypt</span>
                      </span>
                      <span className="product-rest-td--desc">Windows app encryption — powerful, customizable, and free.</span>
                    </td>
                    <td className="product-rest-td--platforms"><span className="product-rest-td--platforms-inner">
                      <FaWindows size={13} /><FaLinux size={13} />
                      <span className="product-rest-soon"><FaApple size={10} /> soon</span>
                    </span></td>
                    <td className="product-rest-td--link"><ExternalLink size={11} /></td>
                  </tr>
                  <tr className="product-rest-row" onClick={() => openExternal('https://github.com/anonfaded/FadCat')}>
                    <td className="product-rest-td--project">
                      <span className="product-rest-td--project-inner">
                        <span className="product-rest-link-icon"><Terminal size={14} /></span>
                        <span>FadCat</span>
                      </span>
                      <span className="product-rest-td--desc">Cross-platform logcat utility with MCP automation support.</span>
                    </td>
                    <td className="product-rest-td--platforms"><span className="product-rest-td--platforms-inner">
                      <FaApple size={13} /><FaWindows size={13} /><FaLinux size={13} />
                    </span></td>
                    <td className="product-rest-td--link"><ExternalLink size={11} /></td>
                  </tr>
                  <tr className="product-rest-row" onClick={() => openExternal('https://github.com/anonfaded/Fadify')}>
                    <td className="product-rest-td--project">
                      <span className="product-rest-td--project-inner">
                        <span className="product-rest-link-icon"><Palette size={14} /></span>
                        <span>Fadify</span>
                      </span>
                      <span className="product-rest-td--desc">Firefox add-on for true dark aesthetics and web customization.</span>
                    </td>
                    <td className="product-rest-td--platforms"><span className="product-rest-td--platforms-inner">
                      <FaFirefox size={13} />
                    </span></td>
                    <td className="product-rest-td--link"><ExternalLink size={11} /></td>
                  </tr>
                </tbody>
              </table>
              </div>
              <div className="product-rest-cta">
                <Button type="button" size="lg" onClick={() => openExternal(githubOrgUrl)}>
                  <FaGithub /> Browse all projects
                  <ExternalLink />
                </Button>
              </div>
            </aside>
          </div>
        </section>

        <section className="services-section reveal" id="services" ref={servicesRef}>
          <div className="services-grid">
            <div className="services-copy">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Services" start={servicesInView} /></span>
              <h2>
                <TubelightReveal text="Ship production-grade apps, on your timeline." start={servicesInView} />
              </h2>
              <p>
                We build full-stack mobile and desktop applications — from native Android and iOS to cross-platform solutions. Our work spans privacy and security, healthcare and welfare, media and recording applications, and operational software for organizations and teams.
              </p>
              <p>
                Clean architecture, maintainable codebases, and AI-assisted workflows help us deliver production-ready software in weeks, not months.
              </p>
              <p>
                <strong>Have a project in mind? Get in touch to discuss your requirements and technical goals.</strong>
              </p>
            </div>

            <div className="services-right">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span> What we offer</span>
              <div className="services-list">
              <article className="service-row">
                <span className="service-row-icon"><FaAndroid /></span>
                <div className="service-row-content">
                  <div className="service-row-head">
                    <h3>Native Android</h3>
                  </div>
                  <span className="service-row-meta">Kotlin · Jetpack Compose · Material 3</span>
                  <p>
                    Modern Android applications built with clean architecture and full platform integration. We set up Fastlane CI/CD for automated builds and distribution-ready pipelines — from rapid MVPs to enterprise-grade products.
                  </p>
                </div>
              </article>

              <article className="service-row">
                <span className="service-row-icon"><FaApple /></span>
                <div className="service-row-content">
                  <div className="service-row-head">
                    <h3>Native iOS</h3>
                  </div>
                  <span className="service-row-meta">Swift · SwiftUI</span>
                  <p>
                    Production iOS and iPadOS apps built with Swift and SwiftUI. We cover the full development lifecycle — from architecture and prototyping to polished, release-ready products.
                  </p>
                </div>
              </article>

              <article className="service-row">
                <span className="service-row-icon"><Monitor /></span>
                <div className="service-row-content">
                  <div className="service-row-head">
                    <h3>Cross-platform Mobile & Desktop</h3>
                  </div>
                  <span className="service-row-meta">Tauri · Electron · Flutter · Qt</span>
                  <p>
                    iOS, Android, macOS, Windows, and Linux from a single codebase. We choose the right stack for your use case — Tauri for resource-efficient cross-platform apps, Electron for complex web-integrated workflows, Flutter for shared mobile and desktop experiences, or Qt with Python for high-performance native tooling.
                  </p>
                </div>
              </article>

              <div className="services-foot">
                <p>
                  <b>Your MVP ships in 14 days</b> — clean architecture, automated CI/CD, and a maintainable codebase built to scale with your product.
                </p>
                <Button type="button" size="lg" onClick={() => setActiveDialog('contact')}>
                  Start your project
                  <ArrowRight />
                </Button>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section className="open-source-section reveal" id="open-source" ref={openSourceRef}>
          <div className="open-source-grid">
            <div className="open-source-stance">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Open source" start={openSourceInView} /></span>
              <h2>
                <TubelightReveal text="Open by default. Auditable by design." start={openSourceInView} />
              </h2>
              <p>
                Privacy is only meaningful when it is verifiable. That is why every FadSec Lab project is developed in the open, with public repositories, public releases, and transparent development history. No gated downloads. No closed-source components.
              </p>
            </div>
            <div className="open-source-cta">
              <div className="open-source-stats">
                <div className="open-source-stat">
                  <span className="open-source-stat-num">23+</span>
                  <span className="open-source-stat-label">public repositories</span>
                </div>
                <div className="open-source-stat">
                  <span className="open-source-stat-num">2024</span>
                  <span className="open-source-stat-label">building openly since</span>
                </div>
                <div className="open-source-stat">
                  <span className="open-source-stat-num">0</span>
                  <span className="open-source-stat-label">gated downloads</span>
                </div>
              </div>
              <p className="open-source-cta-text">
                The source is available. The history is visible. Anyone can inspect, fork, or contribute.
              </p>
              <Button type="button" size="lg" onClick={() => openExternal(githubOrgUrl)}>
                <FaGithub />
                Browse GitHub
                <ExternalLink />
              </Button>
            </div>
          </div>
        </section>

        <section className="mission-section reveal" id="mission" ref={missionRef}>
          <div className="mission-grid">
            <div className="mission-stance">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Mission" start={missionInView} /></span>
              <h2 className="mission-headline">
                <TubelightReveal text="Surveillance-free technology is a fundamental right." start={missionInView} />
              </h2>
              <p className="mission-lede">
                FadSec Lab was founded with a simple goal: to give users, and ourselves, full control over the software we run. The foundation of that mission is Shariah compliance, which we treat as a non-negotiable principle.
              </p>
              <p className="mission-lede">
                <strong className="mission-why">Why Shariah?</strong> Because privacy, dignity, and respect for personal boundaries are fundamental principles within Shariah. Surveillance, data exploitation, behavioral profiling, and ad-driven manipulation are unethical practices that violate those principles. Shariah provides a framework that upholds human dignity, protects personal privacy, and establishes clear ethical limits on how people and their data should be treated.
              </p>
              <p className="mission-lede">
                We do not track anyone. We do not collect personally identifiable information, telemetry, usage data, crash reports, or diagnostic logs of any kind. We do not show ads, and we do not profit from surveillance, privacy invasion, or user profiling.
              </p>
              <p className="mission-lede">
                That commitment defines everything we do. Our mission is to build solutions that put users in control, run on hardware they already own, and ensure that the power of that hardware serves the user—not an analytics pipeline. We are committed to making surveillance-free technology the default and replacing mainstream tools that are unethical by design.
              </p>
              <p className="mission-lede">
                We are different by choice. We build in public, ship open source software, and maintain clear ethical boundaries. Privacy is not a feature on a checklist; it is the foundation upon which everything else is built. We believe every person has the right to use technology without being monitored, profiled, or exploited, and we build accordingly.
              </p>
              <p className="mission-lede">
                Our commitments to privacy and ethics are documented publicly:{' '}
                <a href="/privacy" className="consent-link" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }}>Privacy Policy</a>
                {' · '}
                <a href="/terms" className="consent-link" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms of Service</a>
              </p>
            </div>

            <aside className="mission-donate" ref={missionDonateRef}>
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Support the mission" start={missionDonateInView} /></span>
              <h3 className="mission-donate-title"><TubelightReveal text="Sustained by those who share the mission." start={missionDonateInView} /></h3>
              <p className="mission-donate-body">
                FadSec Lab accepts no advertising revenue, no surveillance capital, and no investor funding. Our work is supported entirely by the people who believe technology should serve its users—not advertisers, data brokers, or analytics platforms.
              </p>
              <p className="mission-donate-body">
                If our mission resonates with you, you can support continued development through Patreon or direct contributions. Those who prefer cryptocurrency contributions, or supporters in Pakistan seeking local contribution options, are welcome to contact us by email or through Discord.
              </p>
              <div className="mission-donate-actions">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => openExternal(patreonUrl)}
                >
                  <FaPatreon />
                  Back us on Patreon
                  <ExternalLink />
                </Button>
                <button type="button" className="donate-link" onClick={() => setActiveDialog('contact')}>
                  <span className="donate-link-icon"><Mail /></span>
                  <span className="donate-link-text">
                    <span className="donate-link-eyebrow">// Crypto contributions &amp; enquiries</span>
                    <span className="donate-link-label">Email Us</span>
                  </span>
                  <ExternalLink />
                </button>
                <button
                  type="button"
                  className="donate-link"
                  onClick={() => openExternal(discordUrl)}
                >
                  <span className="donate-link-icon"><FaDiscord /></span>
                  <span className="donate-link-text">
                    <span className="donate-link-eyebrow">// Open a ticket</span>
                    <span className="donate-link-label">Contact via Discord</span>
                  </span>
                  <ExternalLink />
                </button>
              </div>
              <div className="mission-donate-foot">
                <Heart />
                <span>Every contribution helps us build, maintain, and improve privacy-respecting, open source alternatives without compromising our principles.</span>
              </div>
            </aside>
          </div>
        </section>

        </div>

      </main>

      {lightboxSrc && (
        <div className="lightbox-overlay" onClick={() => setLightboxSrc(null)}>
          <button type="button" className="lightbox-close" aria-label="Close">✕</button>
          <img src={lightboxSrc} alt="" className="lightbox-img" width="512" height="384" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

export default HomePage;
