"""DEF-010: 上网日志留存"""
import re
RULE_META = {'id':'DEF-010','name':'上网日志留存','product':'audit-brain','category':'defense',
'blocks_attacks':['ATT-024'],'capability':'上网日志留存','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-024']:
        return {'severity':'high','alert_type':'blocked','description':'上网日志留存已拦截'+script_id,'matched_pattern':script_id}
    return None
