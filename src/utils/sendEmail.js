import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendWinnerEmail = async (dealerEmail, carDetails, auctionId) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: dealerEmail,
    subject: "Congratulations! You've won the car auction!",
    text: `Dear Dealer,\n\nCongratulations! You've won the auction (ID: ${auctionId}) for the car ${carDetails}.\n\nRegards,\nCar Auction Team`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendWinnerEmail;
