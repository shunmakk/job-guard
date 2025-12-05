"use server";

export async function analyzeCompany(formData: {
  id: string;
  salary_min: number;
  salary_max: number;
  holiday: number;
  description: string;
}) {
  try {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("分析エラー:", error);
    return { success: false, error: "分析中にエラーが発生しました" };
  }
}
