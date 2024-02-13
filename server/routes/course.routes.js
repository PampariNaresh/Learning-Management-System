import { Router } from "express";
import { getAllCourses, getLecturesByCourseId } from "../controllers/course.controller.js"
import { updateCourse, deleteCourse, createCourse } from "../controllers/course.controller.js"
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { authorizedRoles } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { addLectureToCourseById } from "../controllers/course.controller.js"
const router = Router();
router.route("/").get(isLoggedIn, getAllCourses).post(isLoggedIn, authorizedRoles('ADMIN'), upload.single("thumbnail"), createCourse);
//router.route("/:courseId").get(isLoggedIn, getLecturesByCourseId).put(updateCourse).delete(deleteCourse);
router.route("/:courseId").get(isLoggedIn, getLecturesByCourseId).put(isLoggedIn, authorizedRoles("ADMIN"), updateCourse).delete(isLoggedIn, authorizedRoles("ADMIN"), deleteCourse).post(isLoggedIn, authorizedRoles("ADMIN"), upload.single("lecture"), addLectureToCourseById);
export default router;
