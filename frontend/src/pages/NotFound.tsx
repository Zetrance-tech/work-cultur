
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] container px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-6"
        >
          <AlertTriangle className="h-10 w-10 text-orange-500" />
        </motion.div>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
          404
        </h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
