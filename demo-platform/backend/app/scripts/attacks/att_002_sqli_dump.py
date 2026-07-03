"""ATT-002: SQL注入-拖库（联合查询）"""
import time, uuid
SCRIPT_META = {"id":"ATT-002","name":"SQL注入-拖库","version":"1.0.0","category":"web_vuln","mitre_tactic":"TA0009","cwe":["CWE-89"],"severity":"critical","target_node_types":["web-server","db-server"],"blockable_by":["waf","soc","edr-pc"],"traffic_pattern":{"protocols":["http"],"port":[80,443],"frequency":"low"},"impact":{"type":"data_leak","description":"拖出数据库敏感数据","visual_effect":"数据表格逐行流出动画"},"tools":["sqlmap"],"customizable":True,"custom_params":[{"name":"table","type":"string","default":"users"}]}
def run(target_url: str, params: dict, context: dict) -> dict:
    result = {"script_id":"ATT-002","status":"running","logs":[],"evidence":[],"traffic_generated":[]}
    table = params.get("table","users")
    result["logs"].append(f"[*] 探测SQL注入点: {target_url}/search?id=1")
    time.sleep(0.3)
    result["logs"].append("[*] 确认注入点存在，开始字段探测...")
    result["logs"].append("[+] 发现3列: id, username, password")
    result["logs"].append(f"[*] 拖取 {table} 表数据...")
    time.sleep(0.5)
    rows = [{"id":1,"username":"admin","password":"5f4dcc3b..."},{"id":2,"username":"zhangsan","password":"e10adc..."},{"id":3,"username":"lisi","password":"25d55a..."}]
    result["logs"].append(f"[+] 拖库成功! 获取 {len(rows)} 条记录")
    result["evidence"].append({"type":"data_table","data":rows,"description":f"{table}表数据"})
    result["status"]="success"; return result
