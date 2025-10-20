 **Auction Platform Backend** 
This is a robust backend API for an Auction Platform built using Node.js, Express, and MongoDB. It supports event-driven car auctions with features like user authentication, real time bidding, and email notifications.

**Key Features** 
User Management: Users with roles (admin, dealer) can register and authenticate securely.

**Role Details:**

- An Admin user is pre-set with name Admin and password. Admins can create cars and auctions using an authentication token.

- Dealer users register themselves and can place bids only on auctions with status "active".

- Car & Auction Management: CRUD operations for cars and auctions, including starting and ending auctions.

- Bid Placement: Dealers can place bids on active auctions with safeguards like rate limiting to prevent spamming. The dealer with the highest bid wins the auction.

- Email Notifications: Automatic winner email notifications using Nodemailer.

- Input Validation: Input fields like email, password, role, and event dates are validated using express-validator.

 **Security Enhancements:**

- Helmet for secure HTTP headers.

- Rate limiting on critical endpoints to prevent abuse.
- Used httpOnly Cookies for XSS Attacks.


Testing: Comprehensive unit and integration tests written with Jest and node-mocks-http, covering models, utilities, and controllers.

<!-- Technologies Used -->
- Node.js, Express.js

- MongoDB with Mongoose ODM

- JSON Web Tokens (JWT) for authentication

- Nodemailer for email services

- Express Validator for input validation
- Socket.io for real time bidding

- Helmet, express-rate-limit, express-mongo-sanitize for security hardening
  multer and cloudinary for uploading image files.

- Jest and node-mocks-http for testing

<!-- Project Structure Highlights -->
models/ - Mongoose schemas for Users, Cars, Auctions, Bids

controllers/ - Controller functions separated from route definitions

routes/ - Express routes applying validation and middleware

utils/ - Helper functions including JWT token generation & email sending

middlewares/ - Authentication and error handling middlewares

tests/ - Unit and integration tests with mocking and validation

config/ - some additional configurations like connect DataBase and cloudinary setup.

<!-- Getting Started -->
Clone the repo
git clone <repository-url>

Install dependencies
npm install

Create .env with required keys (MongoDB URI, JWT secret, email credentials)

Run the development server
npm run dev

Run tests
npm test

<!-- API Highlights -->
POST /register-dealer — Dealer users register with validated inputs

POST /create-car — Create cars (admin only, token required)

POST /createAuction — Create auctions (admin only, token required)

PUT /status/:auctionId — Start auction (admin only)

PUT /:auctionId/winner-bid — End auction; highest bidder notified via email

POST /placeBids — Dealers place bids on active auctions with 1-minute cooldown per user

<!-- Security Best Practices Used -->
- Helmet to set secure HTTP headers

- Rate Limiting to avoid request flooding (customized per route)

- Input Validation & Sanitization via express-validator and express-mongo-sanitize

- JWT Authentication ensuring secure API access
