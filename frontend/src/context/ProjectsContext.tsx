import {
    createContext,
    useCallback,
    useEffect,
    useState,
    type ReactNode,
  } from "react";
  
  import axios from "axios";
  
  import { api } from "../lib/api";
  
  import type {
    Project,
  } from "../types";
  
  import {
    useAuth,
  } from "../hooks/useAuth";
  
  
  type CreateProjectInput = {
    name: string;
    description: string;
  
    environment:
      | "Production"
      | "Development";
  };
  
  
  type BackendProject = {
    id: string;
  
    name: string;
  
    description:
      | string
      | null;
  
    environment:
      | "PRODUCTION"
      | "DEVELOPMENT";
  
    status:
      | "ACTIVE"
      | "PAUSED";
  
    ownerId:
      | string
      | null;
  
    createdAt: string;
    updatedAt: string;
  };
  
  
  type ProjectsResponse = {
    success: boolean;
  
    message: string;
  
    data: BackendProject[];
  };
  
  
  type CreateProjectResponse = {
    success: boolean;
  
    message: string;
  
    data: BackendProject;
  };
  
  
  type ErrorResponse = {
    success?: boolean;
    message?: string;
  };
  
  
  type ProjectsContextType = {
    projects: Project[];
  
    loading: boolean;
  
    createProject: (
      project: CreateProjectInput
    ) => Promise<Project>;
  
    getProjectById: (
      projectId: string
    ) => Project | undefined;
  
    refreshProjects: () =>
      Promise<void>;
  };
  
  
  export const ProjectsContext =
    createContext<
      ProjectsContextType | undefined
    >(undefined);
  
  
  type ProjectsProviderProps = {
    children: ReactNode;
  };
  
  
  export function ProjectsProvider({
    children,
  }: ProjectsProviderProps) {
    const {
      isAuthenticated,
      loading: authLoading,
    } =
      useAuth();
  
  
    const [
      projects,
      setProjects,
    ] =
      useState<Project[]>([]);
  
  
    const [
      loading,
      setLoading,
    ] =
      useState(false);
  
  
    const refreshProjects =
      useCallback(
        async () => {
          if (
            !isAuthenticated
          ) {
            setProjects([]);
            return;
          }
  
          try {
            setLoading(true);
  
            const response =
              await api.get<ProjectsResponse>(
                "/projects"
              );
  
            const mappedProjects =
              response.data.data.map(
                mapBackendProject
              );
  
            setProjects(
              mappedProjects
            );
          } catch (error) {
            throw new Error(
              getApiErrorMessage(
                error,
                "Failed to fetch projects."
              )
            );
          } finally {
            setLoading(false);
          }
        },
        [isAuthenticated]
      );
  
  
    /*
     * Fetch real projects when
     * authentication is ready.
     */
    useEffect(() => {
      if (authLoading) {
        return;
      }
  
      if (
        !isAuthenticated
      ) {
        setProjects([]);
        return;
      }
  
      refreshProjects().catch(
        (error) => {
          console.error(
            error
          );
        }
      );
    }, [
      authLoading,
      isAuthenticated,
      refreshProjects,
    ]);
  
  
    async function createProject(
      project:
        CreateProjectInput
    ) {
      try {
        const response =
          await api.post<CreateProjectResponse>(
            "/projects",
            {
              name:
                project.name.trim(),
  
              description:
                project.description
                  .trim(),
  
              environment:
                project.environment ===
                "Production"
                  ? "PRODUCTION"
                  : "DEVELOPMENT",
  
              status:
                "ACTIVE",
            }
          );
  
  
        const newProject =
          mapBackendProject(
            response.data.data
          );
  
  
        setProjects(
          (currentProjects) => [
            newProject,
            ...currentProjects,
          ]
        );
  
  
        return newProject;
      } catch (error) {
        throw new Error(
          getApiErrorMessage(
            error,
            "Failed to create project."
          )
        );
      }
    }
  
  
    function getProjectById(
      projectId: string
    ) {
      return projects.find(
        (project) =>
          project.id ===
          projectId
      );
    }
  
  
    return (
      <ProjectsContext.Provider
        value={{
          projects,
  
          loading,
  
          createProject,
  
          getProjectById,
  
          refreshProjects,
        }}
      >
        {children}
      </ProjectsContext.Provider>
    );
  }
  
  
  function mapBackendProject(
    project: BackendProject
  ): Project {
    return {
      id:
        project.id,
  
      name:
        project.name,
  
      description:
        project.description ??
        "No project description provided.",
  
      environment:
        project.environment ===
        "PRODUCTION"
          ? "Production"
          : "Development",
  
      status:
        project.status ===
        "ACTIVE"
          ? "Active"
          : "Paused",
  
      /*
       * These will later come
       * from analytics/API-key APIs.
       */
      requests: 0,
  
      blockedRequests: 0,
  
      apiKeys: 0,
  
      createdAt:
        new Date(
          project.createdAt
        ).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }
        ),
    };
  }
  
  
  function getApiErrorMessage(
    error: unknown,
    fallback: string
  ) {
    if (
      axios.isAxiosError<
        ErrorResponse
      >(error)
    ) {
      return (
        error.response?.data
          ?.message ??
        fallback
      );
    }
  
    if (
      error instanceof Error
    ) {
      return error.message;
    }
  
    return fallback;
  }