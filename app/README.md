# Task Management Frontend

A React-based frontend for the Task Management application.

## Tech Stack

- React 18
- TypeScript
- Vite 5.x
- Tailwind CSS v4 (alpha)
- Shadcn UI (Component Library)
- React Query
- React Router DOM

## UI Design Decision

This project uses **Shadcn UI** with **Tailwind CSS v4** instead of Chakra UI as originally planned. This decision was made for the following reasons:

1. **Modern Component Architecture**: Shadcn UI provides a collection of reusable components built on top of Radix UI primitives, offering excellent accessibility and customizability.

2. **Tailwind CSS v4 Benefits**: The latest version of Tailwind CSS offers improved performance, better developer experience, and new features while maintaining the utility-first approach.

3. **Headless Components**: Radix UI primitives provide unstyled, accessible components that handle complex interactions and accessibility concerns, allowing for complete styling control.

4. **Composition Over Configuration**: The component architecture encourages composition, making it easier to build complex UIs from simple building blocks.

5. **TypeScript Integration**: Strong TypeScript support for better developer experience and type safety.

## Setup Instructions

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
```

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── ui/           # Shadcn UI components
│   │   └── ...           # Custom components
│   ├── pages/            # Route components
│   ├── api/              # API client
│   ├── types/            # TypeScript types
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Entry point
└── ...
``` 