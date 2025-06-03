import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm py-2">
        <div className="max-w-5xl mx-auto px-4 flex justify-center md:justify-center">
          <Image
            src="/TechMista_logo.svg"
            alt="TechMista Logo"
            width={180}
            height={50}
            className="h-auto"
          />
        </div>
      </header>

      <div className="max-w-5xl mx-auto py-5 px-4">
        <div className="text-center mb-5">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-gray-600 inline-block border-b-2 border-[#3069FE] pb-1">
            Effective Date: 01 Jun 2015
          </p>
        </div>

        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="bg-[#3069FE] h-1"></div>
          <CardContent className="p-8 md:p-10">
            {/* Introduction */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-[#3069FE] h-8 w-1 mr-4 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  1. Introduction
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed pl-5 border-l border-gray-200">
                Welcome to Tech Mista. We are committed to protecting your
                privacy and ensuring the security of your personal information.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your data when you use our web application.
              </p>
            </section>

            <Separator className="my-10" />

            {/* Information We Collect */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <div className="bg-[#3069FE] h-8 w-1 mr-4 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  2. Information We Collect
                </h2>
              </div>
              <div className="pl-5 border-l border-gray-200">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We may collect the following types of information:
                </p>
                <ul className="space-y-5">
                  <li className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <span className="font-semibold text-[#3069FE] block mb-1">
                      Personal Information
                    </span>
                    <p className="text-gray-700">
                      Name, email address, phone number, billing details, and
                      any other data you provide voluntarily.
                    </p>
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <span className="font-semibold text-[#3069FE] block mb-1">
                      Usage Data
                    </span>
                    <p className="text-gray-700">
                      Information about how you interact with our web
                      application, such as IP address, browser type, device
                      information, and cookies.
                    </p>
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <span className="font-semibold text-[#3069FE] block mb-1">
                      Communications
                    </span>
                    <p className="text-gray-700">
                      Any correspondence between you and Tech Mista, including
                      inquiries and feedback.
                    </p>
                  </li>
                </ul>
              </div>
            </section>

            <Separator className="my-10" />

            {/* How We Use Your Information */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-[#3069FE] h-8 w-1 mr-4 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  3. How We Use Your Information
                </h2>
              </div>
              <div className="pl-5 border-l border-gray-200">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We use your data for purposes such as:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-[#3069FE] h-3 w-3 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p>Providing and improving our services.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-[#3069FE] h-3 w-3 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p>Personalising user experience.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-[#3069FE] h-3 w-3 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p>
                      Responding to customer inquiries and support requests.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-[#3069FE] h-3 w-3 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p>
                      Sending notifications, updates, and promotional content
                      (with consent).
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-[#3069FE] h-3 w-3 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p>Ensuring security and fraud prevention.</p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-10" />

            {/* Data Sharing & Disclosure */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-[#3069FE] h-8 w-1 mr-4 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  4. Data Sharing {'&'} Disclosure
                </h2>
              </div>
              <div className="pl-5 border-l border-gray-200">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We do not sell or rent your personal information. However, we
                  may share data in the following cases:
                </p>
                <ul className="space-y-5">
                  <li className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <span className="font-semibold text-[#3069FE] block mb-1">
                      Legal Compliance
                    </span>
                    <p className="text-gray-700">
                      If required by law or legal proceedings.
                    </p>
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <span className="font-semibold text-[#3069FE] block mb-1">
                      Business Partners
                    </span>
                    <p className="text-gray-700">
                      Trusted third parties assisting in service delivery.
                    </p>
                  </li>
                  <li className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <span className="font-semibold text-[#3069FE] block mb-1">
                      Security Measures
                    </span>
                    <p className="text-gray-700">
                      To detect, prevent, or address security threats.
                    </p>
                  </li>
                </ul>
              </div>
            </section>

            <Separator className="my-10" />

            {/* Data Security */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-[#3069FE] h-8 w-1 mr-4 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  5. Data Security
                </h2>
              </div>
              <div className="pl-5 border-l border-gray-200">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We implement industry-standard security measures to protect
                  your information. However, no method of transmission over the
                  internet or electronic storage is 100% secure.
                </p>
              </div>
            </section>

            {/* Your Rights &amp; Choices */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-[#3069FE] h-8 w-1 mr-4 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  6. Your Rights &amp; Choices
                </h2>
              </div>
              <div className="pl-5 border-l border-gray-200">
                <p className="text-gray-700 leading-relaxed mb-6">
                  You have the right to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-[#3069FE] h-3 w-3 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p>Access, update, or delete your personal information.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-[#3069FE] h-3 w-3 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p>Opt out of marketing communications.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start">
                    <div className="bg-[#3069FE] h-3 w-3 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <p>Restrict certain data processing activities.</p>
                  </div>
                </div>
              </div>
            </section>

            <Separator className="my-10" />

            {/* Third Party Links */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-[#3069FE] h-8 w-1 mr-4 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  7. Third Party Links
                </h2>
              </div>
              <div className="pl-5 border-l border-gray-200">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Our web application may contain links to third party websites.
                  We are not responsible for their privacy policies or
                  practices.
                </p>
              </div>
            </section>

            <Separator className="my-10" />

            {/* Changes to this Privacy Policy */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-[#3069FE] h-8 w-1 mr-4 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  8. Changes to this Privacy Policy
                </h2>
              </div>
              <div className="pl-5 border-l border-gray-200">
                <p className="text-gray-700 leading-relaxed mb-6">
                  We may update this policy periodically. Significant changes
                  will be communicated through appropriate channels.
                </p>
              </div>
            </section>

            <Separator className="my-10" />

            {/* Contact Us */}
            <section className="mb-12">
              <div className="flex items-center mb-6">
                <div className="bg-[#3069FE] h-8 w-1 mr-4 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  9. Contact Us
                </h2>
              </div>
              <div className="pl-5 border-l border-gray-200">
                <p className="text-gray-700 leading-relaxed mb-6">
                  If you have any questions or concerns, please contact us at:
                  info@techmista.com.au
                </p>
              </div>
            </section>
          </CardContent>
        </Card>

        {/* Copyright */}
        <footer className="mt-10 text-center">
          <div className="inline-block border-t border-gray-300 pt-4 px-10">
            <p className="text-gray-600">
              © 2025 Tech Mista. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
