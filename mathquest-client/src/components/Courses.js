// Import necessary dependencies from React and other modules
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { createPortal } from "react-dom";
import RegisterCourseModal from "./RegisterCourseModal";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Define the Courses functional component
const Courses = () => {
  const navigate = useNavigate();
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Effect hook to fetch offered courses when the component mounts
  useEffect(() => {
    fetchOfferedCourses();
  }, []);

  // Asynchronous function to fetch offered courses from the server
  const fetchOfferedCourses = async () => {
    // Fetch data from the server using the provided connection details
    const data = await fetch(BASE_URL + "/api/courses", {
      method: "POST",
      body: JSON.stringify({
        email: sessionStorage.getItem("email"),
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Access-control-allow-origin": "*",
        "Access-control-allow-methods": "*",
      },
    });
    const json = await data.json();

    

    setOfferedCourses(json?.courses);
  };

  // Function to open the registration modal for a selected course
  const openModel = (i) => {
    const selectedCourse = offeredCourses[i];
    sessionStorage.setItem("CourseID", selectedCourse?._id);
    setSelectedCourse(selectedCourse);
    setShowModal(true);
  };

  // Function to close the registration modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  // Select user information from the Redux store
  const user = useSelector((store) => {
    return store.user;
  });

  // Asynchronous function to register the user for the selected course
  const courseRegistration = async () => {
    // Fetch data from the server to register the user for the course
    const data = await fetch(
      BASE_URL + "/api/courses/registered/new",
      {
        method: "POST",
        body: JSON.stringify({
          email: user.email,
          courseId: selectedCourse._id,
        }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Access-control-allow-origin": "*",
          "Access-control-allow-methods": "*",
        },
      }
    );
    const json = await data.json();
    // Navigate to the dashboard page after course registration
    navigate("/dashboard");
  };

  // JSX code for the Courses component
  return (
    <div className="bg-slate-900 font-mono">
      <Header />
      <div className="pt-28"></div>
      <section className="m-8 ">
        <div>
          <h1 className="text-3xl mx-20 font-bold text-white">
            Our top picks for you!
          </h1>
          <div className="flex flex-wrap justify-center">
            {offeredCourses &&
              offeredCourses.map((c, index) => {
                return (
                  <div key={c.courseName}>
                    <div className="my-10 mx-8 w-72 h-[550px] bg-white border-2 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
                      <img
                        className="w-[100%] h-[200px]"
                        src={c.courseImg}
                        alt=""
                      />

                      <div className="p-5">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {c.courseName}
                        </h5>
                        <p className="mb-3 h-44 font-normal  overflow-y-hidden text-gray-700 dark:text-gray-400">
                          {c.overview}
                        </p>
                        <p className="mb-3 font-bold text-white">
                          {c.courseInstructor}
                        </p>

                        <button
                          onClick={() => openModel(index)}
                          className="text-white text-right underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      {showModal &&
        createPortal(
          <RegisterCourseModal
            data={selectedCourse}
            onClose={() => setShowModal(false)}
            handleCourseRegister={() => courseRegistration()}
          />,
          // Attach the modal to the element with the id "modal"
          document.getElementById("modal")
        )}
    </div>
  );
};

// Export the Courses component as the default export
export default Courses;
