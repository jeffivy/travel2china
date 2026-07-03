"""DEF-018: 容器安全"""
import re
RULE_META = {'id':'DEF-018','name':'容器安全','product':'edr-server','category':'defense',
'blocks_attacks':['ATT-021'],'capability':'容器安全','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-021']:
        return {'severity':'high','alert_type':'blocked','description':'容器安全已拦截'+script_id,'matched_pattern':script_id}
    return None
