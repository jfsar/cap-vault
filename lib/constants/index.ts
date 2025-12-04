export const APP_NAME = 'Urban Cap'
export const APP_DESCRIPTION = 'A modern ecommerce platform powered by Next.js'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const LATEST_PRODUCT_LIMIT = Number(process.env.LATEST_PRODUCT_LIMIT) || 4;

export const signInDefaultValues = {
    email: '',
    password: ''
};

export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
};