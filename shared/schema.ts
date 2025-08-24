import { z } from "zod";

// Order data schema matching Google Sheets columns
export const orderSchema = z.object({
  이름: z.string(),
  디자인: z.string(),
  주문일자: z.string(),
  픽업일자: z.string(),
  맛선택: z.string(),
  시트: z.string(),
  사이즈: z.string(),
  크림: z.string(),
  요청사항: z.string().optional(),
  특이사항: z.string().optional(),
  주문경로: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
});

export const signupSchema = z.object({
  email: z.string().email("올바른 이메일을 입력하세요"),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;

// Settings schema
export const settingsSchema = z.object({
  apiKey: z.string().min(1, "API Key를 입력하세요"),
  sheetId: z.string().min(1, "Sheet ID를 입력하세요"),
  sheetName: z.string().min(1, "Sheet Name을 입력하세요"),
});

export type Settings = z.infer<typeof settingsSchema>;

// Statistics data
export interface StatItem {
  name: string;
  count: number;
  percentage: number;
}

export interface Statistics {
  디자인: StatItem[];
  맛선택: StatItem[];
  사이즈: StatItem[];
  시트: StatItem[];
  크림: StatItem[];
}
