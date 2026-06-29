import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronRight,
  ExternalLink,
  FileText,
  Heart,
  Lock,
  Mail,
  MapPin,
  Monitor,
  Moon,
  Rss,
  Smartphone,
  Sun,
  User,
} from 'lucide-react';
import { FaAndroid, FaApple, FaDiscord, FaFirefox, FaGithub } from 'react-icons/fa6';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useNavigate, useLocation, Outlet, ScrollRestoration } from 'react-router-dom';
import { AppContext } from '@/lib/app-context';
import { openExternal } from '@/lib/external-nav';
import Avatar from './components/Avatar/Avatar';
import MilitaryLoader from './components/MilitaryLoader/MilitaryLoader';
import './App.css';

gsap.registerPlugin();

type Theme = 'dark' | 'light';

interface NavLink {
  href: string;
  label: string;
  id: string;
}

interface RouteLink {
  href: string;
  label: string;
}

const accountUrl = 'https://id.fadseclab.com';
const githubOrgUrl = 'https://github.com/fadsec-lab';
const githubFounderUrl = 'https://github.com/anonfaded';
const discordUrl = 'https://discord.gg/kvAZvdkuuN';
const fadCamUrl = 'https://fadcam.fadseclab.com';
const patreonUrl = 'https://patreon.faded.dev';
const contactEmail = 'contact@fadseclab.com';

const navLinks: NavLink[] = [
  { href: '#products', label: 'Products', id: 'products' },
  { href: '#services', label: 'Services', id: 'services' },
  { href: '#mission', label: 'Mission', id: 'mission' },
];

const routeLinks: RouteLink[] = [
  { href: '/blog', label: 'Blog' },
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
  apple: <FaApple size={12} />,
  mobile: <Smartphone size={12} />,
  rss: <Rss size={14} />,
};

