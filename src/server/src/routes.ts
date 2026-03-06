import { Router } from "express";
import { getAllUsersController } from "@/controllers";
import { createMockUser } from "./services";

const router = Router();

router.get("/users", getAllUsersController);
router.post("/users", createMockUser)

export default router;