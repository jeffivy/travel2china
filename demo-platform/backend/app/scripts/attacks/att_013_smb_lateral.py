"""ATT-013: 横向移动 - SMB"""
import time

SCRIPT_META = {
    "id": "ATT-013", "name": "横向移动-SMB", "version": "1.0.0",
    "category": "system_vuln", "mitre_tactic": "TA0008", "severity": "critical",
    "target_node_types": ["pc", "server"],
    "blockable_by": ["edr-server", "firewall-brain"],
    "traffic_pattern": {"protocols": ["smb","tcp"], "port": [445, 139], "frequency": "medium"},
    "impact": {"type": "unauthorized_access", "description": "利用SMB共享横向移动至内网其他主机", "visual_effect": "节点连环变红 + 感染扩散动画"},
    "tools": ["psexec"], "customizable": True,
    "custom_params": [
        {"name": "target_host", "type": "string", "default": "172.20.0.105"},
        {"name": "username", "type": "string", "default": "administrator"},
    ],
}

def run(target_url: str, params: dict, context: dict) -> dict:
    result = {"script_id": "ATT-013", "status": "running", "logs": [], "evidence": [], "traffic_generated": []}
    target_host = params.get("target_host", "172.20.0.105")
    username = params.get("username", "administrator")
    result["logs"].append(f"[*] 从已控制主机横向探测内网...")
    time.sleep(0.2)
    result["logs"].append(f"[*] 扫描 SMB 端口 445...")
    time.sleep(0.2)
    result["logs"].append(f"[+] 发现 SMB 服务: {target_host}:445")
    result["logs"].append(f"[*] 尝试弱口令: {username}/admin123...")
    time.sleep(0.3)
    result["traffic_generated"].append({"method": "SMB", "dst": f"{target_host}:445", "username": username, "is_attack": True})
    time.sleep(0.2)
    result["logs"].append(f"[+] 认证成功! 获得 {target_host} 的 SYSTEM 权限")
    result["logs"].append(f"[+] 横向移动成功: 已控制 1 台新主机")
    result["evidence"].append({"type": "output", "data": f"PsExec -s \\\\{target_host} cmd.exe", "description": "PsExec命令"})
    result["status"] = "success"
    return result
