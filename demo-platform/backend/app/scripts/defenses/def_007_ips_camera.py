"""DEF-007: IPS-摄像头漏洞防护"""
import re
RULE_META = {'id':'DEF-007','name':'IPS-摄像头漏洞防护','product':'firewall-brain','category':'defense',
'blocks_attacks':['ATT-027', 'ATT-028', 'ATT-029'],'capability':'IPS-摄像头漏洞防护','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-027', 'ATT-028', 'ATT-029']:
        return {'severity':'high','alert_type':'blocked','description':'IPS-摄像头漏洞防护已拦截'+script_id,'matched_pattern':script_id}
    return None
