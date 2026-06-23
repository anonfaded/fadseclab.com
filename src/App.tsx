import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  ChevronRight,
  ExternalLink,
  FileText,
  Heart,
  Keyboard,
  Lock,
  Mail,
  MapPin,
  Monitor,
  Moon,
  Palette,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  User,
} from 'lucide-react';
import { FaAndroid, FaApple, FaDiscord, FaFirefox, FaGithub, FaLinux, FaPatreon, FaWindows } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import Avatar from './components/Avatar/Avatar';
import HeroShield from './components/HeroShield/HeroShield';
import MilitaryLoader from './components/MilitaryLoader/MilitaryLoader';
import PrivacyPage from './PrivacyPage';
import TermsPage from './TermsPage';
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
  { name: 'Russia', coordinates: [90.0, 62.0] },
  { name: 'United Kingdom', coordinates: [-3.4, 55.4] },
  { name: 'France', coordinates: [2.2, 46.6] },
  { name: 'Italy', coordinates: [12.6, 41.9] },
  { name: 'Spain', coordinates: [-3.7, 40.2] },
  { name: 'Saudi Arabia', coordinates: [45.0, 24.0] },
  { name: 'Pakistan', coordinates: [69.3, 30.4] },
  { name: 'India', coordinates: [78.9, 20.6] },
  { name: 'Indonesia', coordinates: [113.9, -0.8] },
  { name: 'China', coordinates: [104.2, 35.9] },
  { name: 'Turkey', coordinates: [35.2, 39.0] },
  { name: 'Poland', coordinates: [19.2, 52.1] },
  { name: 'Germany', coordinates: [10.4, 51.2] },
  { name: 'Sweden', coordinates: [15.0, 62.0] },
  { name: 'Switzerland', coordinates: [7.8, 46.8] },
  { name: 'Greece', coordinates: [22.0, 39.0] },
  { name: 'Malaysia', coordinates: [102.0, 4.0] },
  { name: 'Iraq', coordinates: [44.0, 33.0] },
  { name: 'Bangladesh', coordinates: [90.4, 23.7] },
  { name: 'Vietnam', coordinates: [106.0, 16.0] },
  { name: 'Philippines', coordinates: [122.0, 12.0] },
  { name: 'Bosnia and Herzegovina', coordinates: [17.8, 44.0] },
  { name: 'Nepal', coordinates: [84.0, 28.0] },
  { name: 'Nigeria', coordinates: [8.7, 9.1] },
  { name: 'Brazil', coordinates: [-51.9, -14.2] },
  { name: 'Ireland', coordinates: [-8.2, 53.4] },
  { name: 'Serbia', coordinates: [20.8, 44.0] },
  { name: 'United Arab Emirates', coordinates: [54.0, 24.0] },
  { name: 'Iran', coordinates: [54.0, 32.0] },
  { name: 'Bulgaria', coordinates: [25.0, 42.7] },
  { name: 'Hong Kong SAR China', coordinates: [114.2, 22.3] },
  { name: 'Egypt', coordinates: [30.0, 26.0] },
  { name: 'Japan', coordinates: [138.3, 36.5] },
  { name: 'Singapore', coordinates: [103.8, 1.4] },
  { name: 'Peru', coordinates: [-75.0, -9.2] },
  { name: 'Slovakia', coordinates: [19.5, 48.7] },
  { name: 'South Africa', coordinates: [25.1, -29.0] },
  { name: 'Trinidad & Tobago', coordinates: [-61.2, 10.5] },
  { name: 'Czech Republic', coordinates: [15.4, 49.8] },
  { name: 'Mexico', coordinates: [-100.0, 23.6] },
  { name: 'Canada', coordinates: [-96.8, 56.1] },
  { name: 'Colombia', coordinates: [-73.0, 4.0] },
  { name: 'Hungary', coordinates: [19.0, 47.0] },
  { name: 'Laos', coordinates: [103.0, 18.0] },
  { name: 'South Korea', coordinates: [127.5, 36.5] },
  { name: 'Morocco', coordinates: [-6.0, 32.0] },
  { name: 'Taiwan', coordinates: [121.0, 24.0] },
  { name: 'Argentina', coordinates: [-63.6, -38.4] },
  { name: 'Austria', coordinates: [13.2, 47.5] },
  { name: 'Sri Lanka', coordinates: [80.8, 7.9] },
  { name: 'Australia', coordinates: [133.8, -25.3] },
  { name: 'Romania', coordinates: [25.0, 45.9] },
  { name: 'Ghana', coordinates: [-1.0, 7.9] },
  { name: 'Bolivia', coordinates: [-63.6, -16.3] },
  { name: 'Armenia', coordinates: [45.0, 40.0] },
  { name: 'Algeria', coordinates: [2.6, 28.0] },
  { name: 'Georgia', coordinates: [43.4, 42.3] },
  { name: 'Portugal', coordinates: [-8.0, 39.4] },
  { name: 'Thailand', coordinates: [100.5, 15.9] },
  { name: 'Costa Rica', coordinates: [-84.0, 9.9] },
];

