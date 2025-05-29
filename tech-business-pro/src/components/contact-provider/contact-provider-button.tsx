'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { ContactProviderModal } from './contact-provider-modal';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { checkExistingContactRequest } from '@/app/actions/contact-provider-action';
import { toast } from 'sonner';

interface ContactProviderButtonProps {
  providerId: number;
  providerName: string;
}

export function ContactProviderButton({
  providerId,
  providerName,
}: ContactProviderButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = async () => {
    if (!user) {
      // Redirect to auth page if not logged in
      router.push(`/auth-page?redirect=/providers/${providerId}`);
      return;
    }

    if (user.role === 'solution_provider') {
      // Show toast that providers can't contact other providers
      toast('Access Restricted', {
        description:
          'As a solution provider, you cannot contact other providers.',
      });
      return;
    }

    setIsChecking(true);

    try {
      const result = await checkExistingContactRequest(user.id, providerId);

      if (result.success && result.exists) {
        toast('Request Already Exists', {
          description:
            'You already have a pending request with this provider. Please wait for their response.',
        });
        return;
      }

      // Open the contact modal
      setIsModalOpen(true);
      /*eslint-disable @typescript-eslint/no-unused-vars */
    } catch (error) {
      toast('Error', {
        description: 'Failed to check existing requests. Please try again.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isChecking}
        className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 cursor-pointer text-white"
      >
        <MessageSquare className="h-4 w-4" />
        {isChecking ? 'Checking...' : 'Contact Provider'}
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
