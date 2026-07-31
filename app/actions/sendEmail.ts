"use server";

import { Resend } from 'resend';

// Initialize Resend with your secure environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export async function sendContactEmail(data: SendEmailParams) {
  // 1. Basic Server-side Validation
  if (!data.firstName || !data.lastName || !data.email || !data.message) {
    return { success: false, error: "All fields are required." };
  }

  if (!data.email.includes("@")) {
    return { success: false, error: "Invalid email address." };
  }

  try {
    const toEmail = process.env.NOTIFICATION_GMAIL || "sahilpanwar0305@gmail.com";

    // 2. Dispatch Email through Resend
    const response = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: toEmail,
      subject: `New Portfolio Message from ${data.firstName} ${data.lastName}`,
      replyTo: data.email, // Allows clicking 'Reply' in Gmail to reply directly
      html: `
        <div style="font-family: sans-serif; padding: 28px; color: #111111; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #6366f1; margin-top: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.025em;">New Contact Form Submission</h2>
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 16px 0;" />
          <p style="margin: 6px 0; font-size: 14px; color: #4b5563;"><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p style="margin: 6px 0; font-size: 14px; color: #4b5563;"><strong>Sender Email:</strong> <a href="mailto:${data.email}" style="color: #6366f1; text-decoration: none;">${data.email}</a></p>
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 20px 0;" />
          <p style="margin: 0; font-size: 14px; color: #374151; font-weight: 500;">Message Content:</p>
          <p style="margin-top: 8px; font-size: 14px; line-height: 1.6; color: #1f2937; background-color: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #f3f4f6; white-space: pre-wrap;">${data.message}</p>
        </div>
      `,
    });

    if (response.error) {
      console.error("Resend Dispatch Error:", response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Server Action Exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error occurred.";
    return { success: false, error: errorMessage };
  }
}