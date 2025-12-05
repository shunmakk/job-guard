export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (character) {
      const randomValue = (Math.random() * 16) | 0;
      return (
        character === "x" ? randomValue : (randomValue & 0x3) | 0x8
      ).toString(16);
    }
  );
};
