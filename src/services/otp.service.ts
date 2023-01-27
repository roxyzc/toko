import { Op } from "sequelize";
import Otp from "../models/otp.model";
import cron from "node-cron";

cron.schedule("*/5 * * * *", async () => {
  const deleteAllOtp = await Otp.destroy({
    where: {
      expiredAt: {
        [Op.lt]: Number(new Date().getTime()),
      },
    },
  });
  console.log(deleteAllOtp);
});

export default cron;
