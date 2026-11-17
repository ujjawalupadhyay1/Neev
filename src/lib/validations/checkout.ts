import { z } from 'zod';

export const checkoutSchema = z
  .object({
    poolId: z.string().min(1, 'Pool ID is required'),
    poolSlug: z.string().min(1, 'Pool slug is required'),
    contributorName: z
      .string()
      .min(2, 'Please enter your full name (at least 2 characters)')
      .max(80, 'Name is too long'),
    contributorEmail: z.string().email('Please enter a valid email for the receipt').optional().or(z.literal('')),
    contributorPhone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
      .optional()
      .or(z.literal('')),
    relationship: z.enum(['Relative', 'Friend', 'Colleague', 'Well-Wisher'], {
      required_error: 'Please select your relationship to the recipient',
    }),
    amount: z
      .number({ invalid_type_error: 'Please enter a valid amount' })
      .min(10, 'Minimum contribution is ₹ 10')
      .max(10000000, 'Maximum contribution is ₹ 1 Crore'),
    contributorPan: z.string().optional(),
    message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
    isMessagePublic: z.boolean().default(true),
    consentAgreed: z.literal(true, {
      errorMap: () => ({
        message: 'You must confirm that this is a voluntary domestic gift under the Gift Policy',
      }),
    }),
  })
  .refine(
    (data) => {
      if (data.amount >= 50000) {
        if (!data.contributorPan) return false;
        // Standard 10-character Indian PAN format: 5 letters, 4 numbers, 1 letter
        return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.contributorPan.toUpperCase());
      }
      return true;
    },
    {
      message:
        'Permanent Account Number (PAN) is mandatory for gifts of ₹ 50,000 or greater (Income Tax Act Section 56(2)(x))',
      path: ['contributorPan'],
    }
  );

export type CheckoutInput = z.infer<typeof checkoutSchema>;

