import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Layers3,
  Mail,
  Menu,
  Moon,
  ShieldCheck,
  Smartphone,
  Sun,
  X,
} from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { ChartContainer, ChartValue } from '@/components/ui/chart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import Avatar from './components/Avatar/Avatar';
import HeroShield from './components/HeroShield/HeroShield';
import TransitionOverlay from './components/ui/TransitionOverlay';
import './App.css';

import fadCamIconImg from './assets/images/fadcam_landscape_icon.png';
import pilotImg from './assets/images/fadcam_sam_rutherford.jpg';
import flagImg from './assets/images/fadseclab_flag.png';

gsap.registerPlugin(ScrollTrigger);

type Theme = 'dark' | 'light';

interface ExternalTarget {
  label: string;
  url: string;
}

interface Metric {
  value: number;
  suffix: string;
  label: string;
  note: string;
  progress: number;
  trend: string;
  chart: 'area' | 'bars' | 'gauge' | 'zero';
  data: number[];
}

const accountUrl = 'https://id.fadseclab.com';
const fadCamUrl = 'https://fadcam.fadseclab.com';
const githubOrgUrl = 'https://github.com/fadsec-lab';
const githubFounderUrl = 'https://github.com/anonfaded';
const cnnUrl = 'https://edition.cnn.com/2026/04/12/middleeast/us-iran-war-propellor-plane-intl-hnk-ml-dst';

const metrics: Metric[] = [
  { value: 150, suffix: 'K+', label: 'Users trust us', note: 'privacy-first products used globally', progress: 92, trend: 'Community adoption', chart: 'area', data: [18, 28, 42, 57, 74, 96, 122, 150] },
  { value: 0, suffix: '', label: 'Hidden trackers', note: 'no surveillance by default', progress: 100, trend: 'Privacy baseline', chart: 'zero', data: [0, 0, 0, 0, 0, 0] },
];

const services = [
  {
    title: 'Native Android development',
    text: 'Java and Kotlin apps for privacy utilities, camera tools, security workflows, and production Android products.',
    icon: Smartphone,
  },
  {
    title: 'Flutter app development',
    text: 'Cross-platform apps with clean UI systems, fast iteration, and long-term maintainability.',
    icon: Layers3,
  },
  {
    title: 'AI-assisted engineering',
    text: 'Agentic development workflows that speed up implementation while keeping review, architecture, and security standards intact.',
    icon: Bot,
  },
];

const footerGroups = [
  { title: 'Company', links: ['About', 'Open source', 'Privacy', 'Contact'] },
  { title: 'Products', links: ['FadCam', 'Android apps', 'Desktop tools', 'FadSec ID'] },
  { title: 'Services', links: ['Android', 'Flutter', 'Architecture', 'AI workflows'] },
  { title: 'Developers', links: ['GitHub', 'Docs', 'Releases', 'Community'] },
];

const mapMarkers: { name: string; coordinates: [number, number] }[] = [
  { name: 'United States', coordinates: [-98.5, 39.5] },
  { name: 'Brazil', coordinates: [-51.9, -14.2] },
  { name: 'United Kingdom', coordinates: [-3.4, 55.4] },
  { name: 'Pakistan', coordinates: [69.3, 30.4] },
  { name: 'India', coordinates: [78.9, 20.6] },
  { name: 'Indonesia', coordinates: [113.9, -0.8] },
  { name: 'Australia', coordinates: [133.8, -25.3] },
  { name: 'Germany', coordinates: [10.4, 51.2] },
  { name: 'Nigeria', coordinates: [8.7, 9.1] },
  { name: 'Canada', coordinates: [-96.8, 56.1] },
  { name: 'Japan', coordinates: [138.3, 36.5] },
  { name: 'South Africa', coordinates: [25.1, -29.0] },
];

function HeroSignalBackdrop() {
  return (
    <div className="hero-scene" aria-hidden="true" />
  );
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
      /* easeOutExpo for snappy count-up */
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, start]);

  return <>{display}{suffix}</>;
}

