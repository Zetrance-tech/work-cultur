
//const BASE_URL = process.env.REACT_APP_BASE_URL
// const BASE_URL = import.meta.env.VITE_BASE_URL;
//const BASE_URL = 'http://localhost:4000/api/v1';
const BASE_URL = 'https://wc-backend.zetrance.com/api/v1';

/*
export const courseEndpoints = {
  //endpoints
  CREATE_COURSE_API: BASE_URL +"/api/courses/create",
  EDIT_COURSE_API: BASE_URL+ "/api/courses/edit",
  PUBLISH_COURSE_API: BASE_URL+"/courses/publish-course",
}
*/

export const courseEndpoints = {
  CREATE_COURSE_API: `${BASE_URL}/courses/create-course`,
  EDIT_COURSE_API: `${BASE_URL}/courses/edit`,
  PUBLISH_COURSE_API: `${BASE_URL}/courses/publish-course`,
  CREATE_TOPIC_API: `${BASE_URL}/courses/create-Topic`,
  UPDATE_TOPIC_API :`${BASE_URL}/courses/update-topic`,
  DELETE_TOPIC_API:`${BASE_URL}/courses/delete-topic`,
  CREATE_SUBTOPIC_API:`${BASE_URL}/courses/create-subtopic`,
  UPDATE_SUBTOPIC_API:`${BASE_URL}/courses/update-subtopic`,
  DELETE_SUBTOPIC_API:`${BASE_URL}/courses/delete-subtopic`
};