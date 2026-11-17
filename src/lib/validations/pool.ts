import { z } from 'zod';

export const createPoolSchema = z
  .object({
    category: z.enum(['wedding', 'education', 'milestone', 'universal'], {
      required_error: 'Please select a milestone category',
    }),
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters')
      .max(100, 'Title cannot exceed 100 characters'),
    targetAmount: z
      .number({ invalid_type_error: 'Please enter a valid amount' })
      .min(1000, 'Minimum target amount is ₹ 1,000')
      .max(100000000, 'Maximum target amount is ₹ 10 Crore'),
    eventDate: z.string().optional(),
    story: z
      .string()
      .min(20, 'Please write at least a short story (20 characters minimum) explaining your dream')
      .max(3000, 'Story cannot exceed 3,000 characters'),
    coverImageUrl: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
    visibility: z.enum(['invite_only', 'public'], {
      required_error: 'Please select visibility mode',
    }),
    isPinRequired: z.boolean().default(false),
    accessPin: z.string().optional(),
    agreedToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must confirm the platform terms and ₹0 fee non-custodial model' }),
    }),
  })
  .refine(
    (data) => {
      if (data.visibility === 'invite_only' && data.isPinRequired) {
        return !!data.accessPin && /^\d{4}$/.test(data.accessPin);
      }
      return true;
    },
    {
      message: 'Please provide a valid 4-digit PIN for protected invite-only access',
      path: ['accessPin'],
    }
  );

export type CreatePoolInput = z.infer<typeof createPoolSchema>;

