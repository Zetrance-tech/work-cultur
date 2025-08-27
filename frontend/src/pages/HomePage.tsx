//src/component/pages/HomePage.tsx
/*
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGoToOrganizations = () => {
    navigate('/organizationlist');
  };

  const handleGoToCreateCourse = () => {
     const orgId = "your-org-id"; // Replace with dynamic value if needed
    navigate(`/organization/${orgId}/create-course`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <Card className="p-8 flex flex-col gap-4 w-[300px] text-center shadow-lg">
        <h2 className="text-2xl font-semibold">Welcome!</h2>
        <p className="text-muted-foreground">What would you like to do?</p>
        <Button onClick={handleGoToOrganizations}>Go to Organizations</Button>
        <Button variant="outline" onClick={handleGoToCreateCourse}>Create a Course</Button>
      </Card>
    </div>
  );
};

export default HomePage;
*/

/*
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShootingStars } from '@/components/ui/shooting-stars'; // Optional animated background

const HomePage = () => {
  const navigate = useNavigate();

  const handleGoToOrganizations = () => {
    navigate('/organizationlist');
  };

  const handleGoToCreateCourse = () => {
    const orgId = "your-org-id"; // Replace with dynamic value if needed
    navigate(`/organization/${orgId}/create-course`);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <ShootingStars /> 
      
     
      <div className="absolute inset-0 flex items-center justify-center bg-black/2 backdrop-blur-sm">
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 overflow-hidden p-8 flex flex-col gap-4 w-[300px] text-center">
          <h2 className="text-2xl font-semibold">Welcome!</h2>
          <p className="text-sm text-gray-300">What would you like to do?</p>
          <Button onClick={handleGoToOrganizations} className="bg-blue-500 text-white hover:bg-blue-600">Go to Organizations</Button>
          <Button variant="outline" onClick={handleGoToCreateCourse} className="border-white text-white hover:bg-white/20">Create a Course</Button>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
*/


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();


  const handleGoToOrganizations = () => {
    navigate('/organizationlist');
  };

  const handleGoToCreateCourse = () => {
    const orgId = "your-org-id"; // Replace with dynamic value if needed
    navigate(`/organization/${orgId}/create-course`);
  };

  const handleLogout = () => {
    logout(); // this will clears user/token and reloads the app
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <ShootingStars />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-16 px-6 py-20 bg-black/10 backdrop-blur-sm mb-32">
        {/* Headline Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Welcome to <span className="bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">WorkCultur</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Seamlessly manage organizations, departments, and create engaging learning experiences.
          </p>
        </div>

        {/* Action Buttons Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Manage Organizations</h2>
            <p className="text-sm text-gray-300 text-center mb-4">
              View and manage all organizations you've created.
            </p>
            {/*
            <Button onClick={handleGoToOrganizations} className="bg-blue-500 hover:bg-blue-600">
              Go to Organizations
            </Button>
            */}
            <ShimmerButton onClick={handleGoToOrganizations}>
              Go to Organizations
            </ShimmerButton>
          </div>

          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Manage Courses</h2>
            <p className="text-sm text-gray-300 text-center mb-4">
              Start building impactful courses under your organization.
            </p>
            {/*
            <Button  onClick={handleGoToCreateCourse} className="bg-blue-500 hover:bg-blue-600">
              Create Courses
            </Button>
            */}
            {/*
            <ShimmerButton onClick={handleGoToOrganizations}>
              Go to Course
            </ShimmerButton>
            */}
{/*
            <ShimmerButton onClick={() => window.open("http://localhost:8081", "_blank")}>
            Go to Course
          </ShimmerButton>
*/}

          {/*Wrapping buttons in single row*/}
          <div className="flex flex-row gap-4">
              <ShimmerButton
                onClick={() => {
                  const token = localStorage.getItem("workcultur_token");
                  if (token) {
                    navigate("/admin/courses"); 
                  } else {
                    alert("Please log in first.");
                  }
                }}
              >
                Published Courses
              </ShimmerButton>


              <ShimmerButton
                  onClick={() => {
                    const token = localStorage.getItem("workcultur_token");
                    if (token) {
                      navigate("/admin/courses/create"); 
                    } else {
                      alert("Please log in first.");
                    }
                  }}
                >
                Create New Course
              </ShimmerButton>
              
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-50 mb-32">
        <ShimmerButton
          onClick={handleLogout}
          //shimmerColor="#ffffff"
          //background="rgba(255, 255, 255, 0.05)"
          //shimmerDuration="2.5s"
        >
          Signout
        </ShimmerButton>
      </div>

    </div>
  );
};

export default HomePage;
