const { recordFeedback } = require("../services/feedbackEngine");
const { insertFeedback } = require("../repositories/feedbackRepository");
const { blendFeedback } = require("../services/creativeMemory");

jest.mock("../repositories/feedbackRepository");
jest.mock("../services/creativeMemory");

describe("Feedback Engine", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should record feedback and trigger memory blending", async () => {
    insertFeedback.mockResolvedValueOnce({ id: "123", rating: 5 });
    blendFeedback.mockResolvedValueOnce({});

    const feedbackPayload = {
      userId: "user-1",
      generationId: "gen-1",
      rating: 5,
      edits: "Made it brighter",
      signals: { reuse: true, acceptance: true }
    };

    const result = await recordFeedback(feedbackPayload);

    expect(insertFeedback).toHaveBeenCalledTimes(1);
    expect(insertFeedback).toHaveBeenCalledWith(expect.objectContaining({
      userId: "user-1",
      generationId: "gen-1",
      rating: 5
    }));

    expect(blendFeedback).toHaveBeenCalledTimes(1);
    expect(blendFeedback).toHaveBeenCalledWith("user-1", {
      rating: 5,
      edits: "Made it brighter",
      signals: { reuse: true, acceptance: true }
    });

    expect(result).toHaveProperty("id");
    expect(result.rating).toBe(5);
  });
});
