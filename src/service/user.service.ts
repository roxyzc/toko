import { Op } from "sequelize";
import User from "../models/user.model";
import cron from "node-cron";

cron.schedule("0 0 0 * * *", async () => {
  const deleteAllUser = await User.destroy({
    where: {
      expiredAt: {
        [Op.lt]: Number(new Date().getTime()),
      },
    },
  });
  console.log(deleteAllUser);
});

export default cron;
