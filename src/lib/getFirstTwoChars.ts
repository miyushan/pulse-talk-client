export const getFirstTwoChars = (str: string) => {
  const words = str.split(" ");
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  } else {
    return words.map((word) => word[0].toUpperCase()).join("");
  }
};
