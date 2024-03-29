// Import necessary dependencies from React and other modules
import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useSelector } from "react-redux";
import { auth } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
//import axios from "axios";
import { BASE_URL } from "../utils/constants";
import TeacherDashboard from "./TeacherDashboard";
import RegisteredUsers from "./RegisteredUsers";
import StudentRegisteredCourses from "./StudentRegisteredCourses";
import AdminDashboard from "./AdminDashboard";
import Discussion from "./Discussion";
import QuizContainer from "./QuizContainer";

// Define the Dashboard component
const Dashboard = () => {
  const navigate = useNavigate();
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [userType, setUserType] = useState("student");
  const [course, setCourse] = useState(null);
  const [manageCourse, setManageCourse] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // Define a function to fetch registered courses for a given email
  const getRegisteredCourses = async (email) => {
    // Make a fetch request to the server to get registered courses
    const data = await fetch(BASE_URL + "/api/courses/registered", {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Access-control-allow-origin": "*",
        "Access-control-allow-methods": "*",
      },
    });
    const json = await data.json();

    // Update the state with the fetched courses
    setRegisteredCourses(json?.courses);
  };

  // Use the useSelector hook to get user information from the Redux store
  const user = useSelector((store) => {
    return store.user;
  });

  //picking course for Teacher
  const getCourseForTeacher = async (email) => {
    const data = await fetch(BASE_URL + "/api/courses/teachers/getAllCourses", {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Access-control-allow-origin": "*",
        "Access-control-allow-methods": "*",
      },
    });
    const json = await data.json();

    setCourse(json.courses[0]);
    sessionStorage.setItem('CourseID',json.courses[0]._id)
    fetchAllRegisteredStudents(json.courses[0]._id);
  };

  //fetch all registered students in a course
  const fetchAllRegisteredStudents = async (courseID) => {
    const data = await fetch(
      BASE_URL + "/api/courses/teachers/getRegisteredUsers",
      {
        method: "POST",
        body: JSON.stringify({
          courseID: courseID,
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
    setRegisteredUsers(json.userInfo);
  };

  useEffect(() => {
    if (sessionStorage.getItem("email") == undefined) {
      navigate("/");
    }

    if (sessionStorage.getItem("userType") == "teacher") {
      getCourseForTeacher(sessionStorage.getItem("email"));
      setUserType("teacher");
    } else if(sessionStorage.getItem("userType") == "admin") {
      
      setUserType("admin");
    } else {
      getRegisteredCourses(sessionStorage.getItem("email"));
      setUserType("student");
    }
  }, []);

  const handleCourse = () => {
    setManageCourse(false);
    getCourseForTeacher(sessionStorage.getItem("email"));
  };

  return (
    <div className="bg-slate-900 font-mono w-[100vw] h-[200vh]">
      <Header />
      <div className="pt-40  mx-16 font-mono text-black-200  ">
        {user && (
          <div>
            {/* Render a welcome message with the user's display name */}
            <h1 className="text-5xl text-white">
              Welcome {user?.displayName}!
            </h1>

            {registeredCourses && userType == "student" && (
              <h3 className="text-2xl mt-4 text-white">
                {" "}
                Finish off where you left!
              </h3>
            )}

            {userType == "teacher" && (
              <h3 className="text-2xl mt-4 text-white">
                {" "}
                Manage your courses here!
              </h3>
            )}

            {!registeredCourses && userType == "student" && (
              <div>
                <h5 className="text-2xl mt-5 text-white">
                  Seems like you are not registered in a course!
                </h5>
                <h5 className="text-2xl mt-5 text-white">
                  Choose your desired course to start!
                </h5>

                <Link to="/all-courses">
                  {" "}
                  <button className="rounded-lg border-2 border-white text-white h-12 p-2 my-8 w-60  ">
                    Offered Courses{" "}
                  </button>
                </Link>
              </div>
            )}

            <div className="flex justify-between">
              {registeredCourses && userType == "student" && (
                <StudentRegisteredCourses
                  registeredCourses={registeredCourses}
                />
              )}

              <div>
                {course && !manageCourse && userType == "teacher" && (
                  <div className="my-10 mx-8 w-72 h-[300px] bg-white border-2 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer">
                    <img
                      className="w-[100%] h-[200px]"
                      src={course.courseImg}
                      alt=""
                    />

                    <div className="p-5">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {course.courseName}
                      </h5>

                      <button
                        onClick={() => setManageCourse(true)}
                        className="text-white float-right underline"
                      >
                        Manage Course &gt;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {manageCourse && userType == "teacher" && (
                <div>
                <TeacherDashboard
                  course={course}
                  showManageCourse={handleCourse}
                />

                <Discussion />
                <h1 className="text-3xl text-white my-4">Course Quizzes</h1>
                <QuizContainer showStartQuiz="false" />
                </div>
              )}

              {!manageCourse && userType == "teacher" && (
                <RegisteredUsers registeredUsers={registeredUsers} />
              )}

              {userType == "admin" && <AdminDashboard registeredUsers={registeredUsers} />}
            </div>
          </div>
        )}
      </div>

      {/* <Footer className="fixed bottom-0" /> */}
    </div>
  );
};

// Export the Dashboard component
export default Dashboard;
