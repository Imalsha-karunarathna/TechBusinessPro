// "use client";

// import type React from "react";

// import { useState, createContext, useContext, useEffect } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { useToast } from "@/hooks/use-toast";

// // Define user type
// type User = {
//   id: string;
//   name: string;
//   username: string;
//   email: string;
// };

// // Define auth context type
// type AuthContextType = {
//   user: User | null;
//   loginMutation: any;
//   registerMutation: any;
//   logoutMutation: any;
// };

// // Create context with default values
// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loginMutation: {},
//   registerMutation: {},
//   logoutMutation: {},
// });

// // Auth provider component
// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const { toast } = useToast();

//   // Check for existing user session on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         console.error("Failed to parse stored user:", error);
//         localStorage.removeItem("user");
//       }
//     }
//   }, []);

//   // Login mutation
//   const loginMutation = useMutation({
//     mutationFn: async (credentials: { username: string; password: string }) => {
//       // Simulate API call
//       return new Promise<User>((resolve) => {
//         setTimeout(() => {
//           // Mock successful login
//           resolve({
//             id: "user-1",
//             name: "Test User",
//             username: credentials.username,
//             email: "test@example.com",
//           });
//         }, 1000);
//       });
//     },
//     onSuccess: (data) => {
//       setUser(data);
//       localStorage.setItem("user", JSON.stringify(data));
//       toast({
//         title: "Login successful",
//         description: `Welcome back, ${data.name}!`,
//       });
//     },
//     onError: (error: Error) => {
//       toast({
//         title: "Login failed",
//         description:
//           error.message || "Please check your credentials and try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   // Register mutation
//   const registerMutation = useMutation({
//     mutationFn: async (userData: {
//       name: string;
//       username: string;
//       email: string;
//       password: string;
//     }) => {
//       // Simulate API call
//       return new Promise<User>((resolve) => {
//         setTimeout(() => {
//           // Mock successful registration
//           resolve({
//             id: "user-new",
//             name: userData.name,
//             username: userData.username,
//             email: userData.email,
//           });
//         }, 1000);
//       });
//     },
//     onSuccess: (data) => {
//       setUser(data);
//       localStorage.setItem("user", JSON.stringify(data));
//       toast({
//         title: "Registration successful",
//         description: `Welcome to Tech Mista, ${data.name}!`,
//       });
//     },
//     onError: (error: Error) => {
//       toast({
//         title: "Registration failed",
//         description:
//           error.message || "Please try again with different credentials.",
//         variant: "destructive",
//       });
//     },
//   });

//   // Logout mutation
//   const logoutMutation = useMutation({
//     mutationFn: async () => {
//       // Simulate API call
//       return new Promise<void>((resolve) => {
//         setTimeout(() => {
//           resolve();
//         }, 500);
//       });
//     },
//     onSuccess: () => {
//       setUser(null);
//       localStorage.removeItem("user");
//       toast({
//         title: "Logged out",
//         description: "You have been successfully logged out.",
//       });
//     },
//     onError: (error: Error) => {
//       toast({
//         title: "Logout failed",
//         description: error.message || "An error occurred during logout.",
//         variant: "destructive",
//       });
//     },
//   });

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loginMutation,
//         registerMutation,
//         logoutMutation,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth context
// export const useAuth = () => useContext(AuthContext);
