import {
    useContext,
  } from "react";
  
  import {
    SecurityPoliciesContext,
  } from "../context/SecurityPoliciesContext";
  
  export function useSecurityPolicies() {
    const context =
      useContext(
        SecurityPoliciesContext
      );
  
    if (!context) {
      throw new Error(
        "useSecurityPolicies must be used inside SecurityPoliciesProvider"
      );
    }
  
    return context;
  }