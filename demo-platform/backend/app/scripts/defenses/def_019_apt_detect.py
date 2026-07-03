"""DEF-019: APT检测"""
import re
RULE_META = {'id':'DEF-019','name':'APT检测','product':'edr-server','category':'defense',
'blocks_attacks':['ATT-019', 'ATT-020', 'ATT-021'],'capability':'APT检测','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-019', 'ATT-020', 'ATT-021']:
        return {'severity':'high','alert_type':'blocked','description':'APT检测已拦截'+script_id,'matched_pattern':script_id}
    return None