const iconMap = {
  file: <FileText size={14} />,
  lock: <Lock size={14} />,
  heart: <Heart size={14} />,
  github: <FaGithub size={14} />,
  mail: <Mail size={14} />,
  discord: <FaDiscord size={14} />,
  monitor: <Monitor size={12} />,
  android: <FaAndroid size={12} />,
  firefox: <FaFirefox size={12} />,
};

const footerGroups = [
  {
    title: 'Products',
    subsections: [
      {
        label: 'Android',
        icons: ['android' as const],
        links: [
          { label: 'FadCam', action: 'external' as const, url: fadCamUrl },
          { label: 'Fadocx', action: 'external' as const, url: 'https://github.com/anonfaded/Fadocx' },
          { label: 'FadeBoard', action: 'external' as const, url: 'https://github.com/anonfaded/fadeboard' },
        ],
      },
      {
        label: 'Desktop',
        icons: ['monitor' as const],
        links: [
          { label: 'FadCrypt', action: 'external' as const, url: 'https://github.com/anonfaded/FadCrypt' },
          { label: 'FadCat', action: 'external' as const, url: 'https://github.com/anonfaded/FadCat' },
          { label: 'QuranCLI', action: 'external' as const, url: 'https://github.com/anonfaded/wifade' },
        ],
      },
      {
        label: 'Extension',
        icons: ['firefox' as const],
        links: [
          { label: 'Fadify', action: 'external' as const, url: 'https://addons.mozilla.org/en-US/firefox/addon/fadify-from-fadsec-lab/' },
          { label: 'Kali Theme', action: 'external' as const, url: 'https://addons.mozilla.org/en-US/firefox/addon/kali-linux-from-fadsec-lab/' },
        ],
      },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Donation', action: 'external' as const, url: patreonUrl, icon: 'heart' as const },
      { label: 'Privacy Policy', action: 'privacy' as const, icon: 'lock' as const },
      { label: 'Terms of Service', action: 'terms' as const, icon: 'file' as const },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'GitHub', action: 'external' as const, url: githubOrgUrl, icon: 'github' as const },
      { label: 'Email', action: 'email' as const, icon: 'mail' as const },
      { label: 'Discord', action: 'external' as const, url: discordUrl, icon: 'discord' as const },
    ],
  },
];

