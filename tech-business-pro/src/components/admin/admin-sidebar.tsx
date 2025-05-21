'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Users,
  Briefcase,
  LogOutIcon,
  Award,
  MessageSquare,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Partner Applications',
      href: '/admin/partner-application',
      icon: Briefcase,
    },
    {
      name: 'Expertise Requests',
      href: '/admin/expertise-request',
      icon: Award,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      href: '/admin/request-messages',
      value: 'messages',
    },
    // {
    //   name: 'Settings',
    //   href: '/admin/settings',
    //   icon: Settings,
    // },
  ];
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        window.location.href = '/';
        // router.push("/");
      },
    });
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white p-4">
      <div className="flex-shrink-0 flex items-center">
        <div className="flex items-center cursor-pointer">
          <div className="h-20 w-20 rounded-md flex items-center mx-10 justify-center overflow-hidden">
            <Image
              src="/TechMista_logo.svg"
              alt="Tech Mista Logo"
              width={100}
              height={60}
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="mb-8 px-4 py-3 ">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center px-4 py-3 text-sm rounded-md transition-colors',
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? 'bg-gradient-to-r from-[#3069FE] to-[#42C3EE] text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800',
            )}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 w-52">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center  hover:bg-gradient-to-r from-[#3069FE] to-[#42C3EE]  text-gray-200 cursor-pointer"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOutIcon className="h-4 w-4 mr-1" />

          {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
        </Button>
      </div>
    </div>
  );
}