function StatChart({ metric, isVisible }: { metric: Metric; isVisible: boolean }) {
  const max = Math.max(...metric.data, 1);
  const points = metric.data
    .map((value, index) => {
      const x = (index / Math.max(metric.data.length - 1, 1)) * 100;
      const y = 72 - (value / max) * 64;
      return `${x},${y}`;
    })
    .join(' ');

  if (metric.chart === 'bars') {
    return (
      <ChartContainer className="stat-chart stat-chart--bars">
        {metric.data.map((value, index) => (
          <span key={index} style={{ height: `${22 + (value / max) * 68}%` }} />
        ))}
      </ChartContainer>
    );
  }

  if (metric.chart === 'gauge') {
    return (
      <ChartContainer className="stat-chart stat-chart--gauge">
        <svg viewBox="0 0 160 80" role="img" aria-label={`${metric.label} gauge`}>
          <path d="M20 72a60 60 0 0 1 120 0" />
          <path d="M20 72a60 60 0 0 1 120 0" pathLength={100} style={{ strokeDasharray: `${metric.progress} 100` }} />
          <circle cx="80" cy="72" r="4" />
        </svg>
      </ChartContainer>
    );
  }

  if (metric.chart === 'zero') {
    return (
      <ChartContainer className={`stat-chart stat-chart--zero${isVisible ? ' is-visible' : ''}`}>
        <div className="zero-line" />
        <span>no telemetry</span>
      </ChartContainer>
    );
  }

  const lastIdx = metric.data.length - 1;
  const firstPt = { y: 72 - (metric.data[0] / max) * 64 };
  const lastPt = { y: 72 - (metric.data[lastIdx] / max) * 64 };

  return (
    <div className={`stat-chart stat-chart--area${isVisible ? ' is-visible' : ''}`}>
      <div className="stat-chart-graph">
        <svg viewBox="0 0 100 80" preserveAspectRatio="none" role="img" aria-label={`${metric.label} trend`}>
          <defs>
            <linearGradient id="stat-area-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-brand)" stopOpacity="0.36" />
              <stop offset="100%" stopColor="var(--accent-brand)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,80 ${points} 100,80`} />
          <polyline points={points} />
        </svg>
        <div className="stat-chart-dot stat-chart-dot--start" style={{ left: '0%', top: `${(firstPt.y / 80) * 100}%` }} />
        <div className="stat-chart-dot stat-chart-dot--end" style={{ left: '100%', top: `${(lastPt.y / 80) * 100}%` }} />
      </div>
      <div className="stat-chart-axis">
        <span>2024</span>
        <span>2026</span>
      </div>
    </div>
  );
}

function StatSignal({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="stat-signal" ref={ref}>
      <div className="stat-signal-header">
        <span>{metric.label}</span>
      </div>
      <div className="stat-signal-body">
        <ChartValue>
          <AnimatedNumber value={metric.value} suffix={metric.suffix} start={visible} />
        </ChartValue>
        <p>{metric.note}</p>
      </div>
      <StatChart metric={metric} isVisible={visible} />
      <Badge variant="outline" className="stat-trend">{metric.trend}</Badge>
    </div>
  );
}

