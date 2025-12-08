export const APP_NAME = 'UrbanCap'
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

export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', ') : ['Paypal', 'Stripe', 'CashOnDelivery'];

export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || "Paypal";