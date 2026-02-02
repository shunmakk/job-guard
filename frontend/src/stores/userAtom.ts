"use client";
import { atomWithStorage } from "jotai/utils";

export interface UserData {
  email: string;
  provider: string;
  has_completed_preferences: boolean;
  isLoaded: boolean;
}

// ユーザー情報を管理するatom
export const userDataAtom = atomWithStorage<UserData | null>("userData", null);

// API呼び出し中かどうかを管理するatom
export const isRegisteringAtom = atomWithStorage<boolean>(
  "isRegistering",
  false
);
