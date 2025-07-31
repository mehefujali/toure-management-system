import { Router } from "express";
import { userRoutes } from "./../modules/user/user.route";

const router = Router();

const modiulRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
];

modiulRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
