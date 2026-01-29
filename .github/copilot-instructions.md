# Copilot Instructions

**IMPORTANT**: Never read the `.env` files

## Project Overview

<!-- TODO: Add a brief description of your project here -->

This is a web application built using the Dugong monolithic framework with Fastify, EJS, htmx, Alpine.js, and SCSS as the main technologies.

## Tech Stack

### Backend
- **Node.js** (v18+) with ES modules
- **Fastify** as the web framework
- **PostgreSQL** for the database
- **Redis** for session storage and caching

### Frontend
- **EJS** for server-side templating
- **htmx** for AJAX interactions without writing JavaScript
- **Alpine.js** for lightweight client-side interactivity
- **SCSS** for styling

## Project Structure

```
project/
├── .github/                      # GitHub configuration and workflows
│   └── copilot-instructions.md   # This instructions file
│
├── __tests__/                    # Test files
├── docs/                         # Documentation in markdown format
│   └── how-tos/                  # Documentation on specific topics that can be implemented in this setup
│
├── libs/                         # Utility functions and shared code
├── migration/                    # Database migration scripts
├── models/                       # Database models
├── public/                       # Static assets
│   ├── assets/                   # Images, icons, and compiled styles.css
│   └── scripts/                  # JavaScript files used by HTML pages
│
├── views/                        # EJS templates and SCSS
│   ├── components/               # Reusable UI components (atoms, molecules)
│   ├── pages/                    # Page templates (inner/outer)
│   └── styles/                   # global.scss (variables) and MAIN.scss (imports)
│
├── README.md                    # Main readme file
└── server.js                    # Main application entry point
```

## Coding Standards

### JavaScript
- Use ES modules (`import`/`export` syntax)
- **No semicolons** - follow the ESLint config
- Use `async`/`await` for asynchronous code
- Use descriptive variable and function names
- Add JSDoc comments for functions and classes

### CSS/SCSS
- Follow existing class naming conventions
- Use global CSS variables when available
- Organize styles by component
- Aim for modularity and reusability

### HTML/EJS
- Use semantic HTML elements
- Make components modular
- Include descriptive comments in templates

## Development Commands

```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npx eslint .
```

## Testing

- Tests are located in the `__tests__/` directory
- Uses **Mocha** as the test runner
- Uses **Chai** for assertions
- Uses **Sinon** for mocking/stubbing
- Test files should follow the pattern `*.test.js`

## Database

- All database operations go through model files in `models/`
- Schema changes should be made through migration scripts in `migration/`
- Use parameterized queries to prevent SQL injection

## Component Design

Components follow the atomic design pattern:
- **Atoms**: Small, single-purpose components (buttons, inputs)
- **Molecules**: Composite components made up of atoms (forms, cards)

Each component typically has:
- An EJS template file (e.g., `Button.ejs`)
- A SCSS file (e.g., `Button.scss`)

## htmx Patterns

- Use `hx-get`, `hx-post`, `hx-put`, `hx-delete` for server requests
- Use `hx-target` to specify where to swap content
- Use `hx-swap` to define swap strategy (innerHTML, outerHTML, beforeend, etc.)
- Use `hx-trigger` for custom event triggers
- Use `hx-indicator` for loading states

## Alpine.js Patterns

- Use `x-data` to define component state
- Use `x-show`/`x-if` for conditional rendering
- Use `x-for` for loops
- Use `x-on` or `@` shorthand for event listeners
- Use `x-bind` or `:` shorthand for attribute binding
- Prefer htmx for server interactions, Alpine.js for client-side UI state

## Environment Variables

The application requires a `.env` file with configuration for:
- Server settings (PORT, NODE_ENV)
- Database connection (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
- Redis connection (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)
- Authentication (SESSION_SECRET)

## Important Notes

- Always validate user input before processing
- Use the existing error handling patterns
- Follow the existing code organization and patterns
- Prefer server-side rendering with htmx over heavy client-side JavaScript