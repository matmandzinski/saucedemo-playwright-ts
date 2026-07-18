# SauceDemo Test Automation

End-to-end test automation project for [SauceDemo](https://www.saucedemo.com/), built with Playwright and TypeScript.

The project demonstrates maintainable UI test architecture, reusable page and component objects, isolated authenticated sessions, parallel execution, CI integration, and automated coverage of the complete purchasing journey.

[![Playwright Tests](https://github.com/matmandzinski/saucedemo-playwright-ts/actions/workflows/playwright.yml/badge.svg)](https://github.com/matmandzinski/saucedemo-playwright-ts/actions/workflows/playwright.yml)

## Key Features

- Fixtureless test architecture with explicit Page Object creation
- Page Object Model for application pages
- Reusable component objects for shared UI elements
- Authentication state created through a Playwright setup project
- Independent authenticated and unauthenticated test projects
- Full purchase flow covered by an end-to-end smoke test
- Parallel test execution with isolated browser contexts
- Price subtotal, tax, and total validation
- File download verification
- Known application defects documented with `test.fail()`
- Automated WCAG 2.0/2.1 A and AA checks with Axe Core
- Accessibility scan results attached to Playwright reports
- Strict TypeScript configuration
- ESLint rules for TypeScript and Playwright tests
- Automated formatting, linting, and type checking in CI
- HTML reports, screenshots, videos, and traces for failed tests
- GitHub Actions workflow for continuous integration

## Technology Stack

- Playwright Test
- TypeScript
- Axe Core
- ESLint
- Prettier
- Node.js
- GitHub Actions

## Test Architecture

The project uses a thin Page Object Model. Page and component objects expose stable locators, while tests perform simple actions such as `click()` directly. Methods are introduced only when they represent a multi-step user operation or return structured domain data.

Examples:

- `LoginPage.login()` represents the complete login operation.
- `CheckoutStepOnePage.fillCustomerInformation()` fills the customer form.
- `ProductCardComponent.getData()` returns structured product information.
- Simple actions such as clicking `Continue`, `Finish`, or `Remove` remain visible in the test.

This approach keeps test behavior explicit and avoids unnecessary one-line wrapper methods.

## Project Structure

```text
.
|-- .github/workflows/
|   `-- playwright.yml       # GitHub Actions CI workflow
|-- playwright/.auth/        # Generated authentication state (gitignored)
|-- components/              # Reusable UI component objects
|-- models/                  # Shared TypeScript domain types
|-- pom/                     # Page Object Models
|-- tests/
|   |-- e2e/
|   |   `-- purchaseFlow.e2e.spec.ts # Complete purchase smoke test
|   |-- support/
|   |   `-- accessibility.ts         # Shared Axe scan helper
|   |-- accessibility.login.spec.ts  # Login accessibility tests
|   |-- accessibility.spec.ts        # Authenticated accessibility tests
|   |-- auth.setup.ts                # Authentication setup project
|   `-- *.spec.ts                    # Feature-focused test suites
|-- utils/                           # Shared utility functions
|-- .gitignore
|-- .prettierignore
|-- .prettierrc.json                 # Prettier configuration
|-- eslint.config.mjs                # ESLint configuration
|-- playwright.config.ts             # Playwright configuration
|-- tsconfig.json                    # TypeScript configuration
|-- package.json                     # Scripts and dependencies
|-- package-lock.json                # Locked dependency versions
`-- README.md
```

## Test Coverage

The current suite covers:

- Successful and unsuccessful login scenarios
- Locked-out user validation
- Authentication guards for protected routes
- Product list visibility and sorting
- Adding and removing products
- Product details navigation and content
- Cart content and navigation
- Checkout form validation
- Payment and shipping information
- Subtotal, tax, and total calculations
- Order completion
- Order document download
- Sidebar logout and application state reset
- Footer content and external link attributes
- Complete E2E login-to-order purchase flow
- Automated WCAG 2.0/2.1 A and AA accessibility audits of login, catalog, product details, cart, checkout, order completion, and sidebar states
- Explicit accessibility regression baselines for known SauceDemo violations

## Prerequisites

- Node.js
- npm

## Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd saucedemo-playwright-ts
npm ci
```

Install the Playwright browser binaries:

```bash
npx playwright install
```

For Linux CI environments, install browsers with their operating-system dependencies:

```bash
npx playwright install --with-deps
```

## Running Tests

Run the complete test suite:

```bash
npm test
```

Run tests in headed mode:

```bash
npm run test:headed
```

Run tests using Playwright UI Mode:

```bash
npm run test:ui
```

Run only the smoke test:

```bash
npx playwright test --grep @smoke
```

Run the known-issue tests:

```bash
npx playwright test --grep @known-issue
```

Run a selected test file:

```bash
npx playwright test tests/cart.spec.ts
```

## Code Quality

Run formatting, linting, and TypeScript checks together:

```bash
npm run check
```

Run each check separately:

```bash
npm run format:check
npm run lint
npm run typecheck
```

Automatically format the project and fix supported ESLint issues:

```bash
npm run format
npm run lint:fix
```

## Authentication

The `setup` project logs in as the SauceDemo standard user and saves the browser storage state. Authenticated tests reuse this state instead of repeating the login flow in every test.

Login tests start with an empty storage state, while the full purchase-flow test also starts unauthenticated so that it can cover the complete user journey.

The credentials used by this repository belong to the public SauceDemo test application and are not production secrets.

## Playwright Projects

The configuration defines the following projects:

- `setup` - creates the authenticated storage state
- `login-tests` - runs login and authentication-guard scenarios without a saved session
- `authenticated-tests` - runs the remaining tests using the standard-user session
- `smoke-chromium` - runs the complete purchase flow in Chromium
- `smoke-firefox` - runs the complete purchase flow in Firefox
- `smoke-webkit` - runs the complete purchase flow in WebKit

## Known Issues

### Reset App State

SauceDemo currently clears the cart after selecting **Reset App State**, but the product button can remain in the **Remove** state until the page is refreshed.

The defect is covered by an executed `test.fail()` scenario tagged with `@known-issue`. If the application behavior is corrected, Playwright will report an unexpected pass, indicating that the expected-failure annotation should be removed.

The defect is tracked in [GitHub issue #1](https://github.com/matmandzinski/saucedemo-playwright-ts/issues/1).

### Product sorting accessibility

The product sorting select on the inventory page does not have an accessible name. Axe reports this as a critical `select-name` violation.

The accessibility test stores this violation as an explicit baseline. It will fail if a new violation appears, the existing violation changes, or the issue is fixed and the baseline needs to be updated. Full Axe scan results are attached to the Playwright report as JSON.

### Validation error close buttons accessibility

The close buttons displayed with login and checkout validation errors do not have accessible names. Axe reports these elements as critical `button-name` violations.

Both violations are stored as explicit accessibility baselines. The tests will fail if a new violation appears, an existing violation changes, or SauceDemo fixes the affected buttons and the baselines need to be removed.

## Reports and Debugging Artifacts

Open the latest HTML report:

```bash
npm run report
```

For failed tests, the project retains:

- screenshot
- video
- Playwright trace

These artifacts are available locally in the test output and are uploaded by the GitHub Actions workflow.

## Continuous Integration

The GitHub Actions workflow runs on pushes and pull requests targeting the `main` and `master` branches. It:

1. Checks out the repository.
2. Sets up Node.js.
3. Installs project dependencies with `npm ci`.
4. Checks formatting with Prettier.
5. Runs ESLint.
6. Runs the TypeScript type check.
7. Installs Playwright browsers and their operating-system dependencies.
8. Runs the complete Playwright test suite.
9. Uploads the HTML report as a workflow artifact, even when tests fail.

## Roadmap

- [x] Add TypeScript type checking, ESLint, and Prettier to CI
- [x] Move generated authentication state to `playwright/.auth`
- [x] Run the complete E2E smoke flow in dedicated Chromium, Firefox, and WebKit projects
- [x] Add an automated accessibility baseline with Axe Core
- [x] Extend accessibility coverage to login, product details, cart, checkout, order completion, and sidebar states
- [x] Link known-issue tests to public issue tickets

## Disclaimer

This is my educational portfolio project. SauceDemo is a third-party service and is not maintained by this repository.

## Author

Mateusz Mandzinski

## License

This project is licensed under the MIT License.
