import dotenv from 'dotenv'
dotenv.config()

function getENVkeys(key: string): string {
    const value = process.env[key]
    if (!value) {
        console.log('environment variable not found')
        process.exit(1)
    }

    return value
}

export const ENV = {
    PORT: getENVkeys('PORT'),
    DATABASE_URL: getENVkeys('DATABASE_URL'),
    CLOUD_NAME: getENVkeys('CLOUD_NAME'),
    CLOUD_API_KEY: getENVkeys('CLOUD_API_KEY'),
    CLOUD_API_SECRET: getENVkeys('CLOUD_API_SECRET'),
    ACCESS_SECRET: getENVkeys('ACCESS_SECRET'),
    REFRESH_SECRET: getENVkeys('REFRESH_SECRET'),
    CSRF_SECRET: getENVkeys('CSRF_SECRET'),
    NODE_ENV: getENVkeys('NODE_ENV'),
    FRONTEND_URL: getENVkeys('FRONTEND_URL'),
    COOKIE_SECRET: getENVkeys('COOKIE_SECRET')
}
