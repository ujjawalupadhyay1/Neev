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

    // V-KYC and Anti-Misleading Verification for Public Pools
    panNumber: z.string().optional(),
    aadhaarLast4: z.string().optional(),
    legalFullName: z.string().optional(),
    vKycStatus: z.string().optional(),
    vKycVideoUrl: z.string().optional(),
    vKycCoordinates: z.string().optional(),
    proofDocumentType: z.string().optional(),
    proofDocumentName: z.string().optional(),
    proofDocumentUrl: z.string().optional(),
    proofNotes: z.string().optional(),
    bankAccountNumber: z.string().optional(),
    bankIfsc: z.string().optional(),
    bankName: z.string().optional(),
    bankBeneficiaryName: z.string().optional(),
    upiVpa: z.string().optional(),
    bankVerified: z.boolean().optional(),
    fraudDeclarationAgreed: z.boolean().optional(),
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
  )
  .refine(
    (data) => {
      if (data.visibility === 'public') {
        if (!data.panNumber || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.panNumber)) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'A valid 10-character Indian PAN number (e.g. ABCDE1234F) is mandatory for public listings',
      path: ['panNumber'],
    }
  )
  .refine(
    (data) => {
      if (data.visibility === 'public') {
        return !!data.fraudDeclarationAgreed;
      }
      return true;
    },
    {
      message: 'You must accept the Anti-Fraud and Truthfulness Declaration under IT Act Section 66D for public listings',
      path: ['fraudDeclarationAgreed'],
    }
  );

export type CreatePoolInput = z.infer<typeof createPoolSchema>;

