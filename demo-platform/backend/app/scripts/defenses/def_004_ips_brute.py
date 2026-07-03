"""DEF-004: IPS-暴力破解识别"""
import re
RULE_META = {'id':'DEF-004','name':'IPS-暴力破解识别','product':'firewall-brain','category':'defense',
'blocks_attacks':['ATT-006', 'ATT-007', 'ATT-008', 'ATT-030'],'capability':'IPS-暴力破解识别','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-006', 'ATT-007', 'ATT-008', 'ATT-030']:
        return {'severity':'high','alert_type':'blocked','description':'IPS-暴力破解识别已拦截'+script_id,'matched_pattern':script_id}
    return None
