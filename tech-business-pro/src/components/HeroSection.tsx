'use client';

import Link from 'next/link';

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
                Transforming Vision into Business Success
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4 flex-wrap">
                <Link
                  href="#solutions"
                  className="w-full sm:w-auto px-6 py-3 text-center text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:scale-105"
                >
                  Find Solutions for your business
                </Link>
                <Link
                  href="#partner"
                  className="w-full sm:w-auto px-6 py-3 text-center text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:scale-105"
                >
                  Become a Partner to reach global opportunities
                </Link>
                <Link
                  href="/agent/register-agent"
                  className="w-full sm:w-auto px-6 py-3 text-center text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:scale-105"
                >
                  Become an Agent
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="hidden lg:block">
              <img
                className="h-96 w-full object-cover rounded-lg shadow-xl"
                src="https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
