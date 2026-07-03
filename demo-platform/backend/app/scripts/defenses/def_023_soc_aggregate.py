"""DEF-023: SOC-告警聚合"""
import re
RULE_META = {'id':'DEF-023','name':'SOC-告警聚合','product':'soc','category':'defense',
'blocks_attacks':['ATT-001', 'ATT-002', 'ATT-009', 'ATT-015', 'ATT-016', 'ATT-024', 'ATT-025', 'ATT-027', 'ATT-028'],'capability':'SOC-告警聚合','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-001', 'ATT-002', 'ATT-009', 'ATT-015', 'ATT-016', 'ATT-024', 'ATT-025', 'ATT-027', 'ATT-028']:
        return {'severity':'high','alert_type':'blocked','description':'SOC-告警聚合已拦截'+script_id,'matched_pattern':script_id}
    return None
