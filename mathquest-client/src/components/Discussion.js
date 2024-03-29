import React, { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../utils/constants";
import DiscussionThreads from "./DiscussionThreads";

// Functional component for the Discussion feature
const Discussion = () => {
  // Refs to store references to title and body input fields
  const discussionTitle = useRef();
  const discussionBody = useRef();

  // Ref to track if data has been loaded from the server
  const dataLoaded = useRef(false);
  // State to store discussion threads and trigger re-renders
  const [discussionThreads, setDisussionThreads] = useState([]);

  // Effect hook to fetch discussion threads when the component mounts or when discussionThreads state changes
  useEffect(() => {
    // Check if discussionThreads has been initialized and data hasn't been loaded yet
    if (discussionThreads && !dataLoaded.current) {
      // Fetch discussion threads from the server
      fetchDiscussionThread();
    }
  }, [discussionThreads]);

  // State to manage the visibility of the discussion form
  const [showCreateDiscussionForm, setShowCreateDiscussionForm] =
    useState(false);

  // Function to fetch discussion threads from the server
  const fetchDiscussionThread = async () => {
    const data = await fetch(
      BASE_URL + "/api/courses/discussions/getAllThreads",
      {
        method: "POST",
        body: JSON.stringify({
          courseID: sessionStorage.getItem("CourseID"),
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

    // Reverse the order of threads and update state
    let reverseList = json?.threads?.reverse();
    dataLoaded.current = true;
    setDisussionThreads(reverseList);
  };

  // Function to set the selected discussion thread in session storage
  const openSelectedDiscussion = (threadId) => {
    sessionStorage.setItem("ThreadID", threadId);
  };

  // Function to handle publishing a new discussion thread
  const handlePublishdiscussion = async () => {
    const title = discussionTitle.current.value;
    const body = discussionBody.current.value;
    const email = sessionStorage.getItem("email");
    const courseID = sessionStorage.getItem("CourseID");

    // Fetch API to create a new discussion thread
    const data = await fetch(
      BASE_URL + "/api/courses/discussions/createThread",
      {
        method: "POST",
        body: JSON.stringify({
          title: title,
          body: body,
          email: email,
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
    dataLoaded.current = true;

    // Hide the discussion form and fetch updated discussion threads
    setShowCreateDiscussionForm(false);
    fetchDiscussionThread();
  };

  // JSX for the Discussion component
  return (
    <div>
      {!showCreateDiscussionForm && (
        <button
          onClick={() => setShowCreateDiscussionForm(true)}
          className="text-white font-bold p-4 mb-4 border-2 border-white rounded-lg"
        >
          Start new discussion &gt;
        </button>
      )}

      {!showCreateDiscussionForm && (
        <DiscussionThreads threads={discussionThreads} />
      )}

      {showCreateDiscussionForm && (
        <div className="relative ">
          <button
            onClick={() => setShowCreateDiscussionForm(false)}
            className="text-white font-bold p-4 mb-4 border-2 border-white rounded-lg"
          >
            Back to discussions &gt;
          </button>

          <div className="border-2 w-[100%]  text-white font-mono p-10">
            <h2 className="font-bold">
              Tips on getting your questions answered faster
            </h2>
            <ul className="list-disc">
              <li>Search to see if your question has been asked before</li>
              <li>Check grammar and spelling</li>
            </ul>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <h1 className="text-white p-2 mt-4">Title</h1>
            <input
              className="relative w-[100%] h-10 rounded-md p-2"
              placeholder="Title Goes Here"
              ref={discussionTitle}
            ></input>

            <h1 className="text-white p-2">Body</h1>
            <textarea
              ref={discussionBody}
              className="relative w-[100%] h-20 rounded-md p-2"
              placeholder="Body Goes Here"
            ></textarea>

            {/* Button to publish the discussion */}
            <button
              onClick={handlePublishdiscussion}
              className="w-[100%] h-10 border-2 bg-slate-400 mt-8 text-xl font-bold rounded-md"
            >
              Publish
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// Export the Discussion component
export default Discussion;
