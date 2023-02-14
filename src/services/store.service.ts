import Store from "@model/store.model";
import { checkUserInStore } from "@util/checkUserInStore.util";

const checkAccessUserInStore = async (userId: string, idStore: string): Promise<Boolean> => {
  const store = await Store.findOne({
    where: { idStore },
    attributes: ["access"],
  });
  if (!store) return Promise.resolve(false);
  const access: any[] = Array.from(JSON.parse(store.access));
  if ((await checkUserInStore(userId, access)) === false) return Promise.resolve(false);
  return Promise.resolve(true);
};

export { checkAccessUserInStore };
