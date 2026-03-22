import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendVerificationEmail(email: string, code: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your CryptoWise Account',
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00a8ff;">Welcome to CryptoWise! 🚀</h2>
        <p>Your verification code is:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 5px; font-weight: bold;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">CryptoWise - AI-Powered Crypto Predictions</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export async function sendPasswordResetEmail(email: string, code: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your CryptoWise Password',
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00a8ff;">Password Reset Request 🔐</h2>
        <p>Your reset code is:</p>
        <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 5px; font-weight: bold;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">CryptoWise - AI-Powered Crypto Predictions</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
