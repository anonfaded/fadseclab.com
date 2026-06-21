import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  ChevronRight,
  ExternalLink,
  HandCoins,
  Mail,
  MapPin,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { FaDiscord, FaGithub, FaPatreon } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
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

import pilotPicImg from './assets/images/fadcam_sam_rutherford.jpg';

gsap.registerPlugin(ScrollTrigger);

type Theme = 'dark' | 'light';

interface ExternalTarget {
  label: string;
  url: string;
}

interface NavLink {
  href: string;
  label: string;
  id: string;
}

const accountUrl = 'https://id.fadseclab.com';
const fadCamUrl = 'https://fadcam.fadseclab.com';
const githubOrgUrl = 'https://github.com/fadsec-lab';
const githubFounderUrl = 'https://github.com/anonfaded';
const patreonUrl = 'https://patreon.faded.dev';
const discordUrl = 'https://discord.gg/kvAZvdkuuN';
const contactEmail = 'contact@fadseclab.com';

const navLinks: NavLink[] = [
  { href: '#products', label: 'Products', id: 'products' },
  { href: '#services', label: 'Services', id: 'services' },
  { href: '#open-source', label: 'Open source', id: 'open-source' },
  { href: '#mission', label: 'Mission', id: 'mission' },
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

const footerGroups = [
  {
    title: 'Company',
    links: [
      { label: 'Mission', action: 'anchor' as const, target: '#mission' },
      { label: 'Open source', action: 'anchor' as const, target: '#open-source' },
      { label: 'Privacy', action: 'privacy' as const },
      { label: 'Contact', action: 'contact' as const },
    ],
  },
  {
    title: 'Products',
    links: [
      { label: 'FadCam', action: 'external' as const, url: fadCamUrl },
      { label: 'Android apps', action: 'external' as const, url: githubOrgUrl },
      { label: 'Desktop tools', action: 'external' as const, url: githubOrgUrl },
      { label: 'FadSec ID', action: 'external' as const, url: accountUrl },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Native Android', action: 'anchor' as const, target: '#services' },
      { label: 'Native iOS', action: 'anchor' as const, target: '#services' },
      { label: 'Cross-platform', action: 'anchor' as const, target: '#services' },
      { label: 'Desktop apps', action: 'anchor' as const, target: '#services' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Patreon', action: 'external' as const, url: patreonUrl },
      { label: 'Discord', action: 'external' as const, url: discordUrl },
      { label: 'GitHub', action: 'external' as const, url: githubOrgUrl },
      { label: 'Releases', action: 'external' as const, url: `${githubOrgUrl}/fadcam/releases` },
    ],
  },
];

function BrandWordmark() {
  const swapRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const sigilRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);

  // Track hover via the parent brand-lockup
  useEffect(() => {
    const el = swapRef.current?.closest('.brand-lockup');
    if (!el) return;
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Set initial hidden state (instant, no animation)
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    gsap.set(el, { yPercent: 110, filter: 'blur(8px)', opacity: 0 });
  }, []);

  // GSAP: sync sigil + wordmark + target on hover enter/leave
  useEffect(() => {
    const sigil = sigilRef.current;
    const target = targetRef.current;
    const wordmark = swapRef.current?.querySelector<HTMLElement>('.brand-wordmark') ?? null;
    const els = [sigil, target, wordmark].filter((t): t is HTMLElement => t !== null);
    if (els.length === 0) return;

    gsap.killTweensOf(els);

    if (hovered) {
      if (sigil) gsap.to(sigil, { x: 135, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
      if (wordmark) gsap.to(wordmark, { opacity: 0, filter: 'blur(4px)', duration: 0.35, ease: 'power3.out', overwrite: 'auto' });
      gsap.to(target!, { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: 0.45, ease: 'expo.out', overwrite: 'auto' });
    } else {
      if (sigil) gsap.to(sigil, { x: 0, duration: 0.25, ease: 'power3.in', overwrite: 'auto' });
      if (wordmark) gsap.to(wordmark, { opacity: 1, filter: 'blur(0px)', duration: 0.2, ease: 'power3.in', overwrite: 'auto' });
      gsap.to(target!, { yPercent: 110, filter: 'blur(8px)', opacity: 0, duration: 0.25, ease: 'power3.in', overwrite: 'auto' });
    }
  }, [hovered]);

  return (
    <span className="brand-hover-reveal">
      <span ref={sigilRef} className="brand-wordmark-sigil" aria-hidden="true">//</span>
      <span ref={swapRef} className="brand-swap-area">
        <span className="brand-wordmark">
          <span className="brand-wordmark-fadsec">FadSec</span>
          <span className="brand-wordmark-spacer" aria-hidden="true" />
          <span className="brand-wordmark-lab">Lab</span>
        </span>
        <span ref={targetRef} className="brand-hover-target">
          <MapPin size={14} className="brand-pin-icon" />
          <span className="brand-pakistan"><span className="brand-pak">PAK</span><span className="brand-istan">ISTAN</span></span>
        </span>
      </span>
    </span>
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
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, start]);

  return <>{display}{suffix}</>;
}

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

// Tubelight reveal: each word flickers like a fluorescent tube starting up, then stabilises.
// Each word gets rapid on/off cycles (simulating tube ignition), then settles to full clarity.
// Words stagger in sequence for a wave effect — suited to the military-dossier aesthetic.
function TubelightReveal({ text, start, className, staggerDelay = 0.07 }: { text: string; start: boolean; className?: string; staggerDelay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el || !start) return;
    const targets = el.querySelectorAll<HTMLElement>('.tubelight-word');
    if (targets.length === 0) return;

    // Fluorescent tube startup: rapid flickers progressing to steady illumination.
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

// Word-by-word slide-up + unblur. Renders each word in a span, animates in stagger when inView.
function WordReveal({ text, start, className, wordClassName, delay = 0 }: { text: string; start: boolean; className?: string; wordClassName?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el || !start) return;
    const targets = el.querySelectorAll<HTMLElement>('.reveal-word');
    gsap.fromTo(
      targets,
      { yPercent: 110, filter: 'blur(8px)', opacity: 0 },
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

const App: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [pendingNav, setPendingNav] = useState<ExternalTarget | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCountry, setActiveCountry] = useState('');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  const { ref: trustRef, inView: trustInView } = useInView<HTMLDivElement>(0.2);
  const { ref: productRef, inView: productInView } = useInView<HTMLDivElement>(0.2);
  const { ref: missionRef, inView: missionInView } = useInView<HTMLDivElement>(0.2);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Scroll-spy for nav active state + scroll-triggered header
  useEffect(() => {
    const onScroll = () => {
      setHasScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Animate mobile menu items in stagger
  useEffect(() => {
    if (!isMenuOpen) return;
    const items = document.querySelectorAll<HTMLElement>('.mobile-menu .nav-item');
    gsap.fromTo(
      items,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out', delay: 0.1 },
    );
  }, [isMenuOpen]);

  const queueExternalNav = (target: ExternalTarget) => setPendingNav(target);

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    closeMenu();
  };

  const handleFooterLink = (
    link: { label: string; action: string; url?: string; target?: string },
  ) => {
    if (link.action === 'external' && link.url) {
      queueExternalNav({ label: link.label, url: link.url });
    } else if (link.action === 'privacy') {
      setActiveDialog('privacy');
    } else if (link.action === 'contact') {
      setActiveDialog('contact');
    } else if (link.action === 'anchor' && link.target) {
      const el = document.querySelector(link.target);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="site-shell" ref={rootRef}>
      <header className="site-header" data-scrolled={hasScrolled ? 'true' : 'false'}>
        <a className="brand-lockup" href="#home" aria-label="FadSec Lab home" onClick={(e) => handleNavClick(e, '#home')}>
          <BrandWordmark />
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn('nav-link', activeSection === link.id && 'is-active')}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              <span className="nav-sigil">//</span>
              <span className="nav-label">{link.label}</span>
              <span className="nav-underline" aria-hidden="true" />
            </a>
          ))}
          <button
            type="button"
            className="nav-link nav-link--cta"
            onClick={() => setActiveDialog('contact')}
          >
            <span className="nav-sigil">//</span>
            <span className="nav-label">Contact</span>
            <span className="nav-underline" aria-hidden="true" />
          </button>
        </nav>

        <div className="header-actions">
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="theme-toggle"
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
          <button
            type="button"
            className="header-account"
            onClick={() => queueExternalNav({ label: 'FadSec ID', url: accountUrl })}
            aria-label="Open FadSec ID account"
          >
            <span className="header-account-dot" aria-hidden="true" />
            <span className="header-account-text">
              <span className="header-account-eyebrow">FadSec ID</span>
              <span className="header-account-label">Account</span>
            </span>
            <ArrowUpRight />
            <Badge variant="outline" className="header-account-beta">BETA</Badge>
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            className="menu-button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <span className="menu-button-stack" data-open={isMenuOpen}>
              <span />
              <span />
            </span>
          </Button>
        </div>
      </header>

      <div className={cn('mobile-menu', isMenuOpen && 'open')} aria-hidden={!isMenuOpen}>
        <div className="mobile-menu-inner">
          <span className="mobile-menu-eyebrow">// NAVIGATE</span>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-item"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              <span className="nav-sigil">//</span>
              {link.label}
              <ChevronRight />
            </a>
          ))}
          <button
            type="button"
            className="nav-item nav-item--cta"
            onClick={() => { closeMenu(); setActiveDialog('contact'); }}
          >
            <span className="nav-sigil">//</span>
            Contact
            <ChevronRight />
          </button>
          <div className="mobile-menu-foot">
            <button
              type="button"
              className="header-account"
              onClick={() => { closeMenu(); queueExternalNav({ label: 'FadSec ID', url: accountUrl }); }}
            >
              <span className="header-account-dot" aria-hidden="true" />
              <span className="header-account-text">
                <span className="header-account-eyebrow">FadSec ID</span>
                <span className="header-account-label">Account</span>
              </span>
              <ArrowUpRight />
              <Badge variant="outline" className="header-account-beta">BETA</Badge>
            </button>
          </div>
        </div>
      </div>

      <main id="home">
        <section className="hero-section">
          <HeroSignalBackdrop />
          <div className="hero-copy">
            <Badge variant="outline" className="hero-reveal section-badge">
              <ShieldCheck />
              Privacy-first FOSS software company
            </Badge>
            <h1 className="hero-headline">
              <WordReveal text="Privacy today," start={true} delay={0.2} />
              <br />
              <WordReveal text="tomorrow," start={true} delay={0.42} />
              {' '}
              <WordReveal text="forever." start={true} delay={0.42} wordClassName="hero-headline-accent" />
            </h1>
            <p className="hero-reveal hero-lede">
              Open-source Android, iOS, Flutter, and desktop software. Public source, zero hidden tracking, production-grade engineering.
            </p>
            <div className="hero-actions hero-reveal">
              <a href="#services" className={buttonVariants({ size: 'lg', className: 'hero-action' })} onClick={(e) => handleNavClick(e, '#services')}>
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

        <section className="trust-section reveal" aria-label="Users trust us" id="trust" ref={trustRef}>
          <div className="trust-grid">
            <div className="trust-copy">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Users trust us" start={trustInView} /></span>
              <h2 className="trust-headline">
                <TubelightReveal text="A privacy-first company with a global footprint." start={trustInView} />
              </h2>
              <p className="trust-body">
                FadSec Lab products are used by individuals, journalists, security researchers, and small teams across every inhabited continent. They install our software because the source is public, the defaults hold up under audit, and no one is paying us to look the other way.
              </p>
              <div className="trust-metric-strip">
                <article className="trust-metric">
                  <div className="trust-metric-num">
                    <AnimatedNumber value={51} suffix="+" start={trustInView} />
                  </div>
                  <div className="trust-metric-label">Countries</div>
                  <div className="trust-metric-provenance">with active installs across the open-source catalog</div>
                </article>
                <article className="trust-metric">
                  <div className="trust-metric-num">
                    <AnimatedNumber value={150} suffix="K+" start={trustInView} />
                  </div>
                  <div className="trust-metric-label">Users reached</div>
                  <div className="trust-metric-provenance">across all FadSec Lab releases, Play Store and FOSS</div>
                </article>
                <article className="trust-metric">
                  <div className="trust-metric-num trust-metric-num--quiet">
                    <AnimatedNumber value={0} suffix="" start={trustInView} />
                  </div>
                  <div className="trust-metric-label">Hidden trackers</div>
                  <div className="trust-metric-provenance">no third-party SDKs, no analytics, no ad identifiers</div>
                </article>
              </div>
            </div>
            <div className="world-map-card">
              <div className="world-map-head">
                <span className="world-map-eyebrow">// GLOBAL FOOTPRINT</span>
                <span className="world-map-meta">by country</span>
              </div>
              <div className="world-map-frame">
                <ComposableMap projection="geoNaturalEarth1" projectionConfig={{ scale: 145, center: [12, 6] }}>
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
                        aria-label={name}
                        tabIndex={0}
                      />
                      <circle r={12} fill="var(--accent-brand)" opacity={0.14} className="map-dot-ring" />
                      {activeCountry === name && (
                        <foreignObject x={-44} y={-30} width={88} height={22} style={{ overflow: 'visible', pointerEvents: 'none' }}>
                          <span className="map-tooltip">{name}</span>
                        </foreignObject>
                      )}
                    </Marker>
                  ))}
                </ComposableMap>
              </div>
              <div className="world-map-foot">
                <span className="world-map-foot-text">
                  Each marker is a country with active users. Hover or focus to read the country name.
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
            <article className={cn('product-flagship', productInView && 'is-visible')}>
              <div className="product-flagship-meta">
                <Badge variant="destructive">Flagship</Badge>
                <span className="product-flagship-eyebrow">// FADCAM · ANDROID</span>
              </div>
              <div className="product-flagship-body">
                <h3 className="product-flagship-title">FadCam</h3>
                <p className="product-flagship-desc">
                  An open-source camera app that records on device, not into a surveillance pipeline. Privacy defaults that hold under audit, and a public source tree that anyone can read.
                </p>
                <ul className="product-flagship-uses">
                  <li><Camera /><div><b>Documentation.</b><span>Field reports, training material, and product walkthroughs recorded without uploading a frame.</span></div></li>
                  <li><ShieldCheck /><div><b>Personal safety.</b><span>Discreet on-device recording for situations where evidence matters and surveillance does not.</span></div></li>
                  <li><Sparkles /><div><b>Daily journaling.</b><span>Travel logs, life recaps, and family memories kept private by default.</span></div></li>
                </ul>
                <div className="product-flagship-cta">
                  <Button type="button" size="lg" onClick={() => queueExternalNav({ label: 'FadCam', url: fadCamUrl })}>
                    Visit FadCam
                    <ArrowRight />
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={() => queueExternalNav({ label: 'FadCam source', url: githubOrgUrl })}>
                    <FaGithub /> Source on GitHub
                    <ExternalLink />
                  </Button>
                </div>
              </div>
              <figure className="product-flagship-pilot">
                <img src={pilotPicImg} alt="A pilot using FadCam in the cockpit" />
                <figcaption>
                  <span className="pilot-eyebrow">// IN THE FIELD</span>
                  <span className="pilot-caption">FadCam in the cockpit — one of the real-world crews documenting their work with us.</span>
                </figcaption>
              </figure>
            </article>

            <aside className="product-rest reveal">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="The rest of the catalog" start={productInView} /></span>
              <h3 className="product-rest-title">Android apps, desktop tools, and more.</h3>
              <p className="product-rest-body">
                We build a lot more than FadCam. Privacy utilities, secure notes, file tools, a small library of small-but-loved apps. They all live on GitHub under the same banner.
              </p>
              <ul className="product-rest-names">
                <li><span>Fadocx</span><span className="product-rest-tag">android</span></li>
                <li><span>FadeBoard</span><span className="product-rest-tag">android</span></li>
                <li><span>FadCrypt</span><span className="product-rest-tag">android</span></li>
                <li><span>FadCat</span><span className="product-rest-tag">android</span></li>
                <li><span>Fadify</span><span className="product-rest-tag">android</span></li>
                <li><span>FadSec ID</span><span className="product-rest-tag">account</span></li>
              </ul>
              <div className="product-rest-cta">
                <Button type="button" size="lg" onClick={() => queueExternalNav({ label: 'GitHub', url: githubOrgUrl })}>
                  <FaGithub /> See everything on GitHub
                  <ArrowRight />
                </Button>
              </div>
            </aside>
          </div>
        </section>

        <section className="services-section reveal" id="services">
          <div className="services-grid">
            <div className="services-copy">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Services" start={true} /></span>
              <h2>
                <TubelightReveal text="Need a privacy-first app shipped? We do that." start={true} />
              </h2>
              <p>
                We work with founders, security teams, and open-source projects who care about what runs on their users' devices. Every engagement is a working partnership: clean architecture, real engineering review, and code you'll be proud to publish.
              </p>
              <Button type="button" size="lg" onClick={() => setActiveDialog('contact')}>
                Start a conversation
                <Mail />
              </Button>
            </div>

            <div className="services-list">
              <article className="service-row">
                <div className="service-row-head">
                  <h3>Native Android</h3>
                  <span className="service-row-meta">Kotlin · Jetpack · modern SDK</span>
                </div>
                <p>
                  From camera tools to secure file utilities, we build Android apps that respect the platform and the user. Production work for Play Store, sideloaded FOSS, and enterprise rollouts.
                </p>
                <span className="service-row-line" aria-hidden="true" />
              </article>

              <article className="service-row">
                <div className="service-row-head">
                  <h3>Native iOS</h3>
                  <span className="service-row-meta">Swift · SwiftUI · Xcode</span>
                </div>
                <p>
                  First-party Swift and SwiftUI for App Store, TestFlight, and enterprise distribution. Camera, AVFoundation, and on-device ML done the way Apple intends.
                </p>
                <span className="service-row-line" aria-hidden="true" />
              </article>

              <article className="service-row">
                <div className="service-row-head">
                  <h3>Cross-platform Flutter</h3>
                  <span className="service-row-meta">Dart · Riverpod · Material 3</span>
                </div>
                <p>
                  One codebase, real users. iOS, Android, and web from a single Flutter tree with the polish of a native product. We keep it maintainable as the product grows.
                </p>
                <span className="service-row-line" aria-hidden="true" />
              </article>

              <article className="service-row">
                <div className="service-row-head">
                  <h3>Cross-platform desktop</h3>
                  <span className="service-row-meta">Tauri · Electron · Flutter desktop</span>
                </div>
                <p>
                  macOS, Windows, and Linux binaries from a single tree. Tauri for lean native-feeling apps, Electron when the web stack is the right call, Flutter desktop for shared code with mobile.
                </p>
                <span className="service-row-line" aria-hidden="true" />
              </article>

              <div className="services-foot">
                <p>
                  Agentic AI-assisted workflows keep us fast. <b>You ship in 14 days, not 14 weeks.</b> Review, architecture, and security standards never move.
                </p>
                <Button type="button" variant="outline" size="lg" onClick={() => setActiveDialog('contact')}>
                  Email FadSec Lab
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="open-source-section reveal" id="open-source">
          <div className="open-source-grid">
            <div className="open-source-stance">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Open source" start={true} /></span>
              <h2>
                <TubelightReveal text="We work in public, on principle." start={true} />
              </h2>
              <p>
                Privacy is a claim, not a feature. It is only credible when the code is open and the history is visible. Every FadSec Lab project ships with a public repo, public releases, and a public issue tracker. We do not lock downloads behind a marketing site. We do not gate changelogs behind an account. The work has to stand on its own.
              </p>
              <div className="open-source-stats">
                <div className="open-source-stat">
                  <span className="open-source-stat-num">23+</span>
                  <span className="open-source-stat-label">public repositories</span>
                </div>
                <div className="open-source-stat">
                  <span className="open-source-stat-num">2024</span>
                  <span className="open-source-stat-label">building in the open</span>
                </div>
                <div className="open-source-stat">
                  <span className="open-source-stat-num">0</span>
                  <span className="open-source-stat-label">gated downloads</span>
                </div>
              </div>
            </div>
            <div className="open-source-cta">
              <p className="open-source-cta-text">
                Read the source, file an issue, fork a build. That is the point.
              </p>
              <Button type="button" size="lg" onClick={() => queueExternalNav({ label: 'GitHub', url: githubOrgUrl })}>
                <FaGithub />
                Browse GitHub
                <ExternalLink />
              </Button>
            </div>
          </div>
        </section>

        <section className="mission-section reveal" id="mission" ref={missionRef}>
          <div className={cn('mission-grid', missionInView && 'is-visible')}>
            <div className="mission-stance">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Mission" start={missionInView} /></span>
              <h2 className="mission-headline">
                <TubelightReveal text="Surveillance-free technology is a fundamental right." start={missionInView} />
              </h2>
              <p className="mission-lede">
                FadSec Lab was founded with one goal: to give users, and ourselves, full control over the software we run. The base condition for that is Shariah compliance, which we treat as a hard line. We do not track anyone. We do not collect any data. We do not show ads, and we do not earn from ads, surveillance, or privacy invasion of any kind.
              </p>
              <p className="mission-lede">
                That stance is the product. Our part of the bargain is a mission to build solutions where users have the control, where the work runs on hardware the user already owns, and where the native power of that hardware belongs to the user, not to an analytics pipeline. We are working day and night to make surveillance-free technology the default, and to dethrone the mainstream tools that are unethical by design.
              </p>
              <p className="mission-lede">
                We are different on purpose. We work in public, ship open source, and draw strict boundaries. Privacy is not a feature in a list, it is the foundation everything else has to clear. We believe that being free from surveillance is a fundamental right of every person, and we build accordingly.
              </p>
            </div>

            <aside className="mission-donate">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Support the mission" start={missionInView} /></span>
              <h3 className="mission-donate-title">We work in public. Help us keep going.</h3>
              <p className="mission-donate-body">
                FadSec Lab does not run on ads, surveillance, or investor money. We run on the people who believe in the mission and want a private, ethical alternative to the mainstream stack. If our work has earned your support, you can back us on Patreon, or reach out directly for crypto donations.
              </p>
              <div className="mission-donate-actions">
                <Button
                  type="button"
                  size="lg"
                  onClick={() => queueExternalNav({ label: 'Patreon', url: patreonUrl })}
                >
                  <FaPatreon />
                  Back us on Patreon
                  <ExternalLink />
                </Button>
                <a href={`mailto:${contactEmail}?subject=Crypto%20donation%20enquiry`} className="donate-link">
                  <span className="donate-link-icon"><Mail /></span>
                  <span className="donate-link-text">
                    <span className="donate-link-eyebrow">// CRYPTO</span>
                    <span className="donate-link-label">Email for wallet details</span>
                  </span>
                  <ArrowUpRight />
                </a>
                <button
                  type="button"
                  className="donate-link"
                  onClick={() => queueExternalNav({ label: 'Discord', url: discordUrl })}
                >
                  <span className="donate-link-icon"><FaDiscord /></span>
                  <span className="donate-link-text">
                    <span className="donate-link-eyebrow">// COMMUNITY</span>
                    <span className="donate-link-label">Open a ticket on Discord</span>
                  </span>
                  <ArrowUpRight />
                </button>
              </div>
              <div className="mission-donate-foot">
                <HandCoins />
                <span>Every contribution keeps the source open and the defaults private.</span>
              </div>
            </aside>
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
            <DialogDescription>iOS, Android, Flutter, and desktop. Privacy-first from day one.</DialogDescription>
          </DialogHeader>
          <div className="contact-links">
            <a href={`mailto:${contactEmail}`} className="contact-entry">
              <span><Mail /> Mail</span>
              <strong>{contactEmail}</strong>
            </a>
            <button type="button" className="contact-entry" onClick={() => queueExternalNav({ label: 'GitHub', url: githubFounderUrl })}>
              <span><FaGithub /> GitHub</span>
              <strong>github.com/anonfaded</strong>
            </button>
            <button type="button" className="contact-entry" onClick={() => queueExternalNav({ label: 'Discord', url: discordUrl })}>
              <span><FaDiscord /> Discord</span>
              <strong>discord.gg/kvAZvdkuuN</strong>
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
          <div className="footer-manifest">
            <span className="footer-manifest-eyebrow">// SHIP MANIFEST</span>
            <div className="footer-manifest-grid">
              <span><b>23+</b> public repos</span>
              <span><b>51+</b> countries</span>
              <span><b>0</b> hidden trackers</span>
              <span><b>since 2024</b></span>
            </div>
          </div>
          <div className="footer-wordmark-wrap" aria-hidden="true">
            <span className="footer-coord footer-coord--tl">x:0 y:0</span>
            <span className="footer-coord footer-coord--tr">FADCAM.LAB</span>
            <span className="footer-coord footer-coord--bl">REV.2026</span>
            <span className="footer-coord footer-coord--br">x:∞ y:∞</span>
            <span className="footer-corner footer-corner--tl" />
            <span className="footer-corner footer-corner--tr" />
            <span className="footer-corner footer-corner--bl" />
            <span className="footer-corner footer-corner--br" />
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
                  <button key={link.label} type="button" onClick={() => handleFooterLink(link)}>
                    {link.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <div className="footer-brand">
              <span>Privacy today, tomorrow, forever.</span>
            </div>
            <div className="footer-meta">
              <span className="footer-copyright">© 2024–2026 FadSec Lab</span>
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
        </div>
      </footer>
    </div>
  );
};

function HeroSignalBackdrop() {
  return <div className="hero-scene" aria-hidden="true" />;
}

export default App;
