# Hypership CLI

![GitHub Hero Banner](/public/assets/images/github-hero-banner.png)

<div align="center">
  <p>
    Hypership is a new platform to build, ship, and manage apps at warp-speed. We give you a full codebase deployed with user authentication, pageview analytics, event tracking, and deployments out of the box.
  </p>
  <p>
    Find out more at <a href="https://hypership.dev">hypership.dev</a>
  </p>

[![Join Our Discord](https://img.shields.io/badge/Join%20Our%20Discord-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/R2KHzFqGjN)

</div>

A powerful command-line interface for managing Hypership projects, deployments, and authentication.

## Installation

```bash
npm install -g hypership
```

## Features

- 🚀 Project initialization and setup
- 📦 Automated deployments
- 🔑 Secure authentication
- 🔄 Auto-update notifications
- ⚡ Zero-configuration setup
- 🛠️ Framework-agnostic deployment
- 📱 Cross-platform support
- 🔒 Secure token management
- 🌐 Environment management
- 🎯 Project configuration

## Quick Start

1. Install the CLI globally:

```bash
npm install -g hypership
```

2. Authenticate with your Hypership account:

```bash
hypership authenticate
```

3. Initialize a new project:

```bash
hypership init
```

4. Deploy your project:

```bash
hypership deploy
```

## Commands

### `hypership authenticate [cliKey]`

Authenticate with Hypership using email/password or CLI key.

Options:

- `-e, --email <email>` - Email address
- `-p, --password <password>` - Password

### `hypership init [projectId]`

Initialize a new Hypership project. If no project ID is provided, you'll be prompted to select from your existing projects.

### `hypership deploy`

Deploy your current Hypership project. Must be run from the project root directory.

### `hypership logout`

Log out of your current Hypership session.

## Project Structure

After initialization, your project will have the following structure:

```
your-project/
├── .hypership/
│   └── hypership.json
├── web/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Environment Variables

The CLI will automatically create and manage the necessary environment variables for your project during initialization.

## Error Handling

The CLI provides detailed error messages and suggestions for common issues:

- Authentication errors
- Build failures
- Deployment issues
- Project configuration problems

## Updates

The CLI includes an automatic update checker that will notify you when new versions are available. To update to the latest version:

```bash
npm install -g hypership@latest
```

## License

ISC
