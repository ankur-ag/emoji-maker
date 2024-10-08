# Project Overview
- Use this guide to build the backend for the web app of emoji maker

# Tech stack
- We will use NextJS, Supabase, Clerk

# Tables and Storage already created
- Supabase storage bucket: "emojis"
- TABLE emojis (
    id INT8 PRIMARY KEY,
    image_url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    likes_count NUMERIC DEFAULT 0,
    user_id TEXT NOT NULL,
    inserted_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now())) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now())) NOT NULL
);
- TABLE users (
    id TEXT PRIMARY KEY,
    tier TEXT DEFAULT 'free' NOT NULL,
    credits NUMERIC DEFAULT 3 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT
);

# Requirements
1. Create users
    1. Create a user in the users table when the user signs up
    2. If the user doesn't already exist in the users table, create a new user in the users table
    3. If the user already exists in the users table, proceed and pass the id of the user to functions like generate emojis
2. Upload emojis
    1. Upload an emoji file returned by the Replicate model to the emojis bucket when the user generates an emoji
    2. Create a row in the emojis table with the emoji file as the image_url, prompt entered by the user, user_id of the current user, and the current timestamp
3. Display emojis in the grid
    1. Emoji grid should fetch and display all the emojis in the emojis table
    2. Each time a new emoji is generated, the emoji grid should refresh to show the new emoji
4. Likes interaction
    1. When the user clicks the like button, increment the likes_count of the emoji by 1
    2. When the user clicks the unlike button, decrement the likes_count of the emoji by 1

# Documentation
## Example of uploading files to Supabase storage

```javascript
import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient('your_project_url', 'your_supabase_api_key')

// Upload file using standard upload
async function uploadFile(file) {
  const { data, error } = await supabase.storage.from('bucket_name').upload('file_path', file)
  if (error) {
    // Handle error
  } else {
    // Handle success
  }
}
```