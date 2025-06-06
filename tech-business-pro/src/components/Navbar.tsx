'use client';

import { LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';

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
    <nav className="fixed top-0 bg-gray-800 text-white shadow w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center justify-between h-16 w-full">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <div className="h-20 w-20 rounded-md flex items-center justify-center overflow-hidden">
                    <Image
                      src="/TechMista_logo.svg"
                      alt="Tech Mista Logo"
                      width={100}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <span
                  className={`border-transparent text-[#3069FE] hover:border-gray-300 hover:text-[#3069FE] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/')
                      ? 'border-primary-500 text-white'
                      : 'border-transparent text-[#3069FE] hover:border-gray-300 hover:text-[#3069FE]'
                  }`}
                >
                  Home
                </span>
              </Link>
              <Link href="/#about">
                <span className="border-transparent text-white hover:border-gray-300 hover:text-[#3069FE] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  About
                </span>
              </Link>
              <Link href="/#solutions">
                <span className="border-transparent text-white hover:border-gray-300 hover:text-[#3069FE] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Solutions
                </span>
              </Link>
              <Link href="/#partner">
                <span className="border-transparent text-white hover:border-gray-300 hover:text-[#3069FE] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Partners
                </span>
              </Link>
              {/* <Link href="/#blog">
                <span className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Blog
                </span>
              </Link> */}
              <Link href="/#contact">
                <span className="border-transparent text-white hover:border-gray-300 hover:text-[#3069FE] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Contact
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* <div className="ml-3 relative">
              <button className="text-gray-500 hover:text-gray-700 px-3 py-2">
                <Search className="h-6 w-6" />
              </button>
            </div> */}

            {user ? (
              <div className="ml-3 flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-1 rounded-full">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-400">
                    {user.username}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-8 py-4 gap-2 text-white bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:from-[#42C3EE] hover:to-[#3069FE] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
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
                  className="px-8 py-4 gap-2 text-white bg-gradient-to-r from-[#3069FE] to-[#42C3EE] hover:from-[#42C3EE] hover:to-[#3069FE] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
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
            {/* <Link href="/#blog">
              <span className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Blog
              </span>
            </Link> */}
            <Link href="/#contact">
              <span className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Contact
              </span>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-black">
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
                    Log in
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
