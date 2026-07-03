"""DEF-017: RASP-运行时防护"""
import re
RULE_META = {'id':'DEF-017','name':'RASP-运行时防护','product':'edr-server','category':'defense',
'blocks_attacks':['ATT-001', 'ATT-005', 'ATT-014'],'capability':'RASP-运行时防护','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-001', 'ATT-005', 'ATT-014']:
        return {'severity':'high','alert_type':'blocked','description':'RASP-运行时防护已拦截'+script_id,'matched_pattern':script_id}
    return None
