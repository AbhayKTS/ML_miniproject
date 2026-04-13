const summarizeFeedback = (feedbackEntries = []) => {
  if (!feedbackEntries.length) {
    return {
      avgRating: null,
      lowRatingCount: 0,
      highRatingCount: 0,
      frequentKeywords: []
    };
  }

  const ratings = feedbackEntries.map((entry) => Number(entry.rating)).filter((value) => Number.isFinite(value));
  const avgRating = ratings.length ? ratings.reduce((acc, value) => acc + value, 0) / ratings.length : null;

  const keywordCounts = new Map();
  for (const entry of feedbackEntries) {
    const words = String(entry.edits || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 4);
    for (const word of words) {
      keywordCounts.set(word, (keywordCounts.get(word) || 0) + 1);
    }
  }

  const frequentKeywords = [...keywordCounts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word]) => word);

  return {
    avgRating,
    lowRatingCount: ratings.filter((rating) => rating <= 2).length,
    highRatingCount: ratings.filter((rating) => rating >= 4).length,
    frequentKeywords
  };
};

const buildAdaptiveProfile = ({ memory, feedbackSummary }) => {
  const profile = {
    toneBias: memory?.tone || "balanced",
    originalityWeight: 0.7,
    complexityWeight: 0.6,
    reinforcementTags: feedbackSummary.frequentKeywords || []
  };

  if (feedbackSummary.avgRating !== null && feedbackSummary.avgRating < 3) {
    profile.toneBias = "clear grounded";
    profile.originalityWeight = 0.55;
    profile.complexityWeight = 0.5;
  } else if (feedbackSummary.avgRating !== null && feedbackSummary.avgRating >= 4) {
    profile.originalityWeight = 0.8;
    profile.complexityWeight = 0.7;
  }

  return profile;
};

const applyAdaptiveControls = ({ controls = {}, adaptiveProfile }) => {
  const originality = Number.isFinite(controls.originality)
    ? controls.originality
    : Math.round(adaptiveProfile.originalityWeight * 100);

  const complexity = Number.isFinite(controls.complexity)
    ? controls.complexity
    : Math.round(adaptiveProfile.complexityWeight * 100);

  return {
    ...controls,
    tone: controls.tone || adaptiveProfile.toneBias,
    originality,
    complexity
  };
};

module.exports = {
  summarizeFeedback,
  buildAdaptiveProfile,
  applyAdaptiveControls
};
