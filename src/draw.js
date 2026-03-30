export const generateDraw = (userScores = []) => {
  let numbers = [];

  // ✅ FIX 4: Only use scores within valid draw range (1–45)
  if (userScores.length > 0) {
    const validScores = userScores.filter((s) => s >= 1 && s <= 45);
    const shuffled = [...new Set(validScores)].sort(() => 0.5 - Math.random());
    numbers.push(...shuffled.slice(0, 2));
  }

  // Fill remaining with random numbers (1–45)
  while (numbers.length < 5) {
    let num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }

  return numbers;
};