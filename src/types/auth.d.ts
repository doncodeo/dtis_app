// src/types/auth.d.ts

// Type for the user object returned after login/registration
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: 'user' | 'admin'; // Add role property
  // Add other user properties as needed
}

// Type for the data sent during user registration
export interface RegisterData {
  name?: string;
  email?: string;
  password?: string;
}

// Type for the data sent during user login
export interface LoginData {
  email?: string;
  password?: string;
}

// Type for the successful login response
export interface LoginSuccessResponse {
  token: string;
  user: UserResponse;
}

// Type for email verification request
export interface VerifyEmailData {
  email: string;
  verificationCode: string;
}

// Type for resend verification code request
export interface ResendCodeData {
  email: string;
}

// Type for forgot password request
export interface ForgotPasswordData {
  email: string;
}

// Type for reset password request
export interface ResetPasswordData {
  password: string;
}

// Type for user stats response
export interface UserStats {
  totalReports: number;
  totalAppeals: number;
  recentReports: any[]; // Define a more specific type for Report later
}

// Watchlist Category type
export type WatchlistCategory = "phone" | "email" | "business" | "website" | "Fake Tech Support" | "Fraudulent Phone Number" | "Malware Distribution" | "Phishing Website" | "Scam Email";

// Create Watchlist Item data
export interface CreateWatchlistItemData {
  category: WatchlistCategory;
}

// Watchlist Item response
export interface WatchlistItem {
  _id: string;
  userId: string;
  category: WatchlistCategory;
  createdAt: string;
}

// Admin stats response
export interface AdminStats {
  totalUsers: number;
  totalReports: number;
  verifiedReports: number;
  pendingAppeals: number;
  // Add other admin stats as needed
}

// Article types
export interface Article {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Threat Report types
export interface Report {
  _id: string;
  instrument: string;
  type: WatchlistCategory; // Reusing WatchlistCategory for consistency
  description: string;
  aliases?: string[];
  reporterId: string;
  status: 'pending' | 'verified' | 'rejected'; // Status of the report
  createdAt: string;
  updatedAt: string;
}

// Search threat data
export interface SearchThreatData {
  instrument?: string;
  type?: WatchlistCategory;
}

// Appeal data
export interface AppealData {
  instrument: string;
  reason: string;
  evidence?: string;
}

// Get Reports API Response
export interface GetReportsResponse {
  reports: Report[];
  totalCount: number;
}
