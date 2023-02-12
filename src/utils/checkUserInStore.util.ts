const checkUserInStore = async (id: String, data: any[]) => {
  const check = data.find(value => id === value.userId);
  return check ? true : false;
};

const checkUserInStoreAsOwner = async (id: String, data: any[]) => {
  const check = data.find(value => id === value.userId && value.role === "owner");
  return check ? true : false;
};

export { checkUserInStore, checkUserInStoreAsOwner };
