import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { CONNECTION_STRING, PORT } from "../utils/constants";
const DiscussionThreadReplies = forwardRef(  ({ data, onFetchCall, toggleShowAllThread}, ref) => {
    const replyBody=useRef('replyBody')
    const discussionReplies = data;
    
    console.log(onFetchCall)

    useImperativeHandle(ref, () => ({
        // Expose parent function to parent component
        callParentFunction: publishThreadReply,
      }));

    const publishThreadReply=async()=>{
        const data = await fetch(
            CONNECTION_STRING + PORT + "/api/courses/discussions/createReply/",
            {
              method: "POST",
              body: JSON.stringify({
                threadId: sessionStorage.getItem('ThreadID'),
                createdByEmail: sessionStorage.getItem('email'),
                body: replyBody.current.value,
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
          replyBody.current.value=""
          onFetchCall();
          
      }

   
  return (
    <div>

         <button
          onClick={toggleShowAllThread}
          className="text-white font-bold p-4 mb-4 border-2 border-white rounded-lg"
        >
          Go to all discussion &gt;
        </button>


      {
        discussionReplies && <div className="text-black border-2 border-white bg-white rounded-md p-4">
        <h1 className="text-2xl">{discussionReplies.threadInfo.title}</h1>

        <h1>{discussionReplies.threadInfo.body}</h1>

        <p className="font-bold text-xl my-4">Replies:</p>

        {discussionReplies.replies.map((e) => {
          return (
            <div className="border-2 border-black my-4 rounded-md p-8">
              <h1 className="font-bold font-xl">{e.body}</h1>
              <h1 className="float-right flex ">&lt;{e.createdByEmail}</h1>
            </div>
          );
        })}

        <div className="text-black">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <h1 className="text-black p-2">Reply</h1>
            <textarea
              ref={replyBody}
              className="relative w-[100%] h-20 rounded-md p-2 border-2 border-slate-600"
              placeholder="Reply Goes Here"
            ></textarea>

            <button
              onClick={publishThreadReply}
              className="w-[100%] h-10 border-2 bg-slate-400 mt-8 text-xl font-bold rounded-md"
            >
              Publish
            </button>
          </form>
        </div>
      </div>
      }
    </div>
  );
});

export default DiscussionThreadReplies;