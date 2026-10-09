# PulseBoard — Startup Feedback Board

PulseBoard is a responsive full-stack feedback board where users can submit product ideas, report bugs, and suggest improvements. A team view helps track feedback through New, Planned, and Done statuses.

## Features

- Submit feedback with a title, description, and category.
- Display feedback with the newest submissions first.
- Search and filter feedback.
- Update feedback statuses from the team view.
- Validate submissions and provide loading, success, empty, and error states.
- Responsive interface with animations.

## Technology Stack

- **Next.js App Router and TypeScript** — application structure, routing, and API endpoints.
- **Tailwind CSS** — responsive styling.
- **MongoDB Atlas** — persistent feedback storage.
- **Framer Motion** — UI animations.
- **Lucide React** — interface icons.
- **Vercel** — deployment and hosting.

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB Atlas database
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/parjani/pulseboard.git
cd pulseboard
npm install
```

Create a `.env.local` file in the project root:

```dotenv
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=pulseboard
```

Replace the placeholder with your MongoDB Atlas connection string. Never commit credentials or `.env.local` to Git.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

To verify a production build, run:

```bash
npm run build
```

## Architecture

- `app/` contains the application pages and API routes.
- `app/api/feedback/` handles feedback retrieval and creation.
- `app/api/feedback/[id]/` handles status updates.
- `components/` contains reusable UI components.
- `lib/mongodb.ts` manages the MongoDB connection.
- MongoDB Atlas stores feedback persistently.
- Vercel hosts the deployed application.

## Deployment

The application is deployed using Vercel. Configure `MONGODB_URI` and `MONGODB_DB` in the project's environment variables before deployment.

## Known Limitations

- The team view does not currently have authentication, so it should not be used for confidential or sensitive data.
- The application is a mini-project and does not include a full user-management or role-based access-control system.
- Production database availability depends on correct MongoDB credentials and network configuration.

## AI Tools and Code Review

ChatGPT was used as a development assistant for implementation guidance, UI improvements, debugging, and documentation. The resulting code should be reviewed, built, and tested before submission. See the accompanying AI tools note for the verification performed.

## License

Created as a candidate coding assessment project.
