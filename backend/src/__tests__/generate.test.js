// Unit tests for text generation service
const { generateText } = require('../services/generationService');

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: async () => ({ response: { text: () => 'mocked output' } })
    })
  }))
}));

describe('generateText', () => {
  it('should return generated text', async () => {
    const result = await generateText('Hello world');
    expect(result).toBe('mocked output');
  });
});