function BrandWordmark() {
  const swapRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const sigilRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const mounted = useRef(false);

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
    if (!mounted.current) { mounted.current = true; return; }

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
      if (sigil) gsap.to(sigil, { x: 0, duration: 0.35, ease: 'expo.out', overwrite: 'auto' });
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

const App: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCountry, setActiveCountry] = useState('');
  const [mapZoom, setMapZoom] = useState(1);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12, 6]);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<'home' | 'privacy' | 'terms'>(() => {
    const path = window.location.pathname;
    if (path === '/privacy') return 'privacy';
    if (path === '/terms') return 'terms';
    return 'home';
  });
  const scrollPosRef = useRef(0);

  const { ref: trustRef, inView: trustInView } = useInView<HTMLDivElement>(0);
  const { ref: trustMetricsRef1, inView: trustMetrics1 } = useInView<HTMLDivElement>(0);
  const { ref: trustMetricsRef2, inView: trustMetrics2 } = useInView<HTMLDivElement>(0);
  const { ref: trustMetricsRef3, inView: trustMetrics3 } = useInView<HTMLDivElement>(0);
  const { ref: productRef, inView: productInView } = useInView<HTMLDivElement>(0);
  const { ref: servicesRef, inView: servicesInView } = useInView<HTMLDivElement>(0);
  const { ref: openSourceRef, inView: openSourceInView } = useInView<HTMLDivElement>(0);
  const { ref: missionRef, inView: missionInView } = useInView<HTMLDivElement>(0);

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

  // Animate mobile menu items in stagger
  useEffect(() => {
    if (!isMenuOpen) return;
    const items = document.querySelectorAll<HTMLElement>('.mobile-menu .nav-item');
    gsap.fromTo(
      items,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out', delay: 0.1 },
    );
    // mobile-menu-foot animated via CSS
  }, [isMenuOpen]);

  const queueExternalNav = (target: ExternalTarget) => {
    if (target.url) window.open(target.url, '_blank', 'noopener,noreferrer');
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navigateToPage = (p: 'privacy' | 'terms') => {
    closeMenu();
    scrollPosRef.current = window.scrollY;
    history.replaceState(null, '', `/${p}`);
    window.scrollTo(0, 0);
    setPage(p);
  };

  const goHome = () => {
    history.replaceState(null, '', '/');
    setPage('home');
    requestAnimationFrame(() => window.scrollTo(0, scrollPosRef.current));
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    history.replaceState(null, '', href);
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    closeMenu();
  };

  const handleFooterLink = (
    link: { label: string; action: string; url?: string; target?: string; icon?: string },
  ) => {
    if (link.action === 'external' && link.url) {
      queueExternalNav({ label: link.label, url: link.url });
    } else if (link.action === 'email') {
      window.open(`mailto:${contactEmail}`, '_self');
    } else if (link.action === 'terms') {
      navigateToPage('terms');
    } else if (link.action === 'privacy') {
      navigateToPage('privacy');
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

  return page === 'home' ? (
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
              <span className="nav-label">{link.label}</span>
              <span className="nav-underline" aria-hidden="true" />
            </a>
          ))}
          <button
            type="button"
            className="nav-link"
            onClick={() => setActiveDialog('contact')}
          >
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
            <span className="header-account-icon">
              <User size={16} strokeWidth={2} aria-hidden="true" />
            </span>
            <span className="header-account-text">
              <span className="header-account-eyebrow">FadSec ID</span>
              <span className="header-account-label">Account</span>
            </span>
            <ExternalLink />
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
            className="nav-item"
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
              <span className="header-account-icon">
                <User size={16} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="header-account-text">
                <span className="header-account-eyebrow">FadSec ID</span>
                <span className="header-account-label">Account</span>
              </span>
              <ExternalLink />
              <Badge variant="outline" className="header-account-beta">BETA</Badge>
            </button>
            <div className="mobile-menu-pages">
              <button type="button" className="mobile-menu-page-link" onClick={() => { closeMenu(); navigateToPage('privacy'); }}>
                Privacy Policy
              </button>
              <span className="mobile-menu-page-dot">·</span>
              <button type="button" className="mobile-menu-page-link" onClick={() => { closeMenu(); navigateToPage('terms'); }}>
                Terms and Conditions
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <MilitaryLoader onComplete={() => setIsLoading(false)} />
      )}

      <main id="home">
        <section className="hero-section">
          <HeroSignalBackdrop />
          <div className="hero-copy">
            <Badge variant="outline" className="section-badge">
              <ShieldCheck />
              Privacy-first FOSS software company
            </Badge>
            <h1 className="hero-headline">
              <WordReveal text="Privacy today," start={!isLoading} delay={0.2} />
              <br />
              <WordReveal text="tomorrow," start={!isLoading} delay={0.42} />
              {' '}
              <WordReveal text="forever." start={!isLoading} delay={0.42} wordClassName="hero-headline-accent" />
            </h1>
            <p className="hero-lede">
              Anti-adversary, open-source software for Android, iOS, and desktop.<br /> Zero tracking, zero telemetry, production-grade engineering.
            </p>
            <div className="hero-actions">
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
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Users trust us" start={trustInView && !isLoading} /></span>
              <h2 className="trust-headline">
                <TubelightReveal text="A privacy-first company with a global footprint." start={trustInView && !isLoading} />
              </h2>
              <p className="trust-body">
                FadSec Lab products are used by individuals, journalists, security researchers, and small teams across every inhabited continent. They install our software because the source is public, the defaults hold up under audit, and no one is paying us to look the other way.
              </p>
              <div className="trust-metric-strip">
                <article className="trust-metric" ref={trustMetricsRef1}>
                  <div className="trust-metric-num">
                    <AnimatedNumber value={60} suffix="+" start={trustMetrics1 && !isLoading} />
                  </div>
                  <div className="trust-metric-label">Countries</div>
                  <div className="trust-metric-provenance">with active installs across the open-source catalog</div>
                </article>
                <article className="trust-metric" ref={trustMetricsRef2}>
                  <div className="trust-metric-num">
                    <AnimatedNumber value={150} suffix="K+" start={trustMetrics2 && !isLoading} />
                  </div>
                  <div className="trust-metric-label">Users reached</div>
                  <div className="trust-metric-provenance">across all FadSec Lab releases, Play Store and FOSS</div>
                </article>
                <article className="trust-metric" ref={trustMetricsRef3}>
                  <div className="trust-metric-num trust-metric-num--quiet">
                    <AnimatedNumber value={0} suffix="" start={trustMetrics3 && !isLoading} />
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
              <div className="world-map-frame" id="world-map-frame">
                <ComposableMap projection="geoNaturalEarth1" projectionConfig={{ scale: 145, center: [12, 6] }}>
                  <ZoomableGroup
                    center={mapCenter}
                    zoom={mapZoom}
                    minZoom={1}
                    maxZoom={6}
                    onMoveEnd={({ coordinates, zoom }) => {
                      setMapCenter(coordinates as [number, number]);
                      setMapZoom(zoom);
                    }}
                  >
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
                        <g transform={`scale(${(1 / mapZoom).toFixed(4)})`}>
                          <circle
                            r={3.5}
                            fill="var(--accent-brand)"
                            stroke="var(--background)"
                            strokeWidth={1.2}
                            className="map-dot"
                            onMouseEnter={() => setActiveCountry(name)}
                            onMouseLeave={() => setActiveCountry('')}
                            onFocus={() => setActiveCountry(name)}
                            onBlur={() => setActiveCountry('')}
                            aria-label={name}
                            tabIndex={0}
                          />
                          <circle r={8} fill="var(--accent-brand)" opacity={0.14} className="map-dot-ring" />
                        </g>
                      </Marker>
                    ))}
                    {(() => {
                      const active = mapMarkers.find((m) => m.name === activeCountry);
                      if (!active) return null;
                      return (
                        <Marker coordinates={active.coordinates}>
                          <g transform={`scale(${(1 / mapZoom).toFixed(4)})`}>
                            <foreignObject x={-44} y={-30} width={88} height={22} style={{ overflow: 'visible', pointerEvents: 'none' }}>
                              <span className="map-tooltip">{activeCountry}</span>
                            </foreignObject>
                          </g>
                        </Marker>
                      );
                    })()}
                  </ZoomableGroup>
                </ComposableMap>
                <div className="map-zoom-controls">
                  <button
                    type="button"
                    className="map-zoom-btn"
                    aria-label="Zoom in"
                    onClick={() => setMapZoom((z) => Math.min(6, z + 0.8))}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <button
                    type="button"
                    className="map-zoom-btn"
                    aria-label="Zoom out"
                    onClick={() => setMapZoom((z) => Math.max(1, z - 0.8))}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <button
                    type="button"
                    className="map-zoom-btn"
                    aria-label="Reset map"
                    onClick={() => { setMapZoom(1); setMapCenter([12, 6]); }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
                  </button>
                </div>
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
            <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Products" start={productInView && !isLoading} /></span>
            <h2 className="product-section-title">
              <TubelightReveal text="Privacy-first software, shipped in the open." start={productInView && !isLoading} />
            </h2>
            <p className="product-section-lede">
              A focused catalog of native and cross-platform apps, built for people who want full control over what runs on their devices.
            </p>
          </div>

          <div className="product-grid">
            <article className={cn('product-flagship', productInView && !isLoading && 'is-visible')}>
              <div className="product-flagship-meta">
                <Badge variant="default">Flagship</Badge>
                <span className="product-flagship-eyebrow"><FaAndroid size={14} /> ANDROID</span>
              </div>
              <div className="product-flagship-body">
                <h3 className="product-flagship-title">FadCam</h3>
                <p className="product-flagship-desc">
                  Privacy-focused Android multimedia suite: background video recording, dashcam, screen recorder, live streaming and remote camera control — ad-free and open-source.
                </p>
                <ul className="product-flagship-uses">
                  <li><Camera /><div><b>Dashcam & background recording.</b><span>Record video with the screen off. Fragmented MP4 eliminates corruption risk, with auto-splitting at customizable size limits.</span></div></li>
                  <li><ShieldCheck /><div><b>Remote monitoring.</b><span>Live stream your camera over a local network with a web interface. Start and stop recording, toggle the torch, and check battery status from any device.</span></div></li>
                  <li><Sparkles /><div><b>Screen recorder.</b><span>Full-featured capture with annotation tools — pen, eraser, text, and shapes. Multi-layer editing with version control and unlimited undo.</span></div></li>
                </ul>
                <div className="product-flagship-cta">
                  <Button type="button" size="lg" onClick={() => queueExternalNav({ label: 'FadCam', url: fadCamUrl })}>
                    Visit FadCam
                    <ExternalLink />
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={() => queueExternalNav({ label: 'FadCam source', url: githubOrgUrl })}>
                    <FaGithub /> Source on GitHub
                    <ExternalLink />
                  </Button>
                </div>
              </div>
              <figure className="product-flagship-pilot">
                <img src={pilotPicImg} alt="A pilot using FadCam in the cockpit" width="512" height="384" />
                <figcaption>
                  <span className="pilot-eyebrow">// IN THE FIELD</span>
                  <span className="pilot-caption">Over the North Atlantic, flying from Canada to Greenland.</span>
                  <span className="pilot-credit">Photo by <a href="https://neophile.me" target="_blank">Sam Rutherford</a></span>
                </figcaption>
              </figure>
            </article>

            <aside className="product-rest reveal">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Projects" start={productInView && !isLoading} /></span>
              <h3 className="product-rest-title">More from the catalog</h3>
              <p className="product-rest-body">
                Open-source tools for Android, Windows, Linux, and macOS — all built with the same commitment to privacy, transparency, and real user control. No data collection, no telemetry, no exceptions.
              </p>
              <div className="product-rest-table-wrap">
              <table className="product-rest-table">
                <thead>
                  <tr>
                    <th className="product-rest-th--project">Project</th>
                    <th className="product-rest-th--desc">Description</th>
                    <th className="product-rest-th--platforms">Platforms</th>
                    <th className="product-rest-th--link"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="product-rest-row" onClick={() => queueExternalNav({ label: 'Fadocx', url: 'https://github.com/anonfaded/Fadocx' })}>
                    <td className="product-rest-td--project"><span className="product-rest-td--project-inner">
                      <span className="product-rest-link-icon"><FileText size={14} /></span>
                      <span>Fadocx</span>
                    </span></td>
                    <td className="product-rest-td--desc">Android document viewer with OCR — privacy-first, offline-first.</td>
                    <td className="product-rest-td--platforms"><span className="product-rest-td--platforms-inner">
                      <FaAndroid size={13} />
                      <span className="product-rest-soon"><FaApple size={10} /> soon</span>
                    </span></td>
                    <td className="product-rest-td--link"><ExternalLink size={11} /></td>
                  </tr>
                  <tr className="product-rest-row" onClick={() => queueExternalNav({ label: 'FadeBoard', url: 'https://github.com/anonfaded/fadeboard' })}>
                    <td className="product-rest-td--project"><span className="product-rest-td--project-inner">
                      <span className="product-rest-link-icon"><Keyboard size={14} /></span>
                      <span>FadeBoard</span>
                    </span></td>
                    <td className="product-rest-td--desc">Android keyboard that bypasses censorship with special characters.</td>
                    <td className="product-rest-td--platforms"><span className="product-rest-td--platforms-inner">
                      <FaAndroid size={13} />
                    </span></td>
                    <td className="product-rest-td--link"><ExternalLink size={11} /></td>
                  </tr>
                  <tr className="product-rest-row" onClick={() => queueExternalNav({ label: 'FadCrypt', url: 'https://github.com/anonfaded/FadCrypt' })}>
                    <td className="product-rest-td--project"><span className="product-rest-td--project-inner">
                      <span className="product-rest-link-icon"><Lock size={14} /></span>
                      <span>FadCrypt</span>
                    </span></td>
                    <td className="product-rest-td--desc">Windows app encryption — powerful, customizable, and free.</td>
                    <td className="product-rest-td--platforms"><span className="product-rest-td--platforms-inner">
                      <FaWindows size={13} /><FaLinux size={13} />
                      <span className="product-rest-soon"><FaApple size={10} /> soon</span>
                    </span></td>
                    <td className="product-rest-td--link"><ExternalLink size={11} /></td>
                  </tr>
                  <tr className="product-rest-row" onClick={() => queueExternalNav({ label: 'FadCat', url: 'https://github.com/anonfaded/FadCat' })}>
                    <td className="product-rest-td--project"><span className="product-rest-td--project-inner">
                      <span className="product-rest-link-icon"><Terminal size={14} /></span>
                      <span>FadCat</span>
                    </span></td>
                    <td className="product-rest-td--desc">Cross-platform logcat utility with MCP automation support.</td>
                    <td className="product-rest-td--platforms"><span className="product-rest-td--platforms-inner">
                      <FaApple size={13} /><FaWindows size={13} /><FaLinux size={13} />
                    </span></td>
                    <td className="product-rest-td--link"><ExternalLink size={11} /></td>
                  </tr>
                  <tr className="product-rest-row" onClick={() => queueExternalNav({ label: 'Fadify', url: 'https://github.com/anonfaded/Fadify' })}>
                    <td className="product-rest-td--project"><span className="product-rest-td--project-inner">
                      <span className="product-rest-link-icon"><Palette size={14} /></span>
                      <span>Fadify</span>
                    </span></td>
                    <td className="product-rest-td--desc">Firefox add-on for true dark aesthetics and web customization.</td>
                    <td className="product-rest-td--platforms"><span className="product-rest-td--platforms-inner">
                      <FaFirefox size={13} />
                    </span></td>
                    <td className="product-rest-td--link"><ExternalLink size={11} /></td>
                  </tr>
                </tbody>
              </table>
              </div>
              <div className="product-rest-cta">
                <Button type="button" size="lg" onClick={() => queueExternalNav({ label: 'GitHub', url: githubOrgUrl })}>
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
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Services" start={servicesInView && !isLoading} /></span>
              <h2>
                <TubelightReveal text="Ship production-grade apps, on your timeline." start={servicesInView && !isLoading} />
              </h2>
              <p>
                We work with startups, founders, and individual developers to ship full-stack mobile and desktop applications — from native Android and iOS to cross-platform solutions. Clean architecture, maintainable codebases, and AI-assisted workflows — your MVP delivered in 14 days, not months.
              </p>
              <span className="eyebrow"><span className="eyebrow-sigil">//</span> What we offer</span>
            </div>

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
        </section>

        <section className="open-source-section reveal" id="open-source" ref={openSourceRef}>
          <div className="open-source-grid">
            <div className="open-source-stance">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Open source" start={openSourceInView && !isLoading} /></span>
              <h2>
                <TubelightReveal text="Open by default. Auditable by design." start={openSourceInView && !isLoading} />
              </h2>
              <p>
                Privacy is a claim, not a feature. It is only credible when the code is open and the history is visible. Every FadSec Lab project ships with a public repo, public releases, and a public issue tracker. We do not lock downloads behind a marketing site.
              </p>
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
          <div className="mission-grid">
            <div className="mission-stance">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Mission" start={missionInView && !isLoading} /></span>
              <h2 className="mission-headline">
                <TubelightReveal text="Surveillance-free technology is a fundamental right." start={missionInView && !isLoading} />
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
            </div>

            <aside className="mission-donate">
              <span className="eyebrow"><span className="eyebrow-sigil">//</span><TubelightReveal text="Support the mission" start={missionInView && !isLoading} /></span>
              <h3 className="mission-donate-title">Sustained by those who share the mission.</h3>
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
                  onClick={() => queueExternalNav({ label: 'Patreon', url: patreonUrl })}
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
                  onClick={() => queueExternalNav({ label: 'Discord', url: discordUrl })}
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

      <footer className="site-footer">
        <div className="footer-mascot" aria-hidden="true">
          <Avatar simplified={true} />
        </div>
        <div className="footer-panel">
          <div className="footer-top">
            <div className="footer-grid">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <h3>{group.title}</h3>
                  {'subsections' in group ? (
                    <div className="footer-subgrid">
                      {(group as { subsections: { label: string; icons: readonly string[]; links: { label: string; action: string; url?: string }[] }[] }).subsections.map((sub) => (
                        <div key={sub.label} className="footer-subsection">
                          <h4 className="footer-subsection-title">
                            {sub.icons?.map(ic => (
                              <span key={ic} className="footer-subsection-icon">{iconMap[ic as keyof typeof iconMap]}</span>
                            ))}
                            {sub.label}
                          </h4>
                          {sub.links.map(link => (
                            <button key={link.label} type="button" onClick={() => handleFooterLink(link)} className="footer-link-btn">
                              <span className="footer-link-label">{link.label}</span>
                              <ExternalLink size={12} className="footer-ext-icon" />
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    (group as { links: { label: string; action: string; url?: string; target?: string; icon?: string }[] }).links.map((footerLink) => (
                      <button key={footerLink.label} type="button" onClick={() => handleFooterLink(footerLink)} className="footer-link-btn">
                        {footerLink.icon && iconMap[footerLink.icon as keyof typeof iconMap]}
                        <span className="footer-link-label">{footerLink.label}</span>
                        {footerLink.action === 'external' && <ExternalLink size={12} className="footer-ext-icon" />}
                      </button>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="footer-wordmark-wrap" aria-hidden="true">
            <span className="footer-corner footer-corner--tl" />
            <span className="footer-corner footer-corner--tr" />
            <span className="footer-corner footer-corner--bl" />
            <span className="footer-corner footer-corner--br" />
            <div className="footer-wordmark">
              <span className="wm-front">FadSec</span>
              <span className="wm-back">Lab</span>
            </div>
          </div>
          <div className="footer-brand">
            <span>Privacy today, tomorrow, forever.</span>
            <span className="footer-copyright">© 2024–2026 FadSec Lab</span>
          </div>
        </div>
      </footer>
    </div>
  ) : page === 'privacy' ? (
    <PrivacyPage onBack={goHome} />
  ) : (
    <TermsPage onBack={goHome} />
  );
};

function HeroSignalBackdrop() {
  return <div className="hero-scene" aria-hidden="true" />;
}

export default App;
