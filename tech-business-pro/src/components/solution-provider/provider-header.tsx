'use client';

import { useAuth } from '@/lib/auth';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ProviderHeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providerData?: any;
}

export function ProviderHeader({ providerData }: ProviderHeaderProps) {
  const { user } = useAuth();

  // const handleLogout = () => {
  //   logoutMutation.mutate();
  // };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Provider Dashboard
        </h1>
        {providerData && (
          <p className="text-sm text-gray-500">
            {providerData.name || 'Complete your profile'}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {providerData?.verification_status && (
          <Badge
            variant="outline"
            className={
              providerData.verification_status === 'approved'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }
          >
            {providerData.verification_status === 'approved'
              ? 'Verified Provider'
              : 'Verification Pending'}
          </Badge>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="bg-gray-100 p-1 rounded-full">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium">{user?.username}</span>
              {/* <ChevronDown className="h-4 w-4 text-gray-500" /> */}
            </Button>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </div>
    </header>
  );
}
