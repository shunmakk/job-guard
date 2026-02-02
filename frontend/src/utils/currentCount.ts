export const currentCount = (): boolean => {
  //とりあえずlocalStorageで管理する
  //あとでDBに保存する
  //あとでユーザーごとに管理する
  const now = new Date();
  const lastReset = localStorage.getItem("last_reset");

  // 24時間経過でAPI呼び出し回数をリセット(初回りクエストの場合もリセット)
  let shouldReset: boolean = false;
  if (lastReset) {
    const lastResetDate = new Date(lastReset);
    if (now.getTime() - lastResetDate.getTime() > 24 * 60 * 60 * 1000) {
      shouldReset = true;
    }
  } else {
    shouldReset = true;
  }
  if (shouldReset) {
    localStorage.setItem("api_call_count", "0");
    localStorage.setItem("last_reset", now.toISOString());
  }

  //現在のAPI呼び出し回数を取得して増加
  const callAPICount: number =
    Number(localStorage.getItem("api_call_count")) || 0;
  const newCallAPICount = callAPICount + 1;

  console.log(newCallAPICount, "現在のAPI呼び出し回数");

  // 制限チェック
  if (newCallAPICount > 10) {
    window.alert("API呼び出し回数が10回を超えました。翌日再度お試しください");
    return false;
  }

  localStorage.setItem("api_call_count", String(newCallAPICount));
  return true;
};
