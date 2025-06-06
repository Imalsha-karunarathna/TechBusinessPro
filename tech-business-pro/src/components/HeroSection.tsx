'use client';

import Link from 'next/link';
import { Globe, Users, Briefcase } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-200 to-gray-200">
      <div className="bg-gradient-to-r from-[#3069FE] via-[#3069FE] to-[#42C3EE] text-white relative z-0">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text section */}
            <div className="text-center lg:text-left ">
              <h1 className="text-4xl tracking-tight sm:text-5xl md:text-6xl font-bold">
                Digital{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">
                  Excellence
                </span>{' '}
                Through Global Partnerships
              </h1>
              <p className="mt-6 max-w-md mx-auto lg:mx-0 text-xl text-white text-opacity-90 sm:text-2xl">
                Transforming Vision into Business Success
              </p>

              <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:justify-center lg:justify-start sm:gap-4">
                <Link
                  href="/#solutions"
                  className="group w-full sm:w-auto px-3 py-4 text-center text-base  rounded-xl bg-gradient-to-r from-white/20 to-white/30 text-white backdrop-blur-sm border border-white/30 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 hover:-translate-y-1 flex items-center justify-center relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/5 group-hover:bg-white/15 transition-all duration-300"></span>
                  <span className="relative flex items-center">
                    <Globe className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                    Find Solutions
                  </span>
                </Link>

                <Link
                  href="/#partner"
                  className="group w-full sm:w-auto px-3 py-4 text-center text-base  rounded-xl bg-gradient-to-r from-white/20 to-white/30 text-white backdrop-blur-sm border border-white/30 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 hover:-translate-y-1 flex items-center justify-center relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/5 group-hover:bg-white/15 transition-all duration-300"></span>
                  <span className="relative flex items-center">
                    <Users className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                    Be a Partner
                  </span>
                </Link>

                <Link
                  href="/agent/register-agent"
                  className="group w-full sm:w-auto px-3 py-4 text-center text-base  rounded-xl bg-gradient-to-r from-white/20 to-white/30 text-white backdrop-blur-sm border border-white/30 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 hover:-translate-y-1 flex items-center justify-center relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/5 group-hover:bg-white/15 transition-all duration-300"></span>
                  <span className="relative flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                    Be an Agent
                  </span>
                </Link>
              </div>
            </div>

            {/* Image section */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl blur-xs"></div>
                <img
                  className="relative h-100 w-full object-cover rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105"
                  src="../assets/hero.jpg"
                  alt="hero image"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-0 border-none outline-none bg-transparent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#F9FAFB"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              stroke="none"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
