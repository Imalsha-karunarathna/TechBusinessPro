const TrustedBySection = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wide">
          Trusted by innovative companies across Australia and Sri Lanka
        </p>
        <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
          {/* These would typically be actual company logos */}
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-12 text-gray-400"
              stroke="currentColor"
            >
              <path
                d="M12 21V12M12 12l-9 1M12 12l9-1M15 5a3 3 0 11-6 0 3 3 0 016 0z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-12 text-gray-400"
              stroke="currentColor"
            >
              <path
                d="M16 8v8m-8-8v8M3 8l18-6v6M3 8v8.3c0 1.7 1.3 3 3 3h12c1.7 0 3-1.3 3-3V8M3 8l18 0"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-12 text-gray-400"
              stroke="currentColor"
            >
              <path
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M9.5 9C9.5 8.5 10 7.5 12 7.5s2.5 1 2.5 1.5c0 .5 0 1-1.5 1.5s-1.5 1-1.5 1.5.5 1 2 1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M12 17v.01"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-12 text-gray-400"
              stroke="currentColor"
            >
              <path
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-12 text-gray-400"
              stroke="currentColor"
            >
              <path
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedBySection;
