"use client";
import { Zap, Building, Shield, TrendingUp } from "lucide-react";

const AboutSection = () => {
  return (
    <div id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            About Us
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Our Vision & Mission
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Tech Mista aims to empower system developers, solution providers,
            and businesses to collaborate and innovate.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="relative bg-white p-6 rounded-lg shadow">
              <div className="absolute -top-4 -left-4 h-16 w-16 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-medium text-gray-900">Vision</h3>
                <p className="mt-2 text-gray-600">
                  To be the leading global platform that empowers system
                  developers, solution providers, and businesses to collaborate
                  and innovate, bridging the gap between cutting-edge technology
                  and real-world challenges.
                </p>
              </div>
            </div>

            <div className="relative bg-white p-6 rounded-lg shadow">
              <div className="absolute -top-4 -left-4 h-16 w-16 bg-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-medium text-gray-900">Mission</h3>
                <p className="mt-2 text-gray-600">
                  Tech Mista provides a seamless ecosystem where system
                  developers and solution providers can showcase their
                  capabilities, connect with clients worldwide, and address
                  business needs through tailored consultations and
                  technology-driven solutions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="lg:text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900">Our Focus</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-lg shadow card-hover">
              <div className="text-accent-500 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Global Connection</h3>
              <p className="text-gray-600 mt-2">
                Facilitating partnerships between developers and clients
                worldwide.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow card-hover">
              <div className="text-accent-500 mb-4">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="font-semibold text-lg">Quality Assurance</h3>
              <p className="text-gray-600 mt-2">
                Ensuring solution providers meet stringent standards for
                quality.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow card-hover">
              <div className="text-accent-500 mb-4">
                <Building className="h-10 w-10" />
              </div>
              <h3 className="font-semibold text-lg">Comprehensive Services</h3>
              <p className="text-gray-600 mt-2">
                Offering a wide range of solutions across diverse technology
                needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow card-hover">
              <div className="text-accent-500 mb-4">
                <TrendingUp className="h-10 w-10" />
              </div>
              <h3 className="font-semibold text-lg">Scalable Growth</h3>
              <p className="text-gray-600 mt-2">
                Building sustainable growth through innovative subscription
                models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
