export const generateOTP = (num?: Number): any => {
  let len = num ?? 6;
  let str = "";
  const digits = "0123456789";
  for (let i = 0; i < Number(len); i++) {
    str += digits[Math.floor(Math.random() * 10)];
  }
  return str;
};
