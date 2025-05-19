'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ContactProviderModal } from './contact-provider-modal';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface ContactProviderButtonProps {
  providerId: number;
  providerName: string;
}

export function ContactProviderButton({
  providerId,
  providerName,
}: ContactProviderButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      // Redirect to auth page if not logged in
      router.push(`/auth-page?redirect=/providers/${providerId}`);
      return;
    }

    if (user.role === 'solution_provider') {
      // Show toast or alert that providers can't contact other providers
      alert('As a solution provider, you cannot contact other providers.');
      return;
    }

    // Open the contact modal
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600  cursor-pointer text-white"
      >
        <MessageSquare className="h-4 w-4" />
        Contact Provider
      </Button>

      <ContactProviderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        providerId={providerId}
        providerName={providerName}
      />
    </>
  );
}
