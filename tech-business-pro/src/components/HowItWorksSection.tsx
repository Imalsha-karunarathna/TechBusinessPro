'use client';
import { ArrowRight, UserPlus, ShieldCheck, Handshake } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white  ">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800 mb-4">
            Process
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            How Tech Mista{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Works
            </span>
          </h2>
          <p className="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
            A simple process to connect solution providers with businesses in
            need
          </p>
        </div>

        <div className="mt-20 relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-purple-200 via-blue-200 to-purple-200 transform -translate-y-1/2 rounded-full"></div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-16 items-stretch">
            {[1, 2, 3].map((step, index) => {
              const stepInfo = [
                {
                  icon: <UserPlus className="h-8 w-8 text-purple-600" />,
                  bg: 'bg-purple-100',
                  title: 'Solution Providers Register',
                  text: 'Solution providers create an account and submit their profiles and solutions for review.',
                },
                {
                  icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
                  bg: 'bg-blue-100',
                  title: 'Solutions Get Approved',
                  text: 'Tech Mista reviews submissions for quality and compliance before listing them on the platform.',
                },
                {
                  icon: <Handshake className="h-8 w-8 text-green-600" />,
                  bg: 'bg-green-100',
                  title: 'Businesses Find Solutions',
                  text: 'Clients browse the marketplace to find and connect with the solution providers that meet their needs.',
                },
              ][index];

              return (
                <div
                  key={step}
                  className="relative mb-16 lg:mb-0 transform transition-all duration-500 hover:scale-105 h-full flex flex-col"
                >
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center justify-center text-2xl shadow-lg">
                      {step}
                    </div>
                  </div>
                  <div className="pt-14 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full">
                    <div className="p-8 flex flex-col flex-grow">
                      <div
                        className={`h-16 w-16 ${stepInfo.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                      >
                        {stepInfo.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                        {stepInfo.title}
                      </h3>
                      <p className="text-gray-600 text-center leading-relaxed flex-grow">
                        {stepInfo.text}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-t border-gray-100"></div>
                  </div>
                  {step !== 3 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="bg-white rounded-full p-2 shadow-md">
                        <ArrowRight className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
