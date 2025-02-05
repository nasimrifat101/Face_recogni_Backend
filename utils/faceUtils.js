// Calculate cosine similarity between two vectors
const cosineSimilarity = (embedding1, embedding2) => {
  const dotProduct = embedding1.reduce((sum, val, idx) => sum + val * embedding2[idx], 0);
  const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2);
};

// Find the best match based on cosine similarity
const findBestMatch = (inputEmbedding, faces, threshold = 0.5) => {
  let bestMatch = null;
  let highestSimilarity = -1;

  for (const face of faces) {
    const similarity = cosineSimilarity(inputEmbedding, face.faceEmbedding);
    if (similarity > highestSimilarity && similarity >= threshold) {
      highestSimilarity = similarity;
      bestMatch = face;
    }
  }

  return bestMatch;
};

module.exports = { findBestMatch };
