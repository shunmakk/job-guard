"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function registerUser() {
  const { userId, getToken } = await auth();
  if (!userId) {
    throw new Error("ユーザーが存在しません");
  }
  const token = await getToken();
  if (!token) {
    throw new Error("クラークのトークンが存在しません");
  }

  const clerkUser = await (await clerkClient()).users.getUser(userId);
  if (!clerkUser) {
    throw new Error("クラークのユーザーが存在しません");
  }
  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? "";
  const provider = clerkUser.externalAccounts?.[0]?.provider ?? "google";

  const res = await fetch("http://127.0.0.1:8000/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: email,
      provider: provider,
    }),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return await res.json();
}
