import { useContext } from "react";

import { ProjectsContext } from "../context/ProjectsContext";

export function useProjects() {
  const context =
    useContext(ProjectsContext);

  if (!context) {
    throw new Error(
      "useProjects must be used inside ProjectsProvider"
    );
  }

  return context;
}