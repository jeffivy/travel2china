"""DEF-002: IPS-SQL注入特征阻断"""
import re
RULE_META = {'id':'DEF-002','name':'IPS-SQL注入特征阻断','product':'firewall-brain','category':'defense',
'blocks_attacks':['ATT-001', 'ATT-002', 'ATT-005'],'capability':'IPS-SQL注入特征阻断','severity':'high',
'config_schema':[{'name':'mode','type':'select','default':'block','options':['block','alert','off']}]}
def check(request: dict, config: dict) -> dict | None:
    mode = config.get('mode','block')
    if mode == 'off': return None
    script_id = request.get('script_id','')
    if script_id in ['ATT-001', 'ATT-002', 'ATT-005']:
        return {'severity':'high','alert_type':'blocked','description':'IPS-SQL注入特征阻断已拦截'+script_id,'matched_pattern':script_id}
    return None
