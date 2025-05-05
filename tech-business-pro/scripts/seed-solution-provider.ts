import { hash } from 'bcrypt';
import { db } from '@/db';
import { users } from '@/lib/db/tables/users';
import { solutionProviders } from '@/lib/db/schema';

async function seedProvider() {
  try {
    const username = 'provideruser';

    // Check if provider already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    });

    if (existingUser) {
      console.log('Provider user already exists');
      return;
    }

    // Create user account
    const hashedPassword = await hash('provider123', 10);
    const userResult = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        name: 'Provider User',
        email: 'provider@techmista.com',
        role: 'solution_provider',
        created_at: new Date(),
        is_active: true,
      })
      .returning();

    const userId = userResult[0]?.id;

    if (!userId) throw new Error('Failed to create user account');

    // Create associated provider profile
    await db.insert(solutionProviders).values({
      name: 'Techmista Solutions',
      description: 'We provide top-tier tech solutions globally.',
      website: 'https://techmista.com',
      email: 'provider@techmista.com',
      phone: '+1-555-1234567',
      regions_served: ['global'],
      created_at: new Date(),
    });

    console.log('Solution provider user created successfully');
  } catch (error) {
    console.error('Error seeding provider user:', error);
  } finally {
    process.exit(0);
  }
}

seedProvider();
