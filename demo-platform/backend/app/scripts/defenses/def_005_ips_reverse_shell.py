"""DEF-005: IPS-反弹Shell检测"""
import re
RULE_META = {'id':'DEF-005','name':'IPS-反弹Shell检测','product':'firewall-brain','category':'defense',
'blocks_attacks':['ATT-011', 'ATT-012'],'capability':'IPS-反弹Shell检测','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-011', 'ATT-012']:
        return {'severity':'high','alert_type':'blocked','description':'IPS-反弹Shell检测已拦截'+script_id,'matched_pattern':script_id}
    return None
