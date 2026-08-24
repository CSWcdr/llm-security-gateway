import {
    createContext,
    useState,
    type ReactNode,
  } from "react";
  
  import { mockProjects } from "../data/mockData";
  import type { Project } from "../types";
  
  type CreateProjectInput = {
    name: string;
    description: string;
    environment: "Production" | "Development";
  };
  
  type ProjectsContextType = {
    projects: Project[];
  
    createProject: (
      project: CreateProjectInput
    ) => Project;
  
    getProjectById: (
      projectId: string
    ) => Project | undefined;
  };
  
  export const ProjectsContext =
    createContext<ProjectsContextType | undefined>(
      undefined
    );
  
  type ProjectsProviderProps = {
    children: ReactNode;
  };
  
  export function ProjectsProvider({
    children,
  }: ProjectsProviderProps) {
    const [projects, setProjects] =
      useState<Project[]>(mockProjects);
  
    function createProject(
      project: CreateProjectInput
    ) {
      const newProject: Project = {
        id: `proj_${Date.now()}`,
  
        name: project.name,
  
        description:
          project.description ||
          "No project description provided.",
  
        environment: project.environment,
  
        status: "Active",
  
        requests: 0,
        blockedRequests: 0,
        apiKeys: 0,
  
        createdAt:
          new Date().toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }
          ),
      };
  
      setProjects((currentProjects) => [
        newProject,
        ...currentProjects,
      ]);
  
      return newProject;
    }
  
    function getProjectById(
      projectId: string
    ) {
      return projects.find(
        (project) =>
          project.id === projectId
      );
    }
  
    return (
      <ProjectsContext.Provider
        value={{
          projects,
          createProject,
          getProjectById,
        }}
      >
        {children}
      </ProjectsContext.Provider>
    );
  }