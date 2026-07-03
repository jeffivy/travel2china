"""脚本执行器 — 线程池 + 超时 + 日志"""

import asyncio
import concurrent.futures
import logging
from typing import Any

logger = logging.getLogger(__name__)

_executor = concurrent.futures.ThreadPoolExecutor(max_workers=4, thread_name_prefix="script-")


class ScriptExecutor:
    """脚本执行器"""

    @staticmethod
    async def run_attack(
        module: Any,
        target_url: str,
        params: dict,
        context: dict,
        timeout: int = 30,
    ) -> dict:
        """
        异步执行攻击脚本（用线程池避免阻塞事件循环）

        返回:
        {
            "script_id": "ATT-001",
            "status": "success" | "failed" | "blocked" | "error",
            "logs": [...],
            "evidence": [...],
            "traffic_generated": [...]
        }
        """
        loop = asyncio.get_event_loop()

        try:
            result = await asyncio.wait_for(
                loop.run_in_executor(
                    _executor,
                    module.run,
                    target_url,
                    params,
                    context,
                ),
                timeout=timeout,
            )

            if not isinstance(result, dict):
                result = {"status": "error", "logs": ["脚本返回格式异常"], "evidence": []}

            result.setdefault("status", "success")
            result.setdefault("logs", [])
            result.setdefault("evidence", [])
            result.setdefault("traffic_generated", [])

            return result

        except asyncio.TimeoutError:
            logger.warning(f"脚本执行超时: {getattr(module, 'SCRIPT_META', {}).get('id', '?')}")
            return {"status": "error", "logs": ["[!] 脚本执行超时"], "evidence": [], "traffic_generated": []}
        except Exception as e:
            logger.error(f"脚本执行异常: {e}")
            return {"status": "error", "logs": [f"[!] 异常: {str(e)}"], "evidence": [], "traffic_generated": []}
