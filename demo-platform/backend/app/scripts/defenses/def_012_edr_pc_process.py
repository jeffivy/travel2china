"""DEF-012: 终端EDR-进程行为"""
import re
RULE_META = {'id':'DEF-012','name':'终端EDR-进程行为','product':'edr-pc','category':'defense',
'blocks_attacks':['ATT-011', 'ATT-012', 'ATT-019', 'ATT-025', 'ATT-026'],'capability':'终端EDR-进程行为','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-011', 'ATT-012', 'ATT-019', 'ATT-025', 'ATT-026']:
        return {'severity':'high','alert_type':'blocked','description':'终端EDR-进程行为已拦截'+script_id,'matched_pattern':script_id}
    return None
