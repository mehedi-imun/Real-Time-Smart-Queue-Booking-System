import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { EventRoutes } from "../modules/events/event.route";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/event",
    route: EventRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
