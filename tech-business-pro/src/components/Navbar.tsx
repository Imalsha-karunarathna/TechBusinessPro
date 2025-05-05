'use client';

import { Search, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = '/';
        // router.push("/");
      },
    });
  };

  return (
    <nav className="fixed top-0 bg-white shadow w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
                    <span className="text-white bg-blue-500 rounded-lg p-1 font-bold text-lg">
                      TM
                    </span>
                  </div>
                  <span className="ml-2 text-xl font-semibold text-gray-800">
                    Tech Mista
                  </span>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <span
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Home
                </span>
              </Link>
              <Link href="/#about">
                <span className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  About
                </span>
              </Link>
              <Link href="/#solutions">
                <span className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Solutions
                </span>
              </Link>
              <Link href="/#partner">
                <span className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Partners
                </span>
              </Link>
              <Link href="/#blog">
                <span className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Blog
                </span>
              </Link>
              <Link href="/#contact">
                <span className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Contact
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/#partner">
              <Button className="bg-primary-500 hover:bg-primary-600 text-white">
                Join Us
              </Button>
            </Link>

            <div className="ml-3 relative">
              <button className="text-gray-500 hover:text-gray-700 px-3 py-2">
                <Search className="h-6 w-6" />
              </button>
            </div>

            {user ? (
              <div className="ml-3 flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-1 rounded-full">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {user.username}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-500"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
                </Button>
              </div>
            ) : (
              <Link href="/auth-page">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-3 flex items-center hover:bg-purple-600 cursor-pointer border-transparent"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Log in
                </Button>
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <span
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive('/')
                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                Home
              </span>
            </Link>
            <Link href="/#about">
              <span className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                About
              </span>
            </Link>
            <Link href="/#solutions">
              <span className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Solutions
              </span>
            </Link>
            <Link href="/#partner">
              <span className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Partners
              </span>
            </Link>
            <Link href="/#blog">
              <span className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Blog
              </span>
            </Link>
            <Link href="/#contact">
              <span className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Contact
              </span>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {/* Partner button */}
            <Link href="/#partner">
              <span className="block px-4 py-2 mb-2 text-center bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md">
                Join Us
              </span>
            </Link>

            {/* Auth buttons */}
            {user ? (
              <div className="px-4 py-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-gray-100 p-1 rounded-full">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </div>
                </div>
                <button
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
                </button>
              </div>
            ) : (
              <Link href="/auth-page">
                <span className="block px-4 py-2 text-center border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <span className="flex justify-center items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Log in / Register
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
