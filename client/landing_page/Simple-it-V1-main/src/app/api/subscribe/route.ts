import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required.' },
                { status: 400 }
            );
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
            console.error('CRITICAL: Environment variables EMAIL_USER or EMAIL_APP_PASSWORD are not set.');
            return NextResponse.json(
                { message: 'Server configuration error: Missing email credentials.' },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // Sending TO the user who subscribed
            replyTo: 'learnershakil@gmail.com',
            subject: `Subscription Confirmed: Event App GenZ Incubator`,
            text: `Hi there,\n\nYou have successfully subscribed to the Event App GenZ announcements.\nWe will notify you as soon as the registration forms are out!\n\nBest,\nEvent App GenZ`,
            html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #050505; color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ecff33; margin-bottom: 20px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Subscription Confirmed</h2>
          <p style="color: #a1a1aa; font-size: 14px; margin-top: 5px;">Event App GenZ</p>
        </div>

        <div style="background-color: #1a1a1a; padding: 25px; border-radius: 8px; border: 1px solid #333; text-align: center;">
            <p style="font-size: 16px; line-height: 1.6; color: #e4e4e7;">
                Hi there, <br/><br/>
                You have successfully subscribed to the <strong>Event App GenZ</strong> announcements.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-top: 15px;">
                We are putting the final touches on our program. You will be the first to know when our registration form is officially released. Prepare your pitches!
            </p>
        </div>

        <div style="text-align: center; margin-top: 25px;">
            <p style="color: #666; font-size: 12px; text-transform: uppercase;">
                © 2026 Event App GenZ
            </p>
        </div>
      </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Subscribed successfully' });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { message: 'Failed to subscribe. Please try again.' },
            { status: 500 }
        );
    }
}
