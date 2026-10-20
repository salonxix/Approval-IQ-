import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth';
import { useLanguage } from '../i18n';
import { LanguageSwitcher } from '../Layout';

export function Navbar({
  onOpenDemo,
  onOpenCommandPalette,
}: {
  onOpenDemo?: () => void;
  onOpenCommandPalette?: () => void;
}): JSX.Element {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();
  const navLinks = [
    { label: t('nav.product', 'Product'), href: '#how-it-works', route: '/#how-it-works' },
    { label: t('nav.business_map', 'Business Map'), href: '/business-map', route: '/business-map' },
    { label: t('nav.about', 'About'), href: '/about', route: '/about' },
    { label: t('nav.contact', 'Contact'), href: '/contact', route: '/contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { href: string; route: string }) => {
    if (link.href.startsWith('/')) {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      void navigate(link.route);
      return;
    }
    e.preventDefault();
    const targetEl = document.querySelector(link.href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    } else {
      setIsMobileMenuOpen(false);
      void navigate(link.route);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 select-none ${
        isScrolled
          ? 'bg-black/25 backdrop-blur-xl shadow-lg py-2.5'
          : 'bg-transparent py-3.5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-teal-400 to-ocean-600 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:scale-105 transition-all duration-300">
              ▲
            </div>
            <span className="font-editorial text-xl font-bold tracking-tight text-white">
              Approval<span className="bg-gradient-to-r from-cyan-300 to-teal-200 bg-clip-text text-transparent">IQ</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                {link.label}
              </a>
            ))}

            {/* Direct Demo Trigger */}
            <button
              type="button"
              onClick={onOpenDemo}
              className="text-xs font-mono font-medium text-cyan-300 hover:text-white px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 transition-all cursor-pointer shadow-sm"
              title="Interactive Clearance Simulation"
            >
              [Demo Access]
            </button>

            {/* Quick ⌘K Command Palette */}
            {onOpenCommandPalette && (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-[#06242E]/70 text-cyan-300 hover:text-white hover:bg-[#093542] transition-colors text-xs font-mono shadow-sm cursor-pointer"
                title="Open Command Palette (⌘K)"
              >
                <span>⌘K</span>
              </button>
            )}
          </nav>

          {/* Right Action Center */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="text-white">
              <LanguageSwitcher />
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/projects"
                  className="tactile-btn px-4 py-2 text-xs font-bold rounded-xl text-slate-950 bg-cyan-300 hover:bg-white shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all"
                >
                  <span>Dockets Desk →</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    void navigate('/login');
                  }}
                  className="tactile-btn px-3 py-1.5 text-xs text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                  title="Sign out of ApprovalIQ"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('nav.logout', 'Sign Out')}</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="tactile-btn px-4 py-2 text-xs font-bold rounded-xl text-slate-950 bg-gradient-to-r from-cyan-300 to-teal-200 hover:from-white hover:to-cyan-200 border border-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
              >
                {t('nav.login', 'Sign In')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-xs text-white bg-white/10 border border-white/20 rounded-xl"
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="mt-3 p-4 bg-[#041B23]/95 backdrop-blur-2xl md:hidden border border-cyan-500/30 rounded-2xl shadow-2xl space-y-3 animate-fade-in-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="text-xs font-semibold text-slate-200 py-2 border-b border-cyan-900/40 uppercase hover:text-cyan-300"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenDemo?.();
                }}
                className="text-xs font-mono font-bold text-cyan-300 text-left py-2 border-b border-cyan-900/40"
              >
                [Demo Access]
              </button>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-300 to-teal-200 rounded-xl shadow-md"
              >
                {t('nav.login', 'Sign In')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
