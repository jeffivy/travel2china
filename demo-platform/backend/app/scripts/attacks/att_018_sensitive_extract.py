"""ATT-018: 大模型违规-敏感信息提取"""
import time
SCRIPT_META = {'id':'ATT-018','name':'大模型违规-敏感信息提取','version':'1.0.0','category':'ai_attack','severity':'critical',
'target_node_types':['llm-app', 'db-server'],'blockable_by':['llm-guardrail', 'edr-pc'],
'traffic_pattern':{'protocols':['tcp'],'port':[80],'frequency':'medium'},
'impact':{'type':'unauthorized_access','description':'从LLM回复中提取训练数据敏感信息','visual_effect':'身份证号泄露弹窗'},
'tools':['sim'],'customizable':True,'custom_params':[]}
def run(target_url: str, params: dict, context: dict) -> dict:
    r={(k if k!='status' else k):(v if k!='status' else 'running') for k,v in {'script_id':'ATT-018','status':'running','logs':[],'evidence':[],'traffic_generated':[]}.items()}
    r['logs'].append(f'[*] 执行大模型违规-敏感信息提取: {target_url}')
    time.sleep(0.2)
    r['logs'].append('[+] 大模型违规-敏感信息提取 执行成功')
    r['evidence'].append({'type':'result','data':'大模型违规-敏感信息提取 completed','description':'从LLM回复中提取训练数据敏感信息'})
    r['status']='success'; return r
