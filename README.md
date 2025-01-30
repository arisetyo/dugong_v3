# Dugong

**Version 3.0.1**

This is the third iteration of my personal framework [Dugong](https://code.google.com/archive/p/dugong/). The first one was pretty successful and had a pretty good run, helping me and other developers creating web-based solution.

The second one never came into completion.

The third one will try to emulate its legendary ancestor.

## Tech stack
Main technologies used:
1. [Fastify](https://fastify.dev/)
2. [EJS](https://ejs.co/)
3. [htmx](https://htmx.org/)
4. [Sass](https://sass-lang.com/)

Supporting technologies:
1. [Alpine.js](https://alpinejs.dev/)
2. [Supabase](https://supabase.com/) (optional)

## Purpose
This framework serves as a boilerplate of how to create SSR pages served by Fastify.
It serves as a starting scaffold on how you can integrate the aforementioned main technologies to create a monolithic web-application.

## Motivation
- Create a monolith framework where I can work with the back-end and front-end at the same time.
- I want to work with HTML pages boosted by htmx and Alpine, that is served directly by Fastify.
- The Fastify server works as both the page-renderer (for an SSR experience) and API service (eg. for data required by htmx).
- I want to be able to reuse HTML components, so I use templates using EJS.
- And lastly, I want to be able to use "modular" SCSS files, like in modern front-end frameworks.

## Note ⚠️
The file `styles.css` in `public/assets` is generated automatically from the Sass files in the `styles/` folder. Do not edit it directly.