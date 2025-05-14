'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Briefcase, Settings, PieChart } from 'lucide-react';
import Link from 'next/link';
import { getAgentProfile } from '@/app/actions/agent-auth';

interface AgentProfile {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export default function AgentDashboard() {
  const router = useRouter();
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const result = await getAgentProfile();
        if (result.success && result.agent) {
          setAgent(result.agent);
        } else {
          router.push('/agent/login');
        }
      } catch (error) {
        console.error('Failed to fetch agent profile:', error);
        router.push('/agent/login');
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/agent/logout', { method: 'POST' });
      router.push('/agent/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Agent Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                {agent.username.substring(0, 1).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold">{agent.username}</h2>
              <p className="text-gray-500 text-sm">{agent.email}</p>
              <p className="text-gray-400 text-xs mt-1">
                Agent since {new Date(agent.createdAt).toLocaleDateString()}
              </p>
            </div>

            <nav className="space-y-1">
              <Link
                href="/agent/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700"
              >
                <PieChart className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/agent/profile"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <User className="mr-3 h-5 w-5" />
                Profile
              </Link>
              <Link
                href="/agent/opportunities"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Briefcase className="mr-3 h-5 w-5" />
                Opportunities
              </Link>
              <Link
                href="/agent/settings"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </nav>
          </div>

          {/* Main content */}
          <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">
                Welcome back, {agent.username}!
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">
                    Opportunities
                  </h3>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-800 mb-1">
                    Connections
                  </h3>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-1">
                    Earnings
                  </h3>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Get Started</h3>
                <p className="text-gray-600 mb-4">
                  Complete your profile and start connecting with global
                  opportunities
                </p>
                <Link
                  href="/agent/profile"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Complete Your Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
