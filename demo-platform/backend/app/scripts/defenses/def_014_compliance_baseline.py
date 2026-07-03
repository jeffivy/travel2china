"""DEF-014: 终端合规-基线检查"""
import re
RULE_META = {'id':'DEF-014','name':'终端合规-基线检查','product':'edr-pc','category':'defense',
'blocks_attacks':['ATT-007', 'ATT-027', 'ATT-029'],'capability':'终端合规-基线检查','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-007', 'ATT-027', 'ATT-029']:
        return {'severity':'high','alert_type':'blocked','description':'终端合规-基线检查已拦截'+script_id,'matched_pattern':script_id}
    return None
