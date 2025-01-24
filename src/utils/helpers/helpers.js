// Capitalize the first letter of a string
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Generate a random ID
function generateId(length = 8) {
	return Math.random().toString(36).substring(2, length + 2);
}

// get two {key: number} json and return their combine
function combineSumJson(json1, json2) {
  const combined = { ...json1 };

  for (const key in json2) {
    if (combined.hasOwnProperty(key)) {
      combined[key] += json2[key];
    } else {
      combined[key] = json2[key];
    }
  }

  return combined;
}

module.exports = { capitalize, generateId, combineSumJson };