const App: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [pendingNav, setPendingNav] = useState<ExternalTarget | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCountry, setActiveCountry] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power3.out',
      });

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 24,
          opacity: 0,
          duration: 0.62,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const queueExternalNav = (target: ExternalTarget) => {
    setPendingNav(target);
  };

  const executeExternalNav = () => {
    const target = pendingNav;

    if (target?.url) {
      setTransitionTarget(target.label);
      setIsTransitioning(true);
      setPendingNav(null);
      setTimeout(() => {
        window.open(target.url, '_blank', 'noopener,noreferrer');
        setIsTransitioning(false);
        setTransitionTarget('');
      }, 520);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="site-shell" ref={rootRef}>
      <header className="site-header">
        <a className="brand-lockup" href="#home" aria-label="FadSec Lab home">
          <span>FadSec Lab</span>
          <img src={flagImg} alt="" />
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#products">Products</a>
          <a href="#services">Services</a>
          <a href="#open-source">Open source</a>
          <button type="button" onClick={() => setActiveDialog('contact')}>Contact</button>
        </nav>

        <div className="header-actions">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="header-account"
            onClick={() => queueExternalNav({ label: 'FadSec ID', url: accountUrl })}
          >
            Account
            <ArrowUpRight />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="menu-button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      <div className={cn('mobile-menu', isMenuOpen && 'open')} aria-hidden={!isMenuOpen}>
        <a href="#products" onClick={closeMenu}>Products</a>
        <a href="#services" onClick={closeMenu}>Services</a>
        <a href="#open-source" onClick={closeMenu}>Open source</a>
        <button type="button" onClick={() => { closeMenu(); setActiveDialog('contact'); }}>Contact</button>
      </div>

      <main id="home">
        <section className="hero-section">
          <HeroSignalBackdrop />
          <div className="hero-copy">
            <Badge variant="outline" className="hero-reveal section-badge">
              <ShieldCheck />
              Privacy-first FOSS software company
            </Badge>
            <h1 className="hero-reveal">
              Privacy today,<br />
              tomorrow, <span>forever.</span>
            </h1>
            <p className="hero-reveal hero-lede">
              FadSec Lab builds open-source Android, desktop, and security software with public source code, zero hidden tracking, and production-grade engineering.
            </p>
            <div className="hero-actions hero-reveal">
              <a href="#services" className={buttonVariants({ size: 'lg', className: 'hero-action' })}>
                Explore services
                <ArrowRight />
              </a>
              <Button type="button" variant="outline" size="lg" className="hero-action" onClick={() => setActiveDialog('contact')}>
                Discuss a project
                <Mail />
              </Button>
            </div>
            <HeroShield />
          </div>
        </section>

        <div className="content-wrap">

        <section className="proof-section reveal" aria-label="Company proof">
          <div className="metric-band">
            {metrics.map((metric) => (
              <StatSignal key={metric.label} metric={metric} />
            ))}
          </div>
          <div className="mini-map-card">
            <div className="mini-map-text">
              <Badge variant="secondary"><Globe2 /> Global reach</Badge>
              <div className="map-stat-row">
                <div className="map-stat-left">
                  <div className="map-stat-value">
                    <span className="map-stat-number">51</span>
                    <span className="map-stat-suffix">+</span>
                  </div>
                  <span className="map-stat-label">Countries</span>
                </div>
                <div className="map-bars">
                  <span style={{ height: '22%' }} />
                  <span style={{ height: '34%' }} />
                  <span style={{ height: '46%' }} />
                  <span style={{ height: '58%' }} />
                  <span style={{ height: '70%' }} />
                  <span style={{ height: '82%' }} />
                  <span style={{ height: '100%' }} />
                </div>
              </div>
              <p>Open-source tools that reach users without growth hacks, surveillance funnels, or locked-in accounts.</p>
            </div>
            <div className="world-map-container" aria-label="Interactive FadSec Lab userbase map">
              <ComposableMap projection="geoNaturalEarth1" projectionConfig={{ scale: 130, center: [20, 8] }}>
                <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        style={{
                          default: { fill: 'var(--map-land)', stroke: 'var(--map-border)', strokeWidth: 0.45, outline: 'none' },
                          hover: { fill: 'var(--map-land-hover)', outline: 'none' },
                          pressed: { fill: 'var(--map-land-hover)', outline: 'none' },
                        }}
                      />
                    ))
                  }
                </Geographies>
                {mapMarkers.map(({ name, coordinates }) => (
                  <Marker key={name} coordinates={coordinates}>
                    <circle
                      r={5}
                      fill="var(--accent-brand)"
                      stroke="var(--background)"
                      strokeWidth={1.4}
                      className="map-dot"
                      onMouseEnter={() => setActiveCountry(name)}
                      onMouseLeave={() => setActiveCountry('')}
                      onFocus={() => setActiveCountry(name)}
                      onBlur={() => setActiveCountry('')}
                      tabIndex={0}
                    />
                    <circle r={12} fill="var(--accent-brand)" opacity={0.14} className="map-dot-ring" />
                    {activeCountry === name && (
                      <foreignObject x={-40} y={-28} width={80} height={22} style={{ overflow: 'visible', pointerEvents: 'none' }}>
                        <span className="map-tooltip">{name}</span>
                      </foreignObject>
                    )}
                  </Marker>
                ))}
              </ComposableMap>
            </div>
          </div>
        </section>

        <section className="product-section reveal" id="products">
          <div className="product-copy">
            <Badge variant="destructive">Flagship Android product</Badge>
            <div className="product-title-row">
              <img src={fadCamIconImg} alt="" />
              <div>
                <h2>FadCam</h2>
                <p>Open-source camera app for local recording, privacy-first workflows, and zero hidden data collection.</p>
              </div>
            </div>
            <ul className="product-points">
              <li><CheckCircle2 /> Records on device, not into a surveillance pipeline.</li>
              <li><CheckCircle2 /> Public source code and practical privacy defaults.</li>
              <li><CheckCircle2 /> A pilot-recorded series using FadCam received CNN coverage.</li>
            </ul>
            <div className="section-actions">
              <Button type="button" size="lg" onClick={() => queueExternalNav({ label: 'FadCam', url: fadCamUrl })}>
                Visit FadCam
                <ArrowRight />
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => queueExternalNav({ label: 'CNN coverage', url: cnnUrl })}>
                Press mention
                <ExternalLink />
              </Button>
            </div>
          </div>
          <div className="product-media">
            <img src={pilotImg} alt="FadCam used from a private plane cockpit" />
          </div>
        </section>

        <section className="open-source-section reveal" id="open-source">
          <div>
            <span className="eyebrow">Open-source portfolio</span>
            <h2>23+ projects across Android, desktop, and privacy tooling.</h2>
          </div>
          <p>
            Main product websites stay focused, while GitHub keeps source, releases, and project history visible for developers and privacy-conscious users.
          </p>
          <Button type="button" variant="outline" size="lg" onClick={() => queueExternalNav({ label: 'GitHub', url: githubOrgUrl })}>
            <FaGithub />
            Browse GitHub
          </Button>
        </section>

        <section className="services-section reveal" id="services">
          <div className="services-copy">
            <span className="eyebrow">Services</span>
            <h2>Need privacy-first app development?</h2>
            <p>
              We help founders, teams, and open-source projects build Android, Flutter, and AI-assisted product workflows with clean architecture from day one.
            </p>
            <Button type="button" size="lg" onClick={() => setActiveDialog('contact')}>
              Email FadSec Lab
              <Mail />
            </Button>
          </div>
          <div className="service-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article className="service-card" key={service.title}>
                  <Icon />
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        </div>

      </main>

      <Dialog open={activeDialog === 'privacy'} onOpenChange={(open) => { if (!open) setActiveDialog(null); }}>
        <DialogContent className="dialog-surface">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>Zero data collection is the baseline for FadSec Lab products.</DialogDescription>
          </DialogHeader>
          <div className="dialog-stack">
            <p>FadSec Lab products avoid collecting personal data unless a specific service clearly requires user-provided information.</p>
            <p>We do not use hidden analytics, sell user data, or design product flows around surveillance.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === 'contact'} onOpenChange={(open) => { if (!open) setActiveDialog(null); }}>
        <DialogContent className="dialog-surface">
          <DialogHeader>
            <DialogTitle>Work with FadSec Lab</DialogTitle>
            <DialogDescription>Android, Flutter, architecture, and privacy-first product engineering.</DialogDescription>
          </DialogHeader>
          <div className="contact-links">
            <a href="mailto:contact@fadseclab.com" className="contact-entry">
              <span><Mail /> Mail</span>
              <strong>contact@fadseclab.com</strong>
            </a>
            <button type="button" className="contact-entry" onClick={() => queueExternalNav({ label: 'GitHub', url: githubFounderUrl })}>
              <span><FaGithub /> GitHub</span>
              <strong>github.com/anonfaded</strong>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pendingNav} onOpenChange={(open) => { if (!open) setPendingNav(null); }}>
        <DialogContent className="dialog-surface nav-confirm">
          <DialogHeader>
            <DialogTitle>Open {pendingNav?.label}</DialogTitle>
            <DialogDescription>This external page opens in a new browser tab.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPendingNav(null)}>Cancel</Button>
            <Button type="button" onClick={executeExternalNav}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TransitionOverlay isVisible={isTransitioning} targetName={transitionTarget} />

      <footer className="site-footer">
        <div className="footer-mascot" aria-hidden="true">
          <Avatar />
        </div>
        <div className="footer-panel">
          <div className="footer-wordmark-wrap" aria-hidden="true">
            <div className="footer-wordmark">
              <span className="wm-front">FadSec</span>
              <span className="wm-back">Lab</span>
            </div>
          </div>
          <div className="footer-grid">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                {group.links.map((link) => (
                  <button key={link} type="button" onClick={() => link === 'Contact' ? setActiveDialog('contact') : undefined}>
                    {link}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <div className="footer-brand">
              <img src={flagImg} alt="FadSec Lab" />
              <span>Privacy today, tomorrow, forever.</span>
            </div>
            <div className="footer-links">
              <Button type="button" variant="ghost" size="sm" onClick={() => queueExternalNav({ label: 'GitHub', url: githubOrgUrl })}>
                <FaGithub />
                GitHub
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setActiveDialog('privacy')}>
                Privacy
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
