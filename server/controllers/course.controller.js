import Course from "../models/course.model.js";
import AppError from "../utils/appError.js"
import cloudinary from "cloudinary";
import fs from "fs/promises"
export const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({}).select('-lectures');
        res.status(200).json({
            success: true, message: "All courses",
            courses,
        })

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

export const getLecturesByCourseId = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return next(new AppError("Invalid course Id", 400));
        }
        res.status(200).json({
            success: true,
            message: "Course lectures fetched Successfully ",
            lectures: course.lectures,
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }

}

export const createCourse = async (req, res, next) => {
    try {
        const { title, description, category, createdBy } = req.body;
        if (!title || !description || !category || !createdBy) {
            return next(new AppError("All fields are required", 400));
        }
        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: "DuMMY", secure_url: "DUMMY"
            }
        });
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms', // Save files in a folder named lms
                width: 250,
                height: 250,
                gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                crop: 'fill',
            });
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`);

        }
        await course.save();
        res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            course,
        })

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}
export const updateCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findByIdAndUpdate(courseId, {
            $set: req.body
        }, {
            runValidators: true,
        })
        if (!course) {
            return next(new AppError("Course does not exists", 400));

        }
        //await course.save();
        res.status(200).json({
            success: true,
            message: "Course updated Successfully",
            course,
        })

    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}

export const deleteCourse = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
        }
        await Course.findByIdAndDelete(courseId);
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        })
    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}


export const addLectureToCourseById = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { courseId } = req.params;
        if (!title || !description) {
            return next(new AppError("All fields are required", 500));
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return next(new AppError("Course with given id does not exist ", 500));
        }
        const lectureData = {}
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms', // Save files in a folder named lms
                chunk_size: 50000000, // 50 mb size
                resource_type: 'video',

            });
            if (result) {
                // Set the public_id and secure_url in array
                lectureData.public_id = result.public_id;
                lectureData.secure_url = result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`);

        }
        course.lectures.push({
            title,
            description,
            lecture: lectureData,
        });
        course.numberOfLectures = course.lectures.length;
        await course.save();
        res.status(200).json({
            success: true,
            message: "Lecture added  Successfully",
            course,
        })


    } catch (e) {
        return next(new AppError(e.message, 500));
    }
}