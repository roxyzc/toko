import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Store from "@model/store.model";
import { RSTORE, STATUS } from "@tp/default";
import User from "@model/user.model";
import { sendEmailForCollaboration } from "@util/sendEmail.util";

const add = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { idStore } = req.params;
  const { email } = req.body;
  const { userId } = req.USER;
  try {
    const user = await User.findOne({
      where: { email, status: { [Op.eq]: "active" as unknown as STATUS }, expiredAt: null },
      attributes: ["id", "nama"],
    });
    if (!user) return res.status(404).json({ success: false, error: { message: "user not found" } });
    const findUser = await Store.findAndCountAll({
      where: { access: { [Op.and]: { [Op.like]: `%${user.getDataValue("id")}%` } } },
      attributes: ["idStore", "nameStore"],
    });
    if (findUser.count >= 3) return res.status(400).json({ success: false, error: { message: "maximum 3" } });
    const cekUserOwnerOrEmployee = await Store.findOne({
      where: { access: { [Op.and]: { [Op.like]: `%${userId}%`, [Op.notLike]: "%employee%" } } },
    });
    if (!cekUserOwnerOrEmployee) return res.status(403).json({ success: false, error: { message: "failed" } });
    const store = await Store.findOne({
      where: { idStore },
      attributes: ["idStore", "nameStore", "access"],
    });

    if (!store) return res.status(404).json({ success: false, error: { message: "store not found" } });
    const access: any[] = Array.from(JSON.parse(store.access));

    access.forEach((value: any) => {
      if (value.userId == user.getDataValue("id")) {
        throw new Error("user already exists");
      }
    });

    access.push(
      JSON.parse(
        JSON.stringify({ userId: user.getDataValue("id"), role: "employee" as unknown as RSTORE, status: "pending" })
      )
    );
    const valid = await sendEmailForCollaboration(
      req,
      email,
      user.getDataValue("nama"),
      store.getDataValue("nameStore"),
      idStore
    );
    if (!valid) throw new Error("sendEmail failed");
    await Store.update({ access: JSON.stringify(access) }, { where: { idStore } });
    res.status(200).json({ succes: true, data: { message: "success" } });
  } catch (error: any) {
    if (error.message == "user already exists") error.status = 409;
    next(error);
  }
};

const accept = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { idStore } = req.params;
  const { userId } = req.USER;
  try {
    const findUser = await Store.findAndCountAll({
      where: { access: { [Op.and]: { [Op.like]: `%${userId}%`, [Op.notLike]: `%pending%` } } },
      attributes: ["idStore", "nameStore"],
    });
    if (findUser.count >= 3) return res.status(400).json({ success: false, error: { message: "maximum 3" } });

    const store = await Store.findOne({
      where: { idStore, access: { [Op.like]: `%${userId}%` } },
      attributes: ["idStore", "nameStore", "access"],
    });

    if (!store) return res.status(404).json({ success: false, error: { message: "user not found" } });
    const access: any[] = Array.from(JSON.parse(store.access));

    let data: any[] = [];
    access.forEach((x, _i) => {
      if (x.userId === userId && x?.status === undefined) throw new Error("already verification");
      if (x.userId === userId && x?.status !== undefined) data.push({ userId, role: x.role });
      if (x.userId !== userId && x?.status !== undefined)
        data.push({ userId: x.userId, role: x.role, status: x.status });
      if (x.userId !== userId && x?.status === undefined) data.push({ userId: x.userId, role: x.role });
    });
    await Store.update({ access: JSON.stringify(data) }, { where: { idStore } });
    res.status(200).json({ succes: true, data: { message: "success" } });
  } catch (error: any) {
    if (error.message == "already verification") error.status = 409;
    next(error);
  }
};

export { add, accept };
