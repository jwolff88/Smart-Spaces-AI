import { Resend } from "resend"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.FROM_EMAIL || "Smart Spaces <noreply@resend.dev>"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

interface BookingEmailData {
  guestName: string
  guestEmail: string
  hostName: string
  hostEmail: string
  listingTitle: string
  listingLocation: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  bookingId: string
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function getNights(checkIn: Date, checkOut: Date): number {
  return Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  )
}

// Booking confirmation email to guest
export async function sendBookingConfirmationToGuest(data: BookingEmailData) {
  if (!resend) {
    console.log("Email service not configured, skipping email to guest")
    return { success: false, error: "Email service not configured" }
  }

  const nights = getNights(data.checkIn, data.checkOut)

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.guestEmail,
      subject: `Booking Confirmed: ${data.listingTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .detail-row:last-child { border-bottom: none; }
            .label { color: #64748b; }
            .value { font-weight: 600; }
            .total { font-size: 1.2em; color: #3b82f6; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
              <p>Your reservation is all set</p>
            </div>
            <div class="content">
              <p>Hi ${data.guestName || "Guest"},</p>
              <p>Great news! Your booking has been confirmed. Here are your reservation details:</p>

              <div class="booking-details">
                <h3 style="margin-top: 0;">${data.listingTitle}</h3>
                <p style="color: #64748b; margin-bottom: 20px;">${data.listingLocation}</p>

                <div class="detail-row">
                  <span class="label">Check-in</span>
                  <span class="value">${formatDate(data.checkIn)}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Check-out</span>
                  <span class="value">${formatDate(data.checkOut)}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Duration</span>
                  <span class="value">${nights} night${nights > 1 ? "s" : ""}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Guests</span>
                  <span class="value">${data.guests}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Host</span>
                  <span class="value">${data.hostName || "Your Host"}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total</span>
                  <span class="value total">$${data.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <p>Your host has been notified and will be expecting you. If you have any questions, you can message them through the platform.</p>

              <center>
                <a href="${APP_URL}/guest-dashboard" class="button">View My Trips</a>
              </center>

              <div class="footer">
                <p>Smart Spaces - Smarter Stays. Intelligent Living.</p>
                <p>If you didn't make this booking, please contact us immediately.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to send guest confirmation email:", error)
    return { success: false, error }
  }
}

// New booking notification to host
export async function sendNewBookingToHost(data: BookingEmailData) {
  if (!resend) {
    console.log("Email service not configured, skipping email to host")
    return { success: false, error: "Email service not configured" }
  }

  const nights = getNights(data.checkIn, data.checkOut)

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.hostEmail,
      subject: `New Booking: ${data.listingTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .detail-row:last-child { border-bottom: none; }
            .label { color: #64748b; }
            .value { font-weight: 600; }
            .earnings { font-size: 1.2em; color: #10b981; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Booking!</h1>
              <p>You have a new reservation</p>
            </div>
            <div class="content">
              <p>Hi ${data.hostName || "Host"},</p>
              <p>Great news! You have a new booking for <strong>${data.listingTitle}</strong>.</p>

              <div class="booking-details">
                <h3 style="margin-top: 0;">Guest Details</h3>
                <div class="detail-row">
                  <span class="label">Guest Name</span>
                  <span class="value">${data.guestName || "Guest"}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Check-in</span>
                  <span class="value">${formatDate(data.checkIn)}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Check-out</span>
                  <span class="value">${formatDate(data.checkOut)}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Duration</span>
                  <span class="value">${nights} night${nights > 1 ? "s" : ""}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Guests</span>
                  <span class="value">${data.guests}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Your Earnings</span>
                  <span class="value earnings">$${(data.totalPrice * 0.9).toFixed(2)}</span>
                </div>
              </div>

              <p>Make sure your property is ready for your guest's arrival. You can message them through the platform if you need to share any details.</p>

              <center>
                <a href="${APP_URL}/host-dashboard" class="button">View Booking</a>
              </center>

              <div class="footer">
                <p>Smart Spaces - Smarter Stays. Intelligent Living.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to send host notification email:", error)
    return { success: false, error }
  }
}

// Booking status change notification
export async function sendBookingStatusUpdate(
  email: string,
  name: string,
  status: string,
  listingTitle: string,
  bookingId: string
) {
  if (!resend) {
    console.log("Email service not configured, skipping status update email")
    return { success: false, error: "Email service not configured" }
  }

  const statusMessages: Record<string, { subject: string; message: string; color: string }> = {
    confirmed: {
      subject: `Booking Confirmed: ${listingTitle}`,
      message: "Your booking has been confirmed by the host. Get ready for your trip!",
      color: "#10b981",
    },
    cancelled: {
      subject: `Booking Cancelled: ${listingTitle}`,
      message: "Your booking has been cancelled. If you have any questions, please contact support.",
      color: "#ef4444",
    },
    completed: {
      subject: `Trip Completed: ${listingTitle}`,
      message: "We hope you had a wonderful stay! Please consider leaving a review to help future guests.",
      color: "#3b82f6",
    },
  }

  const statusInfo = statusMessages[status]
  if (!statusInfo) return { success: false, error: "Unknown status" }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: statusInfo.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${statusInfo.color}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; text-align: center; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${status.charAt(0).toUpperCase() + status.slice(1)}</h1>
              <p>${listingTitle}</p>
            </div>
            <div class="content">
              <p>Hi ${name || "there"},</p>
              <p>${statusInfo.message}</p>

              <a href="${APP_URL}/guest-dashboard" class="button">View Details</a>

              <div class="footer">
                <p>Smart Spaces - Smarter Stays. Intelligent Living.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error("Failed to send status update email:", error)
    return { success: false, error }
  }
}
