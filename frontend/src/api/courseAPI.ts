import { apiConnector } from "./apiConnector"
import { courseEndpoints } from "./apis/courseEndpoints"
import { toast } from "react-hot-toast"
import axios from "axios";


const { CREATE_COURSE_API,
        EDIT_COURSE_API,
        PUBLISH_COURSE_API,
        CREATE_TOPIC_API,
        UPDATE_TOPIC_API,
        DELETE_TOPIC_API,
        CREATE_SUBTOPIC_API,
        UPDATE_SUBTOPIC_API,
        DELETE_SUBTOPIC_API,
    } = courseEndpoints;

//CREATE COURSE
export const createCourse = async (data: any) => {
  try {
    console.log('Data:',data);
    
    const response = await apiConnector("POST", CREATE_COURSE_API, data)
    console.log(response);
    toast.success("Course created successfully")
    if (!response?.data?.success) throw new Error("Course creation failed")
      console.log(response.data.data);
    return response?.data.data
  } catch (error: any) {
    toast.error(error.message)
    throw error
  }
}


//EDITCOURSE
export const editCourse = async (courseId: string, data: any) => {
  try {
    const response = await apiConnector("PATCH", EDIT_COURSE_API, {
      courseId,
      ...data,
    })
    if (!response?.data?.success) throw new Error("Update failed")
    toast.success("Course updated")
    return response?.data
  } catch (error: any) {
    toast.error(error.message)
    throw error
  }
}


//PUBLISH COURSe API CALL DEFINITION
export const publishCourse = async (courseId: string, organizationId: string, departmentIds: string[]) => {
  try {
    const response = await apiConnector("POST", courseEndpoints.PUBLISH_COURSE_API, {
      courseId,
      status: "published",
      linked_entities: [
        {
          organization: organizationId,
          departments: departmentIds.map(id => ({ _id: id })),
        },
      ],
    });

    if (!response?.data?.success) throw new Error("Publish failed");
    toast.success("Course published successfully");
    return response?.data;
  } catch (error: any) {
    toast.error(error.message || "Error publishing course");
    throw error;
  }
};




//API CALL DEFINITION FOR CREATE TOPIC.
export const createTopic = async ({
  courseId,
  title,
  description,
}: {
  courseId: string;
  title: string;
  description: string;
}) => {
  try {
    console.log("Sending topic payload:", {
      courseId,
      title,
      description,
    });

     const response = await apiConnector(
      "POST",
      CREATE_TOPIC_API,
      { courseId, title, description }, // Send as JSON
      {
        "Content-Type": "application/json",
      }
    );

    if (!response?.data?.success) throw new Error("Failed to create topic");

    toast.success("Topic created successfully");
    return response?.data;
  } catch (error: any) {
    toast.error(error.message || "Failed to create topic");
    throw error;
  }
};


//API CALL DEFINTION FOR UPDATE TOPIC
export const updateTopic = async ({
  courseId,
  topicId,
  title,
  description,
}: {
  courseId: string;
  topicId: string;
  title: string;
  description?: string;
}) => {
  try {
    const response = await apiConnector("PUT", UPDATE_TOPIC_API, {
      courseId,
      topicId,
      title,
      description,
    });

    if (!response?.data?.success) throw new Error("Failed to update topic");

    toast.success("Topic updated successfully");
    return response.data;
  } catch (error: any) {
    toast.error(error.message || "Failed to update topic");
    throw error;
  }
};


export const createSubtopic = async (formData: FormData) => {
  try {
    console.log("FormData entries before sending:");
     for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await apiConnector(
      'POST',
      CREATE_SUBTOPIC_API,
      formData,
      {
        'Content-Type': 'multipart/form-data',
      }
    );
    
    console.log("Response from createSubtopic:", response);

    return response.data;
  } catch (error) {
    throw error;
  }
};


//API CALL to updateSubtopicName
// courseAPI.ts

export const updateSubtopic = async ({
  topicId,
  subtopicId,
  title,
  description,
  contentType,
  textContent,
  videoName,
  videoUrl,
  filenames,
  files,
  links
}: {
  topicId: string;
  subtopicId: string;
  title: string;
  description?: string;
  contentType: 'text' | 'video' | 'file' | 'link';
  textContent?:string;
  videoName?: string;
  videoUrl?:string;
  filenames?: { name: string }[];
  files?: File[];
  links?:{ title: string; url: string }[];
}) => {
  try {
    const formData = new FormData();

    formData.append('topicId', topicId);
    formData.append('subtopicId', subtopicId);
    formData.append('title', title);
    formData.append('contentType', contentType);
    if (description) formData.append('description', description);

    /*
    if (contentType === 'file') {
      if (filenames) {
        formData.append('filenames', JSON.stringify(filenames));
      }
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('files', file);
        });
      }
    }
    */

    switch (contentType) {
      case 'text':
        if (textContent) {
          formData.append('text_content', textContent);
        }
        break;

      case 'video':
        if (videoName) formData.append('videoName', videoName);
        if (videoUrl) formData.append('videoUrl', videoUrl);
        break;

      case 'file':
        if (filenames) {
          formData.append('filenames', JSON.stringify(filenames));
        }
        if (files && files.length > 0) {
          files.forEach((file) => {
            formData.append('files', file);
          });
        }
        break;

      case 'link':
        if (links) {
          formData.append('links', JSON.stringify(links));
        }
        break;
    }


    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    const response = await apiConnector('PUT', UPDATE_SUBTOPIC_API, formData);

    if (!response?.data?.success) {
      throw new Error('Failed to update subtopic');
    }

    toast.success('Subtopic updated successfully');
    return response.data;
  } catch (error: any) {
    toast.error(error.message || 'Error updating subtopic');
    throw error;
  }
};



//API CALL DEFINTION FOR DELETE-TOPIC
export const deleteTopic = async ({
  courseId,
  topicId,
}: {
  courseId: string;
  topicId: string;
}) => {
  
  try {
    const response = await apiConnector("DELETE", DELETE_TOPIC_API, {
      courseId,
      topicId,
    });
   
    if (!response?.data?.success) throw new Error("Failed to delete topic");

    toast.success("Topic deleted successfully");
    return response.data;
  } catch (error: any) {
    toast.error(error.message || "Failed to delete topic");
    throw error;
  }
};




// API CALL DEFINITION FOR DELETE-SUBTOPIC
export const deleteSubtopic = async ({
  topicId,
  subtopicId,
}: {
  topicId: string;
  subtopicId: string;
}) => {
  try {
    const response = await apiConnector("DELETE", DELETE_SUBTOPIC_API, {
      topicId,
      subtopicId,
    });

    if (!response?.data?.success) {
      throw new Error("Failed to delete subtopic");
    }

    toast.success("Subtopic deleted successfully");
    return response.data;
  } catch (error: any) {
    toast.error(error.message || "Failed to delete subtopic");
    throw error;
  }
};
