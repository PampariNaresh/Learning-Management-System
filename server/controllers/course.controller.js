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
            fs.rm(`/tmp/${req.file.filename}`);

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
    const { title, description } = req.body;
    const { courseId } = req.params;

    let lectureData = {};

    if (!title || !description) {
        return next(new AppError('Title and Description are required', 400));
    }

    const course = await Course.findById(courseId);
    console.log(course)
    if (!course) {
        return next(new AppError('Invalid course id or course not found.', 400));
    }

    // Run only if user sends a file
    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms', // Save files in a folder named lms
                chunk_size: 50000000, // 50 mb size
                resource_type: 'video',
            });

            // If success
            if (result) {
                // Set the public_id and secure_url in array
                lectureData.public_id = result.public_id;
                lectureData.secure_url = result.secure_url;
            }

            // After successful upload remove the file from local storage
            fs.rm(`/tmp/${req.file.filename}`);
        } catch (error) {
            // Empty the uploads directory without deleting the uploads directory
            for (const file of await fs.readdir('uploads/')) {
                await fs.unlink(path.join('uploads/', file));
            }

            // Send the error message
            return next(
                new AppError(
                    JSON.stringify(error) || 'File not uploaded, please try again',
                    400
                )
            );
        }
    }

    course.lectures.push({
        title,
        description,
        lecture: lectureData,
    });

    course.numberOfLectures = course.lectures.length;

    // Save the course object
    await course.save();

    res.status(200).json({
        success: true,
        message: 'Course lecture added successfully',
        course,
    });
};



export const removeLectureFromCourse = async (req, res, next) => {
    // Grabbing the courseId and lectureId from req.query
    const { courseId, lectureId } = req.query;
    console.log(req.query)

    console.log(courseId);

    // Checking if both courseId and lectureId are present
    if (!courseId) {
        return next(new AppError('Course ID is required', 400));
    }

    if (!lectureId) {
        return next(new AppError('Lecture ID is required', 400));
    }

    // Find the course uding the courseId
    const course = await Course.findById(courseId);

    // If no course send custom message
    if (!course) {
        return next(new AppError('Invalid ID or Course does not exist.', 404));
    }

    // Find the index of the lecture using the lectureId
    const lectureIndex = course.lectures.findIndex(
        (lecture) => lecture._id.toString() === lectureId.toString()
    );

    // If returned index is -1 then send error as mentioned below
    if (lectureIndex === -1) {
        return next(new AppError('Lecture does not exist.', 404));
    }

    // Delete the lecture from cloudinary
    await cloudinary.v2.uploader.destroy(
        course.lectures[lectureIndex].lecture.public_id,
        {
            resource_type: 'video',
        }
    );

    // Remove the lecture from the array
    course.lectures.splice(lectureIndex, 1);

    // update the number of lectures based on lectres array length
    course.numberOfLectures = course.lectures.length;

    // Save the course object
    await course.save();

    // Return response
    res.status(200).json({
        success: true,
        message: 'Course lecture removed successfully',
    });
};
