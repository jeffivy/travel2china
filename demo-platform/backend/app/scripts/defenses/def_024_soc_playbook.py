"""DEF-024: SOC-自动响应剧本"""
import re
RULE_META = {'id':'DEF-024','name':'SOC-自动响应剧本','product':'soc','category':'defense',
'blocks_attacks':['ATT-005', 'ATT-011', 'ATT-021'],'capability':'SOC-自动响应剧本','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-005', 'ATT-011', 'ATT-021']:
        return {'severity':'high','alert_type':'blocked','description':'SOC-自动响应剧本已拦截'+script_id,'matched_pattern':script_id}
    return None
