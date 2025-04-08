# Deploying to Render

This application can be easily deployed to Render using the included configuration.

## Setup Instructions

1. Create a Render account at [render.com](https://render.com) if you don't have one.

2. Connect your GitHub repository to Render.

3. Create a new Web Service and select your repository.

4. Render will automatically detect the `render.yaml` configuration.

5. Configure the environment variables in the Render dashboard:
   - `NEXT_PUBLIC_N8N_WEBHOOK_URL`: Your n8n webhook URL
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

6. Click "Create Web Service" to deploy your application.

## Manual Configuration (Alternative)

If you prefer to configure manually instead of using `render.yaml`:

1. Create a new Web Service in Render.
2. Set the build command to: `npm install && npm run build`
3. Set the start command to: `npm start`
4. Add the required environment variables mentioned above.
5. Set the Node.js version to 18 or higher.

## Troubleshooting

- If you encounter build issues, check the build logs in the Render dashboard.
- Ensure all environment variables are correctly set.
- For persistent issues, you can SSH into your service using the Render Shell feature. 