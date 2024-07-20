import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isEmail,isValidPassword } from "../../helpers/regexMatcher";
import HomeLayout from "../Layouts/HomeLayout";
import { createAccount } from "../redux/Slices/authSlice";

function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
     const [signupDetails, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [previewImage, setImagePreview] = useState("");
  // function to set the signup data
  const handleUserInput = (event) => {
    const { name, value } = event.target;
    setSignupData({
      ...signupDetails,
      [name]: value,
    });
  };

  // function to handle the image upload
  
  const handleImage = (event) => {
    event.preventDefault();
    // getting the image
    const uploadedImage = event.target.files[0];

    // if image exists then getting the url link of it

    if (uploadedImage) {
      setSignupData({
        ...signupDetails,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        setImagePreview(this.result);
      });
    }
  };

  // function to create account
  const createNewAccount = async (event) => {
    event.preventDefault();

    // checking the empty fields
    if (
      !signupDetails.avatar ||
      !signupDetails.email ||
      !signupDetails.fullName ||
      !signupDetails.password
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    // checking the name field length
    if (signupDetails.fullName.length < 5) {
      toast.error("Name should be atleast of 5 characters");
      return;
    }

    // email validation using regex
    if (
      !isEmail(signupDetails.email)
    ) {
      toast.error("Invalid email id");
      return;
    }

    // password validation using regex
    if (!isValidPassword(signupDetails.password)) {
      toast.error(
        "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
      );
      return;
    }

    // creating the form data from the existing data
    const formData = new FormData();
    formData.append("fullName", signupDetails.fullName);
    formData.append("email", signupDetails.email);
    formData.append("password", signupDetails.password);
    formData.append("avatar", signupDetails.avatar);

    // calling create account action
    const res = await dispatch(createAccount(formData));

    // redirect to login page if true
    if (res.payload){ navigate('/');}

    // clearing the signup inputs
    setSignupData({
      fullName: "",
      email: "",
      password: "",
      avatar: "",
    });
    setImagePreview("");
  };
  return(
    <HomeLayout>
           <div className="flex items-center justify-center h-[100vh]">
        <form noValidate
          onSubmit={createNewAccount}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Registration Page</h1>

          {/* input for image file */}
          <label className="cursor-pointer" htmlFor="image_uploads">
            {previewImage ? (
              <img
                className="w-24 h-24 rounded-full m-auto"
                src={previewImage}
                alt="preview image"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            onChange={handleImage}
            className="hidden"
            type="file"
            id="image_uploads"
            name="image_uploads"
            accept=".jpg, .jpeg, .png"
          />

          {/* input for name */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold" htmlFor="fullName">
              Name
            </label>
            <input
              required
              type="name"
              name="fullName"
              id="fullName"
              placeholder="Enter your name"
              className="bg-transparent px-2 py-1 border"
              value={signupDetails.fullName}
              onChange={handleUserInput}
            />
          </div>

          {/* input for email */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold" htmlFor="email">
              Email
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="bg-transparent px-2 py-1 border"
              value={signupDetails.email}
              onChange={handleUserInput}
            />
          </div>

          {/* input for password */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold" htmlFor="password">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="bg-transparent px-2 py-1 border"
              value={signupDetails.password}
              onChange={handleUserInput}
            />
          </div>

          {/* registration button */}
          <button
            className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
            type="submit"
          >
            Create Account
          </button>

          <p className="text-center">
            Already have an account ?{" "}
            <Link to={"/signin"} className="link text-accent cursor-pointer">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  )
}
export default SignUp;