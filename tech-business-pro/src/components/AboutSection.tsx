'use client';
import {
  Zap,
  Building,
  Shield,
  TrendingUp,
  Globe,
  Lightbulb,
} from 'lucide-react';

const AboutSection = () => {
  return (
    <div id="about" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="lg:text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800 mb-4">
            About Us
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Our Vision &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Mission
            </span>
          </h2>
          <p className="mt-6 max-w-4xl text-xl text-gray-500 lg:mx-auto leading-relaxed">
            Tech Mista is transforming global collaboration by connecting
            registered and verified system developers, solution providers, and
            businesses in a world-class partnership platform. We empower
            innovation, helping businesses discover breakthrough solutions while
            driving growth. Whether you&apos;re a developer creating
            cutting-edge technology, a company seeking game-changing solutions,
            or an agent looking for strategic earning opportunities, Tech Mista
            is your gateway to success. Join us and be part of a dynamic
            ecosystem where innovation meets opportunity.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start gap-6 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="h-20 w-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Vision</h3>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full my-3"></div>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading global platform that empowers system
                  developers, solution providers, and businesses to collaborate
                  and innovate, bridging the gap between cutting-edge technology
                  and real-world challenges.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start gap-6 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <div className="h-20 w-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building className="h-10 w-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Mission</h3>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full my-3"></div>
                <p className="text-gray-600 leading-relaxed">
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

        <div className="mt-24">
          <div className="lg:text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800 mb-4">
              What We Do
            </span>
            <h3 className="text-3xl font-bold text-gray-900">Our Focus</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-purple-200 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative h-16 w-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Globe className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                Global Connection
              </h3>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Facilitating partnerships between developers and clients
                worldwide.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-purple-200 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative h-16 w-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                Quality Assurance
              </h3>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Ensuring solution providers meet stringent standards for
                quality.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-purple-200 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative h-16 w-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                Comprehensive Services
              </h3>
              <p className="text-gray-600 mt-3 leading-relaxed">
                Offering a wide range of solutions across diverse technology
                needs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-purple-200 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative h-16 w-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                Scalable Growth
              </h3>
              <p className="text-gray-600 mt-3 leading-relaxed">
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
