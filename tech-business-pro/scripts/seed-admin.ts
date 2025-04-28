import { hash } from "bcrypt";
import { db } from "@/db";
import { users } from "@/lib/db/tables/users";

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, "admin"),
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await hash("admin123", 10);

    await db.insert(users).values({
      username: "admin",
      password: hashedPassword,
      name: "System Administrator",
      email: "admin@techmista.com",
      role: "admin",
      created_at: new Date(),
      is_active: true,
    });

    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    process.exit(0);
  }
}

seedAdmin();
