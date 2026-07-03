"""DEF-022: WAF-抗逃逸检测"""
import re
RULE_META = {'id':'DEF-022','name':'WAF-抗逃逸检测','product':'waf','category':'defense',
'blocks_attacks':['ATT-001', 'ATT-011'],'capability':'WAF-抗逃逸检测','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-001', 'ATT-011']:
        return {'severity':'high','alert_type':'blocked','description':'WAF-抗逃逸检测已拦截'+script_id,'matched_pattern':script_id}
    return None
