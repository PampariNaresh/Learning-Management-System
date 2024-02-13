import { model, Schema } from "mongoose";
const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minLength: [8, "Title must be at least 8 characters"],
        maxLength: [59, "Title should be less thn 69 characters"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [8, "Descriptione must be at least 8 characters"],
        maxLength: [200, "Description should be less thn 69 characters"],
        trim: true,
    }
    , category: {
        type: String,
        required: [true, "Category is required"],
    },
    thumbnail: {
        public_id: {
            type: String,
            required: true,
        }, secure_url: {
            type: String,
            required: true,
        }
    },
    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String,
                    required: true,
                },
                secure_url: {
                    type: String,
                    required: true,
                },
            },
        },
    ],
    numberOfLectures: {
        type: Number, default: 0,

    },
    createdBy: {
        type: String,
        required: true,
    }


}, {
    timestamp: true
})

const Course = new model("Course", courseSchema)
export default Course;