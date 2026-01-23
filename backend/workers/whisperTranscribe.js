const transcribeWithWhisper = async (_clipPath) => {
  return {
    text: "This moment was incredible and the audience reaction spiked right here.",
    words: [
      { word: "This", start: 0.0, end: 0.3 },
      { word: "moment", start: 0.31, end: 0.62 },
      { word: "was", start: 0.63, end: 0.8 },
      { word: "incredible", start: 0.81, end: 1.2 },
      { word: "and", start: 1.21, end: 1.35 },
      { word: "the", start: 1.36, end: 1.48 },
      { word: "audience", start: 1.49, end: 1.9 },
      { word: "reaction", start: 1.91, end: 2.2 },
      { word: "spiked", start: 2.21, end: 2.5 },
      { word: "right", start: 2.51, end: 2.7 },
      { word: "here", start: 2.71, end: 2.9 }
    ]
  };
};

module.exports = {
  transcribeWithWhisper
};
