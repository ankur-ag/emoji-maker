# Project Overview
- Use this guide to build a web app where the users can give a text promp to generate emoji using the model on Replicate

# Feature requirements
- We will use NextJS, Shadcn, Lucid, Supabase, Clerk
- Create a form for the user to enter a text prompt and a button that calls the Replicate model to generate an emoji
- Have a nice UI and animation when the emoji is blank or generating
- Display all the emojis ever generated in a grid
- When you hover on each emoji, show a button to download the image and a button to like the image.

# Relevant docs
## How to use Replicate emoji generator model

import Replicate from "replicate";
const replicate = new Replicate();

const input = {
    prompt: "A TOK emoji of a man",
    apply_watermark: false
};

const output = await replicate.run("fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e", { input });
console.log(output);


# Current file structure
EMOJI-MAKER
├── .next
├── app
│   ├── fonts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib
├── node_modules
├── requirements
│   └── frontend-instructions.md
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── npm-debug.log
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json

# Rules
- All new components should be in the components/ui folder in the format of example-component.tsx unless otherwise specified
- All new pages should go in the app/ folder
