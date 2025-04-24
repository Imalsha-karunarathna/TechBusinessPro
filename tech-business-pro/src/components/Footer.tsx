import { Facebook, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="h-10 w-10 bg-primary-500 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TM</span>
                </div>
                <span className="ml-3 text-xl font-bold">Tech Mista</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Connecting Ambition to Achievement in the technology world across
              Sri Lanka, Australia, and beyond.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Solutions
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Website Development
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  IT Security
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  CRM Implementation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Business Applications
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="#about"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#blog"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#partner"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Partners
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white text-sm"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Tech Mista. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-400">
              Phase One: Sri Lanka and Australia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
