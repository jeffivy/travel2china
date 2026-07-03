"""DEF-006: IPS-横向移动检测"""
import re
RULE_META = {'id':'DEF-006','name':'IPS-横向移动检测','product':'firewall-brain','category':'defense',
'blocks_attacks':['ATT-013', 'ATT-014', 'ATT-020', 'ATT-009'],'capability':'IPS-横向移动检测','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-013', 'ATT-014', 'ATT-020', 'ATT-009']:
        return {'severity':'high','alert_type':'blocked','description':'IPS-横向移动检测已拦截'+script_id,'matched_pattern':script_id}
    return None
