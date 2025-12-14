import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs"
import { ZodError, z } from "zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import qs from 'query-string';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));



export function formatPrice(
  amount: number, 
  currency: string = 'PHP', 
  locale: string = 'en-PH',
  options?: Intl.NumberFormatOptions
): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  return new Intl.NumberFormat(locale, { ...defaultOptions, ...options }).format(amount);
}


// Format Number
const NUMBER_FORMATTER = new Intl.NumberFormat('en-PH');

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

export function hashedPassword(password: string) { 
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);  
}

export function verifyPassword(password: string, hashedPassword: string) { 
  return bcrypt.compareSync(password, hashedPassword);
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatErrors(error: any | unknown) {
  
  if (isRedirectError(error)) {
    throw error;
  }

  // 2. Zod Validation Error
  if (error instanceof ZodError || (error)?.name === "ZodError") {
    // Flattened Zod error
    const { fieldErrors } = z.flattenError(error);

    const combinedErrMsgs: string[] = [];

    const mappedFields: Record<string, string> = {};

    Object.entries(fieldErrors).forEach(([field, errors]) => {
      if (Array.isArray(errors)) {
        mappedFields[field] = errors[0];
        combinedErrMsgs.push(...errors);
      }
    });

    const combinedErrMsg = combinedErrMsgs.length > 0 ? combinedErrMsgs.join('. ') : null;

    return {
      success: false,
      type: "validation",
      message: combinedErrMsg ?? "Validation failed.",
      redirectTo: null,
      data: null,
      fieldErrors: mappedFields, // <-- FIELD-LEVEL MAPPING
    };
  }

  if (error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002') {
      return {
        success: false,
        type: "prisma",
        message: "That email is already registered.",
        redirectTo: null,
        data: null,
        fieldErrors: { email: "This email is already in use." },
      };
  }

  return {
    success: false,
    type: "unknown",
    redirectTo: null,
    message: "Something went wrong. Please try again.",
    data: null,
  };
}

export function roundDecimalToTwo(value: number | string) {
  if (typeof value === 'number') { 
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }
  else { 
    throw new Error('Value is not a number or string');
  }
}
 
// Shorten UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};


// form the pagination links
export function formUrlQuery({
  params,
  key,
  value
}: {
    params: string;
    key: string;
    value: string | null;
}) {
  const query = qs.parse(params);
  query[key] = value;
  return qs.stringifyUrl({
    url: window.location.pathname,
    query: query
  }, {
    skipNull: true
  });
}


