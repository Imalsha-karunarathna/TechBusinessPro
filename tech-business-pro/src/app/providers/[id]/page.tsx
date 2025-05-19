import { getProviderById } from '@/app/actions/provider-actions';
import { ContactProviderButton } from '@/components/contact-provider/contact-provider-button';
import { notFound } from 'next/navigation';

type ProviderPageParams = {
  params: Promise<{ id: string }>;
};

export default async function ProviderDetailPage({
  params,
}: ProviderPageParams) {
  const paramsValue = await params;
  const providerId = Number.parseInt(paramsValue.id);
  const result = await getProviderById(providerId);

  if (!result.success || !result.data) {
    notFound();
  }

  const provider = result.data;

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg ">
          {/* Provider Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
            <div className="flex items-center">
              {provider.logo_url ? (
                <div className="h-24 w-24 rounded-lg border-4 border-white shadow-md">
                  <img
                    src={provider.logo_url || '/placeholder.svg'}
                    alt={provider.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md">
                  {provider.name?.charAt(0)}
                </div>
              )}
              <div className="ml-6">
                <h1 className="text-3xl font-bold">{provider.name}</h1>
                {provider.verification_status === 'approved' && (
                  <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg
                      className="h-4 w-4 mr-1.5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Verified Provider
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Provider Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-gray-700">{provider.description}</p>
                </div>

                {provider.regions_served &&
                  provider.regions_served.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Regions Served
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {provider.regions_served.map((region, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                          >
                            {region.charAt(0).toUpperCase() + region.slice(1)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    {provider.website && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">
                          Website
                        </span>
                        <a
                          href={
                            provider.website.startsWith('http')
                              ? provider.website
                              : `https://${provider.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {provider.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    )}
                    {provider.email && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">
                          Email
                        </span>
                        <span>{provider.email}</span>
                      </div>
                    )}
                    {provider.phone && (
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-1">
                          Phone
                        </span>
                        <span>{provider.phone}</span>
                      </div>
                    )}
                    <div className="pt-4">
                      <ContactProviderButton
                        providerId={provider.id}
                        providerName={provider.name}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
