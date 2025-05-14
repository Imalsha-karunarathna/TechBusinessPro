'use server';

import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { agents } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';
import { db } from '@/db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-chars-long!!',
);

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function registerAgent({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    const existingAgent = await db.query.agents.findFirst({
      where: eq(agents.email, email),
    });

    if (existingAgent) {
      return { success: false, error: 'Email already in use' };
    }

    const hashedPassword = hashPassword(password);

    const [newAgent] = await db
      .insert(agents)
      .values({
        username,
        email,
        password: hashedPassword,
      })
      .returning({ id: agents.id });

    return { success: true, agentId: newAgent.id };
  } catch (error) {
    console.error('Agent registration error:', error);
    return { success: false, error: 'Failed to register agent' };
  }
}

export async function loginAgent({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const agent = await db.query.agents.findFirst({
      where: eq(agents.email, email),
    });

    if (!agent) {
      return { success: false, error: 'Invalid email or password' };
    }

    const hashedPassword = hashPassword(password);
    if (agent.password !== hashedPassword) {
      return { success: false, error: 'Invalid email or password' };
    }

    const token = await new SignJWT({
      agentId: agent.id,
      role: 'agent',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    (await cookies()).set({
      name: 'agent_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
    });

    return { success: true };
  } catch (error) {
    console.error('Agent login error:', error);
    return { success: false, error: 'Failed to login' };
  }
}

export async function getAgentProfile() {
  try {
    const token = (await cookies()).get('agent_token')?.value;

    if (!token) {
      return { success: false, error: 'Not authenticated' };
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload.agentId || payload.role !== 'agent') {
      return { success: false, error: 'Invalid token' };
    }

    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, payload.agentId as string),
      columns: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!agent) {
      return { success: false, error: 'Agent not found' };
    }

    return { success: true, agent };
  } catch (error) {
    console.error('Get agent profile error:', error);
    return { success: false, error: 'Failed to get agent profile' };
  }
}

export async function logoutAgent() {
  (await cookies()).delete('agent_token');
  return { success: true };
}
