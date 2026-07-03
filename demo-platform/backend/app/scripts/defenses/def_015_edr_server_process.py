"""DEF-015: 主机EDR-进程行为"""
import re
RULE_META = {'id':'DEF-015','name':'主机EDR-进程行为','product':'edr-server','category':'defense',
'blocks_attacks':['ATT-005', 'ATT-006', 'ATT-008', 'ATT-011', 'ATT-012', 'ATT-013', 'ATT-014', 'ATT-019', 'ATT-020', 'ATT-021'],'capability':'主机EDR-进程行为','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-005', 'ATT-006', 'ATT-008', 'ATT-011', 'ATT-012', 'ATT-013', 'ATT-014', 'ATT-019', 'ATT-020', 'ATT-021']:
        return {'severity':'high','alert_type':'blocked','description':'主机EDR-进程行为已拦截'+script_id,'matched_pattern':script_id}
    return None
