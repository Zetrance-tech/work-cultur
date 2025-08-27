

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CourseProvider, useCourse, Course } from '@/contexts/CourseContext';
import CourseLayout from '@/components/layout/CourseLayout';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

const CoursePageContent = () => {
  const { setCourse, setCurrentTopicId, setCurrentSubTopicId } = useCourse();
  const {courseId, token } = useParams<{ courseId: string,token:string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

//  const courseId = "6895e2c4ebd07a4ad77cdf7f";
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODNjMWEzY2I0NDZkNmZkOGI0ZjhmNmMiLCJlbWFpbCI6InNhbmRlZXBAZ21haWwuY29tIiwiYWNjb3VudFR5cGUiOiJhZG1pbiIsImlhdCI6MTc1NDQ1OTI4OSwiZXhwIjoxNzU1MDY0MDg5fQ.844XRDjyyYmrsdwldKO8LJ7TWojZxDQqixFzlQ7sdSg"; // Replace with your actual token or fetch it from a secure source
  
  
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        setError(null);

       

        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Use Axios to make the POST request
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_API_URL}/api/v1/courses/getCourseForDigitalHuman`,
          { courseId:`${courseId}` }, // Request body
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the auth token in the headers
            },
          }
        );

        

        // With Axios, response.data contains the parsed JSON data
        const apiResponse = response.data;

        if (!apiResponse.success) {
          throw new Error(apiResponse.message || 'Failed to fetch course data');
        }

        const courseData: Course = apiResponse.data;

        
        console.log('Fetched course data:', courseData);
        // Set the course data in the context
     
        setCourse(courseData);

        // Set the first topic and subtopic as default (commented out as in your code)
        if (courseData.topics.length > 0) {
          const firstTopic = courseData.topics[0];
          console.log('First topic:', firstTopic);
          setCurrentTopicId(firstTopic.id);
          if (firstTopic.subTopics.length > 0) {
            console.log('First subtopic:', firstTopic.subTopics[0]);
            setCurrentSubTopicId(firstTopic.subTopics[0].id);
          }
        }

        toast({
          title: "Course loaded",
          description: `Welcome to ${courseData?.title}`,
        });
      } catch (error: any) {
        console.error('Error fetching course data:', error);
        // Axios errors include response data in error.response
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load course data. Please try again.';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [setCourse, setCurrentTopicId, setCurrentSubTopicId, courseId, toast]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <CourseLayout />;
};

const CoursePage = () => (
  <CourseProvider>
    <CoursePageContent />
  </CourseProvider>
);

export default CoursePage;


















///////////////////// for testing ///////////////////////////

// import { useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { CourseProvider, useCourse, Course } from '@/contexts/CourseContext';
// import CourseLayout from '@/components/layout/CourseLayout';
// import { useToast } from "@/hooks/use-toast";

// // Dummy data for testing
// const dummyCourseData = {
//   success: true,
//   statusCode: 200,
//   status: "OK",
//   message: "Course details fetched successfully",
//   data: {
//     id: "dummy-course-123",
//     title: "Dummy Course for Testing",
//     topics: [
//       {
//         id: "topic-1",
//         title: "Topic 1: Basics of Web Development",
//         subTopics: [
//           {
//             id: "subtopic-1-1",
//             title: "What is HTML?",
//             type: "text",
//             content: "HTML (HyperText Markup Language) is the standard language used to create and structure content on the web. It defines the elements and layout of a web page using a system of tags, such as <h1> for headings, <p> for paragraphs, <a> for links, and <img> for images. HTML provides the basic framework of a webpage, allowing browsers to interpret and display content correctly. While HTML handles the structure, it works together with CSS for styling and JavaScript for interactivity, forming the core foundation of modern web development.",
            
//             assessmentIds: [ {'id':"676557654756457755", 'title':'assessment-1'}, {'id':"6765576547565464", 'title':'assessment-2'}]
//           },
//           {
//             id: "subtopic-1-2",
//             title: "HTML Video Tutorial",
//             type: "video",
//             videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//             assessmentIds: []
//           }
//         ]
//       },
//       {
//         id: "topic-2",
//         title: "Topic 2: Styling with CSS",
//         subTopics: [
//           {
//             id: "subtopic-2-0",
//             title: "What is CSS?",
//             type: "text",
//             content: "CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of a document written in HTML or XML. It controls how elements on a web page are displayed, including layout, colors, fonts, spacing, and overall visual design. CSS helps separate content from design, making it easier to maintain and update websites. By using CSS, developers can apply styles across multiple pages consistently and efficiently. It supports features like responsive design, animations, and themes, playing a crucial role in creating visually appealing and user-friendly web applications",
            
//             assessmentIds: [ {'id':"676557654756457755", 'title':'assessment-1'}, {'id':"6765576547565464", 'title':'assessment-2'}]
//           },
//           {
//             id: "subtopic-2-1",
//             title: "CSS Resources",
//             type: "download",
//             files: [
//               { url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", name: "CSS Guide", type: "pdf" }, // Changed fileName to name
//               { url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", name: "CSS Cheatsheet", type: "docx" },
//               { url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", name: "CSS Cheatsheet", type: "docx" },
//               { url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", name: "CSS Cheatsheet", type: "docx" }// Changed fileName to name
//             ],
//             assessmentIds: [ {'id':"676557654756fg7755", 'title':'assessment-1'}, {'id':"6765576547545", 'title':'assessment-2'}]
//           },
//           {
//             id: "subtopic-2-2",
//             title: "CSS Basics",
//             type: "text",
//             content: "CSS is used to style HTML elements. It controls the layout, colors, and fonts of a webpage.",
//             imageUrl: "https://www.cmu.edu/news/sites/default/files/styles/hero_full_width_desktop_2x/public/2024-06/0611-hd-enhancing-bci.png.webp?itok=SoT6klAD",
//             assessmentIds: []
//           }
//         ]
//       },
//       {
//         id: "topic-3",
//         title: "Topic 3: JavaScript Essentials",
//         subTopics: [
//           {
//             id: "subtopic-3-1",
//             title: "JavaScript Documentation Links",
//             type: "link",
//             links: [
//               { title: "MDN JavaScript Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
//               { title: "W3Schools JavaScript Tutorial", url: "https://www.w3schools.com/js/" }
//             ],
//             "assessmentIds": [
//             { "id": "676557654756fg7755", "title": "CSS Fundamentals Quiz" },
//             { "id": "6765576547545", "title": "CSS Styling Assessment" }
//           ]
//           },
//           {
//             id: "subtopic-3-2",
//             title: "JavaScript Intro Video",
//             type: "video",
//             videoUrl: "https://example.com/videos/js-intro.mp4",
//             assessmentIds: []
//           }
//         ]
//       }
//     ]
//   }
// };

// const CoursePageContent = () => {
//   const { setCourse, setCurrentTopicId, setCurrentSubTopicId } = useCourse();
//   const { courseId } = useParams<{ courseId: string }>();
//   const { toast } = useToast();

//   useEffect(() => {
//     const loadCourseData = () => {
//       try {
//         const apiResponse = dummyCourseData;

//         if (!apiResponse.success) {
//           throw new Error(apiResponse.message || 'Failed to load course data');
//         }

//         const courseData:any = apiResponse.data;

//         // Set the course data in the context
//         setCourse(courseData);

//         // Set the first topic and subtopic as default
//         // if (courseData.topics.length > 0) {
//         //   const firstTopic = courseData.topics[0];
//         //   setCurrentTopicId(firstTopic.id);
//         //   if (firstTopic.subTopics.length > 0) {
//         //     setCurrentSubTopicId(firstTopic.subTopics[0].id);
//         //   }
//         // }

//         toast({
//           title: "Course loaded",
//           description: `Welcome to ${courseData.title}`,
//         });
//       } catch (error) {
//         console.error('Error loading course data:', error);
//         toast({
//           title: "Error",
//           description: "Failed to load course data. Please try again.",
//           variant: "destructive",
//         });
//       }
//     };

//     loadCourseData();
//   }, [setCourse, setCurrentTopicId, setCurrentSubTopicId, toast]);

//   return <CourseLayout />;
// };

// const CoursePage = () => (
//   <CourseProvider>
//     <CoursePageContent />
//   </CourseProvider>
// );

// export default CoursePage;