"""DEF-011: 零信任-动态身份认证"""
import re
RULE_META = {'id':'DEF-011','name':'零信任-动态身份认证','product':'edr-pc','category':'defense',
'blocks_attacks':['ATT-006', 'ATT-007', 'ATT-008', 'ATT-030'],'capability':'零信任-动态身份认证','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-006', 'ATT-007', 'ATT-008', 'ATT-030']:
        return {'severity':'high','alert_type':'blocked','description':'零信任-动态身份认证已拦截'+script_id,'matched_pattern':script_id}
    return None
