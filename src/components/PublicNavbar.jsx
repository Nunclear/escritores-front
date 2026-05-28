import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EditorialButton } from './EditorialButton';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-surface border-b border-cream sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="font-serif text-2xl font-bold text-coffee hover:text-sand transition-colors"
            >
              Escritores
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/explore"
                className="text-text-secondary hover:text-coffee transition-colors font-sans text-sm"
              >
                Explorar
              </Link>
              <Link
                to="/explore"
                className="text-text-secondary hover:text-coffee transition-colors font-sans text-sm"
              >
                Autores
              </Link>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <EditorialButton
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
              >
                Iniciar sesión
              </EditorialButton>
              <EditorialButton
                variant="primary"
                size="sm"
                onClick={() => navigate('/register')}
              >
                Comenzar a escribir
              </EditorialButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-text-primary hover:text-coffee transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-3 border-t border-cream pt-4">
              <Link
                to="/explore"
                className="block text-text-secondary hover:text-coffee transition-colors font-sans text-sm py-2"
              >
                Explorar
              </Link>
              <Link
                to="/explore"
                className="block text-text-secondary hover:text-coffee transition-colors font-sans text-sm py-2"
              >
                Autores
              </Link>
              <div className="space-y-2 pt-2 border-t border-cream">
                <EditorialButton
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Iniciar sesión
                </EditorialButton>
                <EditorialButton
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Comenzar a escribir
                </EditorialButton>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
