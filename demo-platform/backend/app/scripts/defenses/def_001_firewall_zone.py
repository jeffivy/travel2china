"""DEF-001: 防火墙-区域隔离"""
import re
RULE_META = {'id':'DEF-001','name':'防火墙-区域隔离','product':'firewall-brain','category':'defense',
'blocks_attacks':['ATT-009', 'ATT-022', 'ATT-023'],'capability':'防火墙-区域隔离','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-009', 'ATT-022', 'ATT-023']:
        return {'severity':'high','alert_type':'blocked','description':'防火墙-区域隔离已拦截'+script_id,'matched_pattern':script_id}
    return None
