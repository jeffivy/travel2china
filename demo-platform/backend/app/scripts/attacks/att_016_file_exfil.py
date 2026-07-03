"""ATT-016: 数据泄露-文件外发"""
import time
SCRIPT_META = {'id':'ATT-016','name':'数据泄露-文件外发','version':'1.0.0','category':'system_vuln','severity':'high',
'target_node_types':['server', 'pc'],'blockable_by':['edr-pc', 'soc'],
'traffic_pattern':{'protocols':['tcp'],'port':[80],'frequency':'medium'},
'impact':{'type':'unauthorized_access','description':'窃取敏感文件并通过HTTP外传','visual_effect':'文件飞出动画'},
'tools':['sim'],'customizable':True,'custom_params':[]}
def run(target_url: str, params: dict, context: dict) -> dict:
    r={(k if k!='status' else k):(v if k!='status' else 'running') for k,v in {'script_id':'ATT-016','status':'running','logs':[],'evidence':[],'traffic_generated':[]}.items()}
    r['logs'].append(f'[*] 执行数据泄露-文件外发: {target_url}')
    time.sleep(0.2)
    r['logs'].append('[+] 数据泄露-文件外发 执行成功')
    r['evidence'].append({'type':'result','data':'数据泄露-文件外发 completed','description':'窃取敏感文件并通过HTTP外传'})
    r['status']='success'; return r
