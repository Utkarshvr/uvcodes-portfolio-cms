import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./setup";
import ProjectType from "@/type/ProjectType";
import { FirebaseError } from "firebase/app";
import ContentBlockType from "@/type/ContentBlockType";

export async function createProject(projectDetails: ProjectType) {
  try {
    const projectRef = doc(collection(db, "projects"));
    await setDoc(projectRef, projectDetails);

    return { isSuccess: true, error: null, projectID: projectRef.id };
  } catch (error) {
    console.log(error);
    return { isSuccess: false, error: error as FirebaseError, projectID: null };
  }
}

export async function updateProject(
  projectID: string,
  updatedDetails: Partial<ProjectType>
) {
  try {
    const projectRef = doc(db, "projects", projectID);
    await updateDoc(projectRef, updatedDetails);

    return { isSuccess: true, error: null };
  } catch (error) {
    console.error("Error updating project:", error);
    return { isSuccess: false, error: error as FirebaseError };
  }
}

export async function fetchAllProjects() {
  try {
    const ref = collection(db, "projects");
    const snapshot = await getDocs(ref);
    // Convert Firestore data to ProjectType[]
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProjectType[];

    return {
      isSuccess: true,
      error: null,
      projects,
    };
  } catch (error) {
    console.log(error);
    return { isSuccess: false, error: error as FirebaseError, projects: [] };
  }
}

export async function fetchProjectByID(projectID: string) {
  try {
    const projectRef = doc(db, "projects", projectID);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return {
        isSuccess: false,
        error: { message: "Project not found" },
        project: null,
      };
    }

    return {
      isSuccess: true,
      error: null,
      project: { id: projectSnap.id, ...projectSnap.data() } as ProjectType,
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { isSuccess: false, error: error as FirebaseError, project: null };
  }
}

export async function fetchAllContentBlocks() {
  try {
    const ref = collection(db, "content-blocks");
    const snapshot = await getDocs(ref);
    // Convert Firestore data to ProjectType[]
    const contentBlocks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ContentBlockType[];

    return {
      isSuccess: true,
      error: null,
      contentBlocks,
    };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      error: error as FirebaseError,
      contentBlocks: [],
    };
  }
}

export async function fetchDocByID<T = any>(
  collection_name: string,
  id: string
) {
  try {
    const ref = doc(db, collection_name, id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return {
        isSuccess: false,
        error: { message: "Doc not found" },
        data: null,
      };
    }

    return {
      isSuccess: true,
      error: null,
      data: { id: snap.id, ...snap.data() } as T,
    };
  } catch (error) {
    console.error("Error fetching doc:", error);
    return { isSuccess: false, error: error as FirebaseError, data: null };
  }
}

export async function fetchAllDocs<T>(collection_name: string) {
  try {
    const ref = collection(db, collection_name);
    const snapshot = await getDocs(ref);
    // Convert Firestore data to ProjectType[]
    const data = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as T)
    );

    return {
      isSuccess: true,
      error: null,
      data,
    };
  } catch (error) {
    console.log(error);
    return { isSuccess: false, error: error as FirebaseError, data: null };
  }
}

export async function createFB(collection_name: string, data: any) {
  try {
    const ref = doc(collection(db, collection_name));
    await setDoc(ref, data);

    return { isSuccess: true, error: null, id: ref.id };
  } catch (error) {
    console.log(error);
    return { isSuccess: false, error: error as FirebaseError, id: null };
  }
}

export async function updateFB(collection_name: string, id: string, data: any) {
  try {
    const ref = doc(db, collection_name, id);
    await updateDoc(ref, data);

    return { isSuccess: true, error: null };
  } catch (error) {
    console.error("Error updating project:", error);
    return { isSuccess: false, error: error as FirebaseError };
  }
}
export async function deleteFB(collection_name: string, id: string) {
  try {
    const ref = doc(db, collection_name, id);
    await deleteDoc(ref);

    return { isSuccess: true, error: null };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { isSuccess: false, error: error as FirebaseError };
  }
}
