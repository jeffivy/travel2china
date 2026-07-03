"""DEF-025: 抗D-流量清洗"""
import re
RULE_META = {'id':'DEF-025','name':'抗D-流量清洗','product':'anti-ddos','category':'defense',
'blocks_attacks':['ATT-022', 'ATT-023'],'capability':'抗D-流量清洗','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-022', 'ATT-023']:
        return {'severity':'high','alert_type':'blocked','description':'抗D-流量清洗已拦截'+script_id,'matched_pattern':script_id}
    return None
