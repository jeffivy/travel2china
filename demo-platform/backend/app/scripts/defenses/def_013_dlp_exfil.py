"""DEF-013: 终端DLP-外发检测"""
import re
RULE_META = {'id':'DEF-013','name':'终端DLP-外发检测','product':'edr-pc','category':'defense',
'blocks_attacks':['ATT-004', 'ATT-008', 'ATT-015', 'ATT-016', 'ATT-018'],'capability':'终端DLP-外发检测','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-004', 'ATT-008', 'ATT-015', 'ATT-016', 'ATT-018']:
        return {'severity':'high','alert_type':'blocked','description':'终端DLP-外发检测已拦截'+script_id,'matched_pattern':script_id}
    return None
