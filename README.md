# Vishal's Personal Space

A minimal, personal portfolio and digital garden built to document my projects, favorite excerpts, articles, and personal drafts. 

Built with **Next.js**, **Tailwind CSS**, and **Framer Motion**.

## 🏗️ Structure

The site is organized into four main sections:
- **Home (`/`)**: A minimal landing page featuring a focal quote.
- **Projects (`/projects`)**: A gallery of things I've built or am currently building.
- **Notes (`/notes`)**: A curated library divided into three tabs: Excerpts, Articles, and Poems I like.
- **Drafts (`/drafts`)**: A dedicated space for my personal poetry and unfinished thoughts.
- **About (`/about`)**: A brief introduction.

## ✍️ How to Update Content

You don't need to touch the complex application code to update your content. All data is neatly organized in the `src/data` directory:

- `src/data/projects.ts`: Update your portfolio projects here.
- `src/data/writings.ts`: Update the excerpts and quotes you want to share.
- `src/data/articles.ts`: Update links to your favorite articles.
- `src/data/poems.ts`: Update poems by other writers (appears in Notes).
- `src/data/personal.ts`: Update your own poetry and drafts (appears in Drafts).

Simply copy an existing block inside the array, paste it, and modify the text!

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

This project is configured for static export to GitHub Pages. The `.github/workflows/deploy.yml` file contains a GitHub Action that automatically builds and deploys the `out` directory to GitHub Pages every time you push to the `main` branch.
