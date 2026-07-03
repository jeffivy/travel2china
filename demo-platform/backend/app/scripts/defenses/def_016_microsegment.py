"""DEF-016: 主机微隔离-横向阻断"""
import re
RULE_META = {'id':'DEF-016','name':'主机微隔离-横向阻断','product':'edr-server','category':'defense',
'blocks_attacks':['ATT-013', 'ATT-014', 'ATT-020', 'ATT-021'],'capability':'主机微隔离-横向阻断','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-013', 'ATT-014', 'ATT-020', 'ATT-021']:
        return {'severity':'high','alert_type':'blocked','description':'主机微隔离-横向阻断已拦截'+script_id,'matched_pattern':script_id}
    return None
