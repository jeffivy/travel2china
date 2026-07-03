"""WebSocket 连接管理器"""

import asyncio
import json
import logging
from typing import Any
from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    """WebSocket 连接池管理"""

    def __init__(self):
        # topic -> set of WebSocket connections
        self._connections: dict[str, set[WebSocket]] = {}
        # WebSocket -> set of topics
        self._ws_topics: dict[WebSocket, set[str]] = {}

    async def connect(self, websocket: WebSocket, topic: str = ""):
        """接受 WebSocket 连接"""
        await websocket.accept()
        if topic:
            self._subscribe(websocket, topic)
        logger.debug(f"WebSocket 连接: topic={topic}")

    def disconnect(self, websocket: WebSocket):
        """断开连接"""
        topics = self._ws_topics.pop(websocket, set())
        for topic in topics:
            conns = self._connections.get(topic, set())
            conns.discard(websocket)
            if not conns:
                self._connections.pop(topic, None)
        logger.debug(f"WebSocket 断开: topics={topics}")

    def _subscribe(self, websocket: WebSocket, topic: str):
        """订阅 topic"""
        if topic not in self._connections:
            self._connections[topic] = set()
        self._connections[topic].add(websocket)

        if websocket not in self._ws_topics:
            self._ws_topics[websocket] = set()
        self._ws_topics[websocket].add(topic)

    async def broadcast(self, topic: str, data: Any):
        """广播消息到某个 topic 的所有连接"""
        conns = self._connections.get(topic, set())
        dead: list[WebSocket] = []

        message = json.dumps(data, default=str, ensure_ascii=False)

        for ws in conns.copy():
            try:
                await ws.send_text(message)
            except Exception:
                dead.append(ws)

        for ws in dead:
            self.disconnect(ws)

    async def send_to(self, websocket: WebSocket, data: Any):
        """发送消息给单个连接"""
        try:
            await websocket.send_text(json.dumps(data, default=str, ensure_ascii=False))
        except Exception:
            self.disconnect(websocket)

    @property
    def stats(self) -> dict:
        return {
            "topics": {t: len(conns) for t, conns in self._connections.items()},
            "total_connections": len(self._ws_topics),
        }


# 全局单例
ws_manager = ConnectionManager()
