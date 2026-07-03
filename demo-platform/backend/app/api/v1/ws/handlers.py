"""WebSocket 路由处理"""

import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.api.v1.ws.manager import ws_manager
from app.services.auth_service import AuthService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    topic: str = Query(default=""),
    token: str = Query(default=""),
):
    """WebSocket 主入口

    客户端连接方式:
        ws://host:8080/ws?topic=packets:{exec_id}&token={jwt}

    topics:
        packets:{exec_id}   — 实时包摘要
        scenario:{exec_id}  — 剧本步骤状态
        alerts:{exec_id}    — 实时告警
        topology:updates    — 拓扑变更广播
    """
    # 鉴权
    if token:
        payload = AuthService.decode_token(token)
        if not payload:
            await websocket.close(code=4001, reason="Invalid token")
            return

    await ws_manager.connect(websocket, topic)
    logger.info(f"WebSocket 客户端已连接: topic={topic}")

    try:
        while True:
            # 接收客户端消息（心跳/控制指令）
            data = await websocket.receive_text()

            if data == "ping":
                await ws_manager.send_to(websocket, {"type": "pong"})
                continue

            # 尝试解析控制指令
            try:
                msg = json.loads(data)
                if msg.get("type") == "subscribe" and msg.get("topic"):
                    ws_manager._subscribe(websocket, msg["topic"])
                    await ws_manager.send_to(websocket, {"type": "subscribed", "topic": msg["topic"]})
            except json.JSONDecodeError:
                pass

    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
        logger.info(f"WebSocket 客户端断开: topic={topic}")
    except Exception as e:
        logger.error(f"WebSocket 异常: {e}")
        ws_manager.disconnect(websocket)
