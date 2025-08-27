
//const BASE_URL = 'https://workculture.onrender.com/api/v1';
const BASE_URL = 'https://wc-backend.zetrance.com/api/v1';

export const api = {
  LOGIN: BASE_URL + "/auth/login",
  CREATE_COURSE: BASE_URL + "/courses/create-course",
  UPDATE_COURSE: BASE_URL + "/courses/course-update",
  CREATE_TOPIC: BASE_URL + "/courses/create-Topic",
  UPDATE_TOPIC: BASE_URL + "/courses/update-topic",
  CREATE_SUBTOPIC: BASE_URL + "/courses/create-subtopic",
  UPDATE_SUBTOPIC: BASE_URL + "/courses/update-subtopic",
  CREATE_ASSESSMENT: BASE_URL + "/courses/save-CourseAssessments",
  PUBLISH_COURSE: BASE_URL + "/courses/publish-course",
  GET_PUBLISHED_COURSES: BASE_URL + "/courses/getAdmin-AllCourses",
  GET_COURSE_BY_ID: BASE_URL + "/courses/getFullCourseDetails",
  //EDIT_ASSESSMENT: BASE_URL + "/courses/edit-assessments",
  
  EDIT_ASSESSMENT: (courseId) => `${BASE_URL}/courses/edit/${courseId}/assessments`,
  

  FETCH_USER: BASE_URL + "/employee/course/getalluser",
  GET_AVATARS: BASE_URL + "/superadmin/get-all-avatars",
  DELETE_COURSE: BASE_URL + "/courses/course-delete",
  DELETE_TOPIC: BASE_URL + "/courses/delete-topic",
  DELETE_SUBTOPIC: BASE_URL + "/courses/delete-subtopic",
  DELETE_ASSESSMENT: BASE_URL + "/courses/delete-assessment",
  GET_QUESTIONS_BY_ASSESSMENT:"https://wc-backend.zetrance.com/api/v1/courses/getQuestionsByAssessment",
  
  CREATE_QUESTION: BASE_URL + "/courses/create-question",
  //CREATE_QUESTION: BASE_URL + "/courses/course-assessments",
  
  UPDATE_QUESTION: BASE_URL + "/courses/updateQuestion",
  //DELETE_QUESTION: BASE_URL + "/courses/deleteQuestion",
  DELETE_QUESTION: BASE_URL + "/courses/deleteQuestionById",
  GET_QUESTION_BY_ID: BASE_URL + "/courses/getQuestionById",


  GET_DRAFT_COURSES:BASE_URL+"/courses/getAdmin-DraftCourses",
  DELETE_DRAFT_COURSE: BASE_URL + "/courses/delete-draft-course",
  //GET_ALL_ORGANIZATIONS_API: `${BASE_URL}/admin/organizations/get-all`,
  GET_ALL_ORGANIZATIONS_API: BASE_URL+"/admin/organizations/get-all",
};
