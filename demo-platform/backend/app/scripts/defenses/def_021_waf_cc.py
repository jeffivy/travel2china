"""DEF-021: WAF-CC防护"""
import re
RULE_META = {'id':'DEF-021','name':'WAF-CC防护','product':'waf','category':'defense',
'blocks_attacks':['ATT-022'],'capability':'WAF-CC防护','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-022']:
        return {'severity':'high','alert_type':'blocked','description':'WAF-CC防护已拦截'+script_id,'matched_pattern':script_id}
    return None
