"use server";
import {auth} from "@clerk/nextjs/server"

type PrefData = {
    desired_salary: number;
    age: string;
    desired_holiday: number;
    max_overtime_hours: number;
    remote_preference: string;
    work_style: string;
}

export async function savePreferences(data:PrefData) {
    const {getToken} = await auth();
    const token = await getToken();

    const res = await fetch("http://127.0.0.1:8000/users/preferences", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        throw new Error(`HTTPエラー: ${res.status}を返却しました。:"Preferences保存に失敗しました`);
    }
}