// Calculate Euclidean distance between two sets of facial landmarks
const calculateDistance = (landmarks1, landmarks2) => {
    let sum = 0;
    for (let i = 0; i < landmarks1.length; i++) {
      const dx = landmarks1[i][0] - landmarks2[i][0];
      const dy = landmarks1[i][1] - landmarks2[i][1];
      sum += dx * dx + dy * dy;
    }
    return Math.sqrt(sum);
  };
  
  // Compare a face with registered faces and find the best match
  const findBestMatch = (inputLandmarks, faces, threshold = 80) => {
    let bestMatch = null;
    let minDistance = Infinity;
  
    console.log("Matching input face data:", inputLandmarks); // Log the input face data
  
    for (const face of faces) {
      console.log("Comparing with stored face data:", face.faceData); // Log the stored face data
  
      const distance = calculateDistance(inputLandmarks, face.faceData);
      console.log(`Calculated distance: ${distance}`); // Log the distance between faces
  
      if (distance < minDistance && distance < threshold) {
        minDistance = distance;
        bestMatch = face;
      }
    }
  
    return bestMatch;
  };
  
  module.exports = { calculateDistance, findBestMatch };
  