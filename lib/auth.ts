import axios from "axios";
import { API_URL } from "./request";

export interface User {
  id: string;
  name?: string;
  email?: string;
  phone_number?: string;
  role: "super_admin" | "contractor" | "attendant";
  profilePicture?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mock user data
export const mockSuperAdmin: User = {
  id: "1",
  name: "John Administrator",
  email: "admin@parking.com",
  phone_number: "+1-555-0100",
  role: "super_admin",
  profilePicture: "/placeholder.svg?height=100&width=100",
  createdAt: "2024-01-01",
  lastLogin: "2024-01-20 09:30:00",
};

// Mock authentication functions
export const auth = {
  login: async (
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const body = {
        email: email,
        password: password,
      };
      const response = await axios.post(`${API_URL}/api/users/login`, body);

      console.log("Login response:", response);

      if (response.data.statusCode !== 200) {
        return {
          success: false,
          error: response.data.data.message || "Login failed",
        };
      }

      // You can optionally store token in localStorage here
      // localStorage.setItem("token", data.token);

      return { success: true, user: response.data.data };
    } catch (error: any) {
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  updateProfile: async (
    updates: Partial<User>
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedUser = { ...mockSuperAdmin, ...updates };
    return { success: true, user: updatedUser };
  },

  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (oldPassword !== "admin123") {
      return { success: false, error: "Current password is incorrect" };
    }

    return { success: true };
  },

  forgotPassword: async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if email exists in our mock system
    if (email === "admin@parking.com") {
      return { success: true };
    }

    // For demo purposes, we'll accept any valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      return { success: true };
    }

    return { success: false, error: "Email address not found in our system" };
  },
};
