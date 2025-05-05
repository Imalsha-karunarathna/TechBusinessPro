'use client';
const HowItWorksSection = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Process
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            How Tech Mista Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            A simple process to connect solution providers with businesses in
            need
          </p>
        </div>

        <div className="mt-16">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-primary-500 text-white font-bold flex items-center justify-center text-xl mx-auto">
                1
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">
                Solution Providers Register
              </h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Solution providers create an account and submit their profiles
                and solutions for review.
              </p>
              <div className="hidden lg:block absolute top-0 right-0 h-12 w-full">
                <div className="h-0.5 w-full bg-primary-200 relative top-6 left-6"></div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0 relative">
              <div className="h-12 w-12 rounded-full bg-primary-500 text-white font-bold flex items-center justify-center text-xl mx-auto">
                2
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">
                Solutions Get Approved
              </h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Tech Mista reviews submissions for quality and compliance before
                listing them on the platform.
              </p>
              <div className="hidden lg:block absolute top-0 right-0 h-12 w-full">
                <div className="h-0.5 w-full bg-primary-200 relative top-6 left-6"></div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="h-12 w-12 rounded-full bg-primary-500 text-white font-bold flex items-center justify-center text-xl mx-auto">
                3
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 text-center">
                Businesses Find Solutions
              </h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Clients browse the marketplace to find and connect with the
                solution providers that meet their needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
