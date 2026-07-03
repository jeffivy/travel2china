"""
DEF-020: WAF - SQL/XSS/上传拦截

所属产品: 网站安全专家(WAF)
阻断的攻击: ATT-001, ATT-002, ATT-003, ATT-004, ATT-005
"""

import re

RULE_META = {
    "id": "DEF-020",
    "name": "WAF - SQL/XSS/上传拦截",
    "product": "waf",
    "category": "waf",
    "blocks_attacks": ["ATT-001", "ATT-002", "ATT-003", "ATT-004", "ATT-005"],
    "capability": "WAF SQL注入特征识别 + XSS特征识别 + 文件上传检测",
    "severity": "high",
    "config_schema": [
        {"name": "mode", "type": "select", "default": "block", "options": ["block", "alert", "off"]},
        {"name": "sensitivity", "type": "select", "default": "high", "options": ["low", "medium", "high"]},
        {"name": "ai_learning", "type": "boolean", "default": True},
    ],
}


# SQL 注入检测模式
SQLI_PATTERNS = [
    (r"(\s|%20|%09|\+|')union(\s|%20|%09|\+|')select", "SQL注入 - UNION查询"),
    (r"or\s+['\"\d]+\s*=\s*['\"\d]+", "SQL注入 - 逻辑绕过 (OR 恒等式)"),
    (r"or\s+1\s*=\s*1", "SQL注入 - OR 1=1"),
    (r"'\s*--\s*$", "SQL注入 - 注释截断"),
    (r"#\s*$", "SQL注入 - MySQL 注释"),
    (r"information_schema", "SQL注入 - 信息探测"),
    (r"select\s+.*\s+from\s+", "SQL注入 - SELECT 查询"),
    (r"drop\s+table", "SQL注入 - DROP 破坏"),
    (r"exec\s*\(.*xp_cmdshell", "SQL注入 - 命令执行"),
]

# XSS 检测模式
XSS_PATTERNS = [
    (r"<script.*?>.*?</script>", "XSS - 脚本标签注入"),
    (r"<script.*?>", "XSS - 脚本标签开头"),
    (r"javascript\s*:", "XSS - JavaScript 协议"),
    (r"onerror\s*=", "XSS - onerror 事件"),
    (r"onload\s*=", "XSS - onload 事件"),
    (r"<img\s+.*onerror", "XSS - IMG onerror"),
    (r"alert\s*\(.*\)", "XSS - alert 函数"),
    (r"document\.cookie", "XSS - Cookie 窃取"),
]

# 文件上传检测模式
FILE_UPLOAD_PATTERNS = [
    (r"\.php", "可疑文件上传 - PHP"),
    (r"\.jsp", "可疑文件上传 - JSP"),
    (r"\.asp", "可疑文件上传 - ASP"),
    (r"<\?php", "文件内容含 PHP 代码"),
    (r"eval\s*\(.*\$_(?:GET|POST|REQUEST)", "WebShell 特征 - eval"),
    (r"system\s*\(.*\$_(?:GET|POST)", "WebShell 特征 - system"),
]


def check(request: dict, config: dict) -> dict | None:
    """
    WAF 检测函数

    参数:
        request: {"method": "POST", "url": "...", "headers": {...}, "body": "...", "src_ip": "..."}
        config:  {"mode": "block", "sensitivity": "high", "ai_learning": True}

    返回: None (放行) 或 {"severity": "high", "alert_type": "sqli", "description": "...", "matched_pattern": "..."}
    """
    mode = config.get("mode", "block")
    if mode == "off":
        return None

    sensitivity = config.get("sensitivity", "high")

    # 构造待检测负载
    payload = ""
    if request.get("url"):
        payload += request["url"]
    if request.get("body"):
        body = request["body"]
        if isinstance(body, dict):
            body = str(body)
        payload += " " + body
    if request.get("query_string"):
        payload += " " + request["query_string"]

    payload_lower = payload.lower()

    # 检测 SQL 注入
    for pattern, description in SQLI_PATTERNS:
        if re.search(pattern, payload_lower, re.IGNORECASE):
            return {
                "severity": "high",
                "alert_type": "sqli_attempt",
                "description": description,
                "matched_pattern": pattern,
            }

    # 检测 XSS
    for pattern, description in XSS_PATTERNS:
        if re.search(pattern, payload_lower, re.IGNORECASE):
            return {
                "severity": "high" if "cookie" in payload_lower else "medium",
                "alert_type": "xss_attempt",
                "description": description,
                "matched_pattern": pattern,
            }

    # 检测文件上传
    content_type = request.get("headers", {}).get("Content-Type", "")
    if "multipart/form-data" in content_type:
        for pattern, description in FILE_UPLOAD_PATTERNS:
            if re.search(pattern, payload_lower, re.IGNORECASE):
                return {
                    "severity": "critical",
                    "alert_type": "file_upload_webshell",
                    "description": description,
                    "matched_pattern": pattern,
                }

    # 低敏感度模式下放行更多
    if sensitivity == "low":
        return None

    return None
