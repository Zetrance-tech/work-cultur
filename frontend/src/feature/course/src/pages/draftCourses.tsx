import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../services/api'; // adjust path based on your project
//import { useAuth } from '@/context/AuthContext'; // assuming context-based auth
import { useNavigate ,useLocation,useParams} from 'react-router-dom';
import { Button } from 'react-day-picker';
import { useToast } from "@/components/ui/use-toast";


const DraftCoursesPage = () => {
  const [draftCourses, setDraftCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  //const { authToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { courseId } = useParams();
  const { toast } = useToast();


  const authToken = localStorage.getItem("workcultur_token");

  useEffect(() => {
    const fetchDraftCourses = async () => {
      try {
        const response = await axios.get(api.GET_DRAFT_COURSES, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        //consoling response 
         console.log(" Full Draft Courses API response:", response);

        if (response.data?.data?.courses) {
        console.log(" Draft courses found:", response.data.data.courses);

          setDraftCourses(response.data.data.courses);
        }
      } catch (error) {
        console.error("Error fetching draft courses:", error);
      } finally {
        setLoading(false);
      }
    };

    //fetchDraftCourses();
    // Check location.state.refetch and then refetch
    if (location.state?.refetch){
      fetchDraftCourses();
    }
  }, [location.state,authToken]);

  // useEffect to clear location.state after using it
  useEffect(() => {
    if (location.state?.refetch) {
      window.history.replaceState({}, document.title);
    }
  }, []);


  const handleDeleteDraftCourse = async (courseId) => {
  try {
    const response = await axios.delete(api.DELETE_DRAFT_COURSE, {
      data: { courseId },
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      toast({ title: 'Success', description: 'Draft course deleted successfully!' });
      setDraftCourses(prev => prev.filter(course => course._id !== courseId));
    }
  } catch (err) {
    console.error("Failed to delete draft course:", err);
    toast({
      title: 'Error',
      description: 'Failed to delete draft course.',
      variant: 'destructive'
    });
  }
};


  if (loading) return <div className="text-center mt-8">Loading draft courses...</div>;
{/*
  return (
    <div className="p-6">
    <h1 className="text-2xl font-bold">Draft Courses</h1>

      <div className="absolute top-6 right-6 z-50 mb-32">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl duration-200 hover:cursor-pointer"
          onClick={() => {
            const token = localStorage.getItem("workcultur_token");
            if (!token) {
              //navigate("/admin/courses");
              alert("Please log in first.");
            } 

            if(location.pathname.includes('/create')){
                navigate("/admin/courses/create");
            }
            else{
                navigate("/admin/courses");
            }
          }}
        >
          Go Back
        </button>
      </div>

      {draftCourses.length === 0 ? (
        <p>No draft courses found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {draftCourses.map((course) => (
            <div
              key={course._id}
              className="rounded-2xl bg-white/5 p-4 shadow-lg border border-white/10 backdrop-blur"
            >
              <h2 className="text-xl font-semibold text-blue-400">{course.title}</h2>
              <p className="text-sm text-gray-300 mt-1">{course.description}</p>
              <p className="text-sm text-gray-400 mt-2">Duration: {course.duration} hrs</p>
              <p className="text-xs text-yellow-400 mt-2">Status: {course.status}</p>
              <p className="text-xs text-gray-500">Created at: {new Date(course.createdAt).toLocaleDateString()}</p>

            <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-xl duration-200 hover:cursor-pointer"
                    onClick={() => navigate(`/admin/courses/create/course/${course._id}/basic-info`)}
                >
                Continue
            </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
*/}
return (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6 text-white">Draft Courses</h1>

    {/* Top-right back button */}
    <div className="absolute top-6 right-6 z-50">
      <button
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-5 rounded-xl shadow-md duration-200"
        onClick={() => {
          const token = localStorage.getItem("workcultur_token");
          if (!token) return alert("Please log in first.");

          if (location.pathname.includes('/create')) {
            navigate("/admin/courses/create");
          } else {
            navigate("/admin/courses");
          }
        }}
      >
        Go Back
      </button>
    </div>

    {draftCourses.length === 0 ? (
      <p className="text-gray-300">No draft courses found.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {draftCourses.map((course) => (
          <div
            key={course._id}
            className="relative h-full rounded-2xl p-5 bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl flex flex-col justify-between"
          >
          
          {/* Delete Button - Top Right */}
          <button
            onClick={() => handleDeleteDraftCourse(course._id)}
            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold text-xs px-4 py-3 rounded-lg shadow-md"
          >
            Delete
          </button>

            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">{course.title}</h2>
              <p className="text-sm text-gray-300 line-clamp-3">{course.description}</p>
              <p className="text-sm text-gray-400 mt-3">Duration: {course.duration} hrs</p>
              <p className="text-xs text-yellow-400 mt-1">Status: {course.status}</p>
              <p className="text-xs text-gray-500 mt-1">Created: {new Date(course.createdAt).toLocaleDateString()}</p>
            </div>

{/*
            <button
              onClick={() => handleDeleteDraftCourse(course._id)}
              className="ml-auto mt-3 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg shadow-md"
            >
              Delete
            </button>
*/}

            {/* Bottom right button */}
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-xl duration-200 shadow"
                onClick={() =>
                  navigate(`/admin/courses/create/course/${course._id}/basic-info`)
                }
              >
                Continue
              </button>
            </div>

          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default DraftCoursesPage;