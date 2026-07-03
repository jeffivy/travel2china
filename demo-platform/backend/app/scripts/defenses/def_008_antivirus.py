"""DEF-008: 防病毒-木马查杀"""
import re
RULE_META = {'id':'DEF-008','name':'防病毒-木马查杀','product':'firewall-brain','category':'defense',
'blocks_attacks':['ATT-019', 'ATT-020', 'ATT-021', 'ATT-025', 'ATT-026', 'ATT-005'],'capability':'防病毒-木马查杀','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-019', 'ATT-020', 'ATT-021', 'ATT-025', 'ATT-026', 'ATT-005']:
        return {'severity':'high','alert_type':'blocked','description':'防病毒-木马查杀已拦截'+script_id,'matched_pattern':script_id}
    return None
