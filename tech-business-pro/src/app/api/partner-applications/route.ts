import { partnerApplications } from '@/lib/db/tables/partnerApplications';
import { insertPartnerApplicationSchema } from '@/lib/db/schemas/partnerApplicationSchema';
import { NextResponse } from 'next/server';
import { db } from '@/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = insertPartnerApplicationSchema.parse(body);
    // Replace with actual user ID
    // Insert the application into the database
    const result = await db
      .insert(partnerApplications)
      .values({
        ...validatedData,
        application_status: 'pending',
        created_at: new Date(),
      })
      .returning();

    // Send confirmation email (placeholder for actual email sending)
    // await sendConfirmationEmail(validatedData.email);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application: result[0],
    });
  } catch (error) {
    console.error('Error submitting partner application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application' },
      { status: 500 },
    );
  }
}
