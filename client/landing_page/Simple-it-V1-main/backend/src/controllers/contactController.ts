import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const submitContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message } = req.body;

    // Configure your SMTP transporter here
    // Example using Gmail SMTP:
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or another service
      auth: {
        user: process.env.EMAIL_USER || '', // Your email
        pass: process.env.EMAIL_APP_PASSWORD || '', // Your app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // The authenticated sender
      to: ['learnershakil@gmail.com', 'afzalkhan110604@gmail.com'],
      replyTo: email, // Set the reply-to header to the customer's email
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #fcfcfc;">
              <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #e2ff00; margin-bottom: 20px;">
                <h2 style="color: #1a1a1a; margin: 0; font-size: 24px;">New Inquiry</h2>
                <p style="color: #666; font-size: 14px; margin-top: 5px;">You have received a new message from Simple-it Studio.</p>
              </div>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #f0f0f0;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; width: 100px;"><strong style="color: #888; font-size: 12px; text-transform: uppercase;">Name:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a; font-weight: bold;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong style="color: #888; font-size: 12px; text-transform: uppercase;">Email:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a;">
                      <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong style="color: #888; font-size: 12px; text-transform: uppercase;">Subject:</strong></td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #1a1a1a;">${subject || 'N/A'}</td>
                  </tr>
                </table>

                <div style="margin-top: 25px;">
                  <strong style="color: #888; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 10px;">Message Outline:</strong>
                  <div style="background-color: #f8f8f8; padding: 15px; border-radius: 6px; color: #333; line-height: 1.6; white-space: pre-wrap; font-size: 14px;">${message}</div>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 25px;">
                <a href="mailto:${email}?subject=Re: ${subject || 'Your Inquiry'}" style="background-color: #1a1a1a; color: #e2ff00; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">Reply to ${name.split(' ')[0]}</a>
              </div>
            </div>
            `
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to the user
    const isBooking = subject && subject.includes('Booking');
    const userSubject = isBooking ? 'Booking Confirmed: Simple-it Studio' : 'Inquiry Received: Simple-it Studio';
    const userFirstName = name.split(' ')[0] || 'there';

    const userHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #333; border-radius: 10px; background-color: #050505; color: #ffffff;">
            <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ecff33; margin-bottom: 20px;">
              <h2 style="color: #ffffff; margin: 0; font-size: 24px;">${isBooking ? 'Discovery Call Booked' : 'Inquiry Received'}</h2>
              <p style="color: #a1a1aa; font-size: 14px; margin-top: 5px;">Simple-it Studio</p>
            </div>

            <div style="background-color: #1a1a1a; padding: 25px; border-radius: 8px; border: 1px solid #222; text-align: center;">
                <p style="font-size: 16px; line-height: 1.6; color: #e4e4e7;">
                    Hi ${userFirstName}, <br/><br/>
                    ${isBooking
        ? 'Your 30-minute discovery call has been successfully scheduled!'
        : 'Thank you for reaching out to us! This is an automated email to confirm that we have received your inquiry.'}
                </p>
                <p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-top: 15px;">
                    ${isBooking
        ? 'We are looking forward to discussing your project and how we can help bring your ideas to life. We will send you a Google Meet link prior to the meeting.'
        : 'Our team is currently reviewing your message and will get back to you within 24-48 hours with a comprehensive response. We are excited to learn more about your project!'}
                </p>
            </div>

            <div style="text-align: center; margin-top: 25px;">
                <p style="color: #666; font-size: 12px; text-transform: uppercase;">
                    © ${new Date().getFullYear()} Simple-it Studio
                </p>
            </div>
          </div>
        `;

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Sending TO the user who contacted/booked
      replyTo: 'learnershakil@gmail.com',
      subject: userSubject,
      html: userHtml
    };

    await transporter.sendMail(userMailOptions);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};
