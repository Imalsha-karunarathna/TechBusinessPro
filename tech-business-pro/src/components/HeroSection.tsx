"use client";

import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="pt-16">
      <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Building Global Partnerships
              </h1>
              <p className="mt-3 max-w-md mx-auto lg:mx-0 text-xl text-white text-opacity-90 sm:text-2xl">
                Connecting Ambition to Achievement in the Tech World
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-3">
                <Link
                  href="#solutions"
                  className="px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-primary-800 bg-opacity-60 hover:bg-opacity-70 shadow-md"
                >
                  Find Solutions
                </Link>
                <Link
                  href="#partner"
                  className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-800 bg-opacity-60 hover:bg-opacity-70 shadow-md"
                >
                  Become a Partner
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                className="h-96 w-full object-cover rounded-lg shadow-xl"
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Global business connections"
                width={800}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
