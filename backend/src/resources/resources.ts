import { IResource, IResourceStatus } from "../types/resource";
import Parse from "parse/node";
import { updateFeedback } from "../feedback/feedback";

const SCORE_PER_COMPLETED = 0.1;
export const createResource = (resource: IResource) => {
  const Resource: Parse.Object = new Parse.Object("Resource");

  Object.keys(resource).forEach((resourceAttribute) => {
    Resource.set(resourceAttribute, resource[resourceAttribute]);
  });

  return Resource;
};

export const getResourcesFromCourse = async (courseId: string) => {
  const Resource = Parse.Object.extend("Resource");
  const Course = Parse.Object.extend("Course");

  const query = new Parse.Query(Resource);

  const course = new Course();
  course.id = courseId;

  query.equalTo("course", course);

  const resources = await query.findAll();
  return resources;
};

export const findResourceById = async (id: string) => {
  const Resource = Parse.Object.extend("Resource");
  const query = new Parse.Query(Resource);
  query.equalTo("objectId", id);
  return await query.find();
};

export const getResourcesFromCourseAndDifficulty = async (
  courseId: string,
  level: number
) => {
  const Resource = Parse.Object.extend("Resource");
  const Course = Parse.Object.extend("Course");

  const query = new Parse.Query(Resource);

  const course = new Course();
  course.id = courseId;

  query.equalTo("course", course);
  query.equalTo("level", level);

  const resources = await query.findAll();
  return resources;
};

export const updateResourceStatus = async (
  resourceId: string,
  status: IResourceStatus
) => {
  const Resource = new Parse.Object("Resource");
  Resource.set("objectId", resourceId);
  Resource.set("status", status);

  if (status === "completed") {
    const resource = await findResourceById(resourceId);
    updateFeedback(resource[0].get("videoId"), SCORE_PER_COMPLETED);
  }

  return Resource;
};
