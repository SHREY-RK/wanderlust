# wanderlust

# Phase 1: Basic Wanderlust Website

In Phase 1, I built the foundation of the Wanderlust website, a platform that showcases properties and travel destinations.

### Technologies Used

* Express.js
* EJS
* MongoDB
* Mongoose

### Features Implemented

* Established a connection between the application and MongoDB using Mongoose.
* Created a Mongoose schema named **Listing** to store property information.
* Built RESTful APIs for performing CRUD (Create, Read, Update, and Delete) operations on listings.
* Used EJS templates to render dynamic web pages.
* Displayed property listings and destination details on the website.

### Outcome

This phase focused on setting up the backend architecture, database integration, and core listing management functionality of the Wanderlust platform.


# Phase 2 (i): Navbar & Footer

In this phase, I added a reusable Navbar and Footer to the Wanderlust website using EJS partials. This improved navigation, maintained a consistent layout across pages, and enhanced the overall user experience.


# Phase 3: Error Handling

## Overview

In this phase, robust error handling mechanisms were implemented to improve the reliability and user experience of the Wanderlust application.

The application now validates user input on both the client side and server side, preventing invalid data from being stored in the database and providing meaningful feedback to users.

---

## Features Implemented

### 1. Client-Side Validation

Bootstrap form validation was integrated to validate user input before form submission.

#### Validations:

* Required fields cannot be left empty.
* Price must be a non-negative number.
* Invalid form submissions are prevented.
* Visual feedback is displayed for invalid inputs.

#### Technologies Used:

* Bootstrap Validation
* JavaScript Form Validation

---

### 2. Server-Side Validation

Server-side validation was implemented using Joi to ensure data integrity even if client-side validation is bypassed.

#### Validations:

* Title is required.
* Description is required.
* Price must be a valid positive number.
* Location is required.
* Country is required.
* Image URL is optional.

#### Technologies Used:

* Joi Validation Library
* Express Middleware

---

### 3. Custom Error Handling

A custom error handling system was introduced using a dedicated `ExpressError` class.

#### Features:

* Custom HTTP status codes
* Meaningful error messages
* Centralized error handling middleware
* Consistent error responses

---

### 4. Async Error Handling

To avoid repetitive try-catch blocks, asynchronous route handlers are wrapped using a custom `wrapAsync()` utility.

#### Benefits:

* Cleaner route code
* Automatic forwarding of errors to Express middleware
* Better maintainability

---

### 5. Global Error Middleware

A centralized error-handling middleware captures all application errors and renders a user-friendly error page.

#### Responsibilities:

* Handle validation errors
* Handle database errors
* Handle unexpected server errors
* Display meaningful error messages to users

---

### 6. 404 Error Handling

A catch-all middleware was added to handle invalid routes.

#### Example:

If a user visits a non-existent URL:

```text
/listings/unknown-route
```

The application responds with:

```text
404 - Page Not Found
```

---

## Files Added

### Utilities

* `utils/ExpressError.js`
* `utils/wrapAsync.js`

### Validation

* `schema.js`

### Error View

* `views/error.ejs`

---

# Phase 4: Flash Messages & Route Refactoring

## Overview

In this phase, the application's user experience and code organization were improved by implementing flash messages and restructuring routes using Express Router.

---

## Features Implemented

### 1. Flash Messages

Flash messages were added to provide instant feedback to users after performing actions.

#### Examples:

* Success message displayed when a new listing is created.
* Success message displayed when a listing is updated.
* Success message displayed when a listing is deleted.
* Error messages displayed when an operation fails.

#### Technologies Used:

* connect-flash
* express-session

---

### 2. Route Refactoring with Express Router

The application routes were separated into dedicated router files for better organization and maintainability.

#### Benefits:

* Cleaner `app.js` file
* Modular code structure
* Easier route management
* Improved scalability for future features

#### Example Structure:

```text
routes/
├── listings.js
```

#### Technologies Used:

* Express Router

---

## Outcome

This phase enhanced the user experience by providing real-time feedback through flash messages and improved the project's structure by organizing routes into separate router modules.


# Phase 5: Authentication & Authorization

## Features Added

* User Signup, Login, and Logout functionality.
* Session-based authentication using Passport.js.
* Only logged-in users can create listings and reviews.
* Only listing owners can edit or delete their listings.
* Only review authors can delete their reviews.
* Flash messages for authentication and authorization errors.

## Database Updates

* Added `owner` field to Listings.
* Added `author` field to Reviews.
* Created a User model for authentication.

## Technologies Used

* Passport.js
* Passport-Local-Mongoose
* Express Session
* Connect Flash

## Outcome

Implemented secure authentication and authorization to protect listings and reviews from unauthorized access and modifications.
