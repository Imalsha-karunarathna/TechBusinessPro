'use client';

import Link from 'next/link';
import { Globe, Users, Briefcase } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative pt-16 overflow-hidden">
      <div className="bg-gradient-to-r from-[#3069FE] via-[#42C3EE] to-[#3069FE] text-white relative z-0">
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
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Building{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">
                  Global
                </span>{' '}
                Partnerships
              </h1>
              <p className="mt-6 max-w-md mx-auto lg:mx-0 text-xl text-white text-opacity-90 sm:text-2xl">
                Transforming Vision into Business Success
              </p>

              <div className="mt-8 space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:justify-center lg:justify-start sm:gap-4">
                <Link
                  href="/#solutions"
                  className="group w-full sm:w-auto px-8 py-4 text-center text-base font-semibold rounded-xl text-[#3069FE] bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  Find Solutions
                </Link>

                <Link
                  href="/#partner"
                  className="group w-full sm:w-auto px-8 py-4 text-center text-base font-semibold rounded-xl text-[#3069FE] bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Be a Partner
                </Link>

                <Link
                  href="/agent/register-agent"
                  className="group w-full sm:w-auto px-8 py-4 text-center text-base font-semibold rounded-xl text-[#3069FE] bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  Be an Agent
                </Link>
              </div>
            </div>

            {/* Image section */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white bg-opacity-10 rounded-2xl blur-xs"></div>
                <img
                  className="relative h-96 w-full object-cover rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105"
                  src="https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Global business connections"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
