## Environment Variables

1. Copy the `.env.example` file and rename it to `.env`.
2. Fill in the required values:
    - `JWT_SECRET`: A secure, randomly generated secret key.
    -  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    - `MONGO_URI`: Your MongoDB connection string.
    - `MONGO_URI_TEST`: Your MongoDB connection string for testing.
3. Never commit the `.env` file to Git to avoid exposing sensitive information.
