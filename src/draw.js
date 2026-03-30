export const generateDraw = (userScores = []) => {
  let numbers = [];

  // 🔥 Add 1–2 numbers from user scores (if available)
  if (userScores.length > 0) {
    const shuffled = [...new Set(userScores)].sort(() => 0.5 - Math.random());

    numbers.push(...shuffled.slice(0, 2)); // take 2 user numbers
  }

  // Fill remaining with random numbers
  while (numbers.length < 5) {
    let num = Math.floor(Math.random() * 45) + 1;

    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }

  return numbers;
};