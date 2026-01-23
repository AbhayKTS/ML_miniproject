const { z } = require("zod");

const generateBaseSchema = z.object({
  userId: z.string().optional(),
  prompt: z.string().min(1),
  controls: z
    .object({
      originality: z.number().min(0).max(100).optional(),
      tone: z.string().optional(),
      complexity: z.number().min(0).max(100).optional(),
      culturalContext: z.string().optional()
    })
    .optional(),
  constraints: z.array(z.string()).optional()
});

const feedbackSchema = z.object({
  userId: z.string().optional(),
  generationId: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  edits: z.string().optional(),
  signals: z.object({ reuse: z.boolean().optional(), acceptance: z.boolean().optional() }).optional()
});

const memoryUpdateSchema = z.object({
  userId: z.string().optional(),
  updates: z.object({
    tone: z.string().optional(),
    themes: z.array(z.string()).optional(),
    visualStyle: z.string().optional(),
    audioStyle: z.string().optional(),
    culturalContext: z.string().optional(),
    lock: z.boolean().optional()
  })
});

const projectSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional()
});

const validate = (schema, payload) => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    return { success: false, errors: result.error.flatten() };
  }
  return { success: true, data: result.data };
};

module.exports = {
  generateBaseSchema,
  feedbackSchema,
  memoryUpdateSchema,
  projectSchema,
  validate
};
