import json

from fastapi import HTTPException, status

from core.prompts import build_analysis_prompt
from infrastructure.openai_client import OpenAIClient
from repositories.job_repository import JobRepository
from repositories.user_repository import UserRepository
from schemas.analysis import AnalyzeInputData


class AnalysisService:
    def __init__(
        self,
        user_repo: UserRepository,
        job_repo: JobRepository,
        openai_client: OpenAIClient | None = None,
    ):
        self.user_repo = user_repo
        self.job_repo = job_repo
        self.openai_client = openai_client or OpenAIClient()

    def analyze(self, clerk_id: str, user_input: AnalyzeInputData) -> dict:
        user = self.user_repo.get_by_clerk_id(clerk_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ユーザーが見つかりません",
            )

        user_preferences = self.job_repo.get_user_preferences(user.id)
        if not user_preferences:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="価値観情報が登録されていません。先に価値観を設定してください。",
            )

        job_post, job_post_id = self.job_repo.create_job_post(
            user.id, user_input.industry, user_input.job_text
        )

        try:
            prompt = build_analysis_prompt(
                user_input.industry,
                user_input.job_text,
                user_preferences,
            )
            result_json = self.openai_client.analyze_job(prompt)

            job_post_title = result_json.get("job_post_title", "")
            matching_score = max(0, min(100, result_json.get("matching_score", 50)))
            black_risk_score = max(0, min(100, result_json.get("black_risk_score", 50)))
            matching_reason = result_json.get(
                "matching_reason", "分析結果を取得できませんでした"
            )
            black_risk_reason = result_json.get(
                "black_risk_reason", "分析結果を取得できませんでした"
            )

            self.job_repo.save_analysis_result(
                job_post=job_post,
                user_id=user.id,
                job_post_id=job_post_id,
                job_post_title=job_post_title,
                matching_score=matching_score,
                matching_reason=matching_reason,
                black_risk_score=black_risk_score,
                black_risk_reason=black_risk_reason,
            )

            return {
                "job_post_id": str(job_post_id),
                "matching_score": matching_score,
                "matching_reason": matching_reason,
                "black_risk_score": black_risk_score,
                "black_risk_reason": black_risk_reason,
            }
        except json.JSONDecodeError:
            self.job_repo.mark_job_failed(
                job_post, "AIの応答をパースできませんでした"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="分析結果の処理中にエラーが発生しました",
            )
        except HTTPException:
            raise
        except Exception as e:
            self.job_repo.mark_job_failed(job_post, str(e))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"分析中にエラーが発生しました: {str(e)}",
            )