const footerGroups = [
  {
    title: 'Products',
    subsections: [
      {
        label: 'Mobile',
        icons: ['mobile' as const],
        groups: [
          {
            label: 'Android',
            icon: 'android' as const,
            links: [
              { label: 'FadCam', action: 'external' as const, url: fadCamUrl },
              { label: 'Fadocx', action: 'external' as const, url: 'https://github.com/anonfaded/Fadocx' },
              { label: 'FadeBoard', action: 'external' as const, url: 'https://github.com/anonfaded/fadeboard' },
            ],
          },
          {
            label: 'iOS',
            icon: 'apple' as const,
            links: [
              { label: 'FadCam', action: 'external' as const, url: 'https://apps.apple.com/us/app/fadcam-dashcam-bodycam/id6778121848' },
            ],
          },
        ],
      },
      {
        label: 'Desktop',
        icons: ['monitor' as const],
        links: [
          { label: 'QuranCLI', action: 'external' as const, url: 'https://github.com/anonfaded/wifade' },
          { label: 'FadCrypt', action: 'external' as const, url: 'https://github.com/anonfaded/FadCrypt' },
          { label: 'FadCat', action: 'external' as const, url: 'https://github.com/anonfaded/FadCat' },
          { label: 'Wifade', action: 'external' as const, url: 'https://github.com/anonfaded/wifade' },
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
      { label: 'Blog (RSS)', action: 'external' as const, url: '/rss.xml', icon: 'rss' as const },
      { label: 'Donation', action: 'external' as const, url: patreonUrl, icon: 'heart' as const },
      { label: 'Privacy Policy', action: 'privacy' as const, icon: 'lock' as const },
      { label: 'Terms of Service', action: 'terms' as const, icon: 'file' as const },
      { label: '★ Stars', action: 'badge' as const, url: 'https://github.com/fadsec-lab/.github' },
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

const App: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection] = useState<string>('home');
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [consentAccepted, setConsentAccepted] = useState(() => {
    return localStorage.getItem('fadsec-consent') === 'accepted';
  });

  const acceptConsent = () => {
    localStorage.setItem('fadsec-consent', 'accepted');
    setConsentAccepted(true);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Disable browser scroll restoration so our manual scroll control works
  useEffect(() => {
    history.scrollRestoration = 'manual';
    return () => { history.scrollRestoration = 'auto'; };
  }, []);

  // Scroll-spy for nav active state + scroll-triggered header
  useEffect(() => {
    const onScroll = () => {
      setHasScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    // If not on home page, navigate there first then scroll
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
    closeMenu();
  };

  const handleFooterLink = (
    link: { label: string; action: string; url?: string; target?: string; icon?: string },
  ) => {
    if (link.action === 'external' && link.url) {
      openExternal(link.url);
    } else if (link.action === 'email') {
      window.open(`mailto:${contactEmail}`, '_self');
    } else if (link.action === 'terms') {
      navigate('/terms');
    } else if (link.action === 'privacy') {
      navigate('/privacy');
    } else if (link.action === 'contact') {
      setActiveDialog('contact');
    } else if (link.action === 'anchor' && link.target) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.querySelector(link.target!);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 100);
      } else {
        const el = document.querySelector(link.target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <AppContext.Provider value={{ activeDialog, setActiveDialog, lightboxSrc, setLightboxSrc }}>
    <div className="site-shell" ref={rootRef}>
      <header className="site-header" data-scrolled={hasScrolled ? 'true' : 'false'}>
        <a className="brand-lockup" href="#home" aria-label="FadSec Lab home" onClick={(e) => handleNavClick(e, '#home')}>
          <BrandWordmark />
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          {[
            ...navLinks.map((link) => ({ ...link, as: 'a' as const })),
            ...routeLinks.map((link) => ({ ...link, as: 'button' as const })),
          ].map((item, i, arr) => (
            <React.Fragment key={item.href}>
              {item.as === 'a' ? (
                <a
                  href={item.href}
                  className={cn('nav-link', activeSection === item.id && 'is-active')}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-underline" aria-hidden="true" />
                </a>
              ) : (
                <button
                  type="button"
                  className={cn('nav-link', location.pathname.startsWith(item.href) && 'is-active')}
                  onClick={() => navigate(item.href)}
                >
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-underline" aria-hidden="true" />
                </button>
              )}
              {i < arr.length - 1 && (
                <span className="nav-sep" aria-hidden="true">·</span>
              )}
            </React.Fragment>
          ))}
          <span className="nav-sep" aria-hidden="true">·</span>
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
            onClick={() => openExternal(accountUrl)}
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
          {routeLinks.map((link) => (
            <button
              key={link.href}
              type="button"
              className="nav-item"
              onClick={() => { closeMenu(); navigate(link.href); }}
            >
              <span className="nav-sigil">//</span>
              {link.label}
              <ChevronRight />
            </button>
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
              onClick={() => { closeMenu(); openExternal(accountUrl); }}
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
              <button type="button" className="mobile-menu-page-link" onClick={() => { closeMenu(); navigate('/privacy'); }}>
                Privacy Policy
              </button>
              <span className="mobile-menu-page-dot">·</span>
              <button type="button" className="mobile-menu-page-link" onClick={() => { closeMenu(); navigate('/terms'); }}>
                Terms and Conditions
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <MilitaryLoader onComplete={() => setIsLoading(false)} />
      )}

      <ScrollRestoration />
      <Outlet />

      <Dialog open={activeDialog === 'contact'} onOpenChange={(open) => { if (!open) setActiveDialog(null); }}>
        <DialogContent className="dialog-surface">
          <DialogHeader>
            <DialogTitle>Contact</DialogTitle>
            <DialogDescription>Reach out through any of these channels.</DialogDescription>
          </DialogHeader>
          <div className="contact-links">
            <a href={`mailto:${contactEmail}`} className="contact-entry">
              <span><Mail /> Mail</span>
              <strong>{contactEmail}</strong>
            </a>
            <button type="button" className="contact-entry" onClick={() => openExternal(githubFounderUrl)}>
              <span><FaGithub /> GitHub</span>
              <strong>github.com/anonfaded</strong>
            </button>
            <button type="button" className="contact-entry" onClick={() => openExternal(discordUrl)}>
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
                      {(group as { subsections: { label: string; icons: readonly string[]; links?: { label: string; action: string; url?: string }[]; groups?: { label: string; icon?: string; links: { label: string; action: string; url?: string }[] }[] }[] }).subsections.map((sub) => (
                        <div key={sub.label} className="footer-subsection">
                          <h4 className="footer-subsection-title">
                            {sub.icons?.map(ic => (
                              <span key={ic} className="footer-subsection-icon">{iconMap[ic as keyof typeof iconMap]}</span>
                            ))}
                            {sub.label}
                          </h4>
                          {sub.groups ? (
                            sub.groups.map((grp) => (
                              <div key={grp.label} className="footer-subsection-group">
                                <h5 className="footer-subsection-subtitle">
                                  {grp.icon && iconMap[grp.icon as keyof typeof iconMap]}
                                  <span>{grp.label}</span>
                                </h5>
                                {grp.links.map(link => (
                                  <button key={link.label} type="button" onClick={() => handleFooterLink(link)} className="footer-link-btn">
                                    <span className="footer-link-label">{link.label}</span>
                                    <ExternalLink size={12} className="footer-ext-icon" />
                                  </button>
                                ))}
                              </div>
                            ))
                          ) : (
                            sub.links?.map(link => (
                              <button key={link.label} type="button" onClick={() => handleFooterLink(link)} className="footer-link-btn">
                                <span className="footer-link-label">{link.label}</span>
                                <ExternalLink size={12} className="footer-ext-icon" />
                              </button>
                            ))
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    (group as { links: { label: string; action: string; url?: string; target?: string; icon?: string }[] }).links.map((footerLink) => (
                      footerLink.action === 'badge' ? (
                        <a key={footerLink.label} href={footerLink.url!} target="_blank" rel="noopener noreferrer" className="footer-link-btn footer-star-badge">
                          <img
                            src="https://img.shields.io/github/stars/fadsec-lab/.github?style=social&label=%E2%98%85%20Stars"
                            alt="GitHub stars"
                            className="github-stars-img"
                          />
                        </a>
                      ) : (
                        <button key={footerLink.label} type="button" onClick={() => handleFooterLink(footerLink)} className="footer-link-btn">
                          {footerLink.icon && iconMap[footerLink.icon as keyof typeof iconMap]}
                          <span className="footer-link-label">{footerLink.label}</span>
                          {footerLink.action === 'external' && <ExternalLink size={12} className="footer-ext-icon" />}
                        </button>
                      )
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
            <span className="footer-copyright">© 2024–2026 FadSec Lab <span className="footer-flag">🇵🇰</span></span>
          </div>
        </div>
      </footer>

      {!consentAccepted && (
        <div className="consent-banner">
          <div className="consent-banner-body">
            <span className="consent-banner-text">
              By continuing, you agree to our{' '}
              <button type="button" className="consent-link" onClick={() => { closeMenu(); navigate('/privacy'); }}>Privacy Policy</button>
              {' '}and{' '}
              <button type="button" className="consent-link" onClick={() => { closeMenu(); navigate('/terms'); }}>Terms of Service</button>.
            </span>
            <button type="button" className="consent-accept" onClick={acceptConsent}>
              Accept
            </button>
          </div>
        </div>
      )}

    </div>
    </AppContext.Provider>
  );
};

export default App;
