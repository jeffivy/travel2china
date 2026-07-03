"""DEF-027: 大模型围栏-输出过滤"""
import re
RULE_META = {'id':'DEF-027','name':'大模型围栏-输出过滤','product':'llm-guardrail','category':'defense',
'blocks_attacks':['ATT-017', 'ATT-018'],'capability':'大模型围栏-输出过滤','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-017', 'ATT-018']:
        return {'severity':'high','alert_type':'blocked','description':'大模型围栏-输出过滤已拦截'+script_id,'matched_pattern':script_id}
    return None
