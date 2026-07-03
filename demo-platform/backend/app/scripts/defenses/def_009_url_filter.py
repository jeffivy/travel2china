"""DEF-009: URL过滤-黑名单"""
import re
RULE_META = {'id':'DEF-009','name':'URL过滤-黑名单','product':'audit-brain','category':'defense',
'blocks_attacks':['ATT-024'],'capability':'URL过滤-黑名单','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-024']:
        return {'severity':'high','alert_type':'blocked','description':'URL过滤-黑名单已拦截'+script_id,'matched_pattern':script_id}
    return None
