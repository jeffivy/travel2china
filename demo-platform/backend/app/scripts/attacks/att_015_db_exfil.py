"""ATT-015: 数据泄露-数据库外发"""
import time
SCRIPT_META = {'id':'ATT-015','name':'数据泄露-数据库外发','version':'1.0.0','category':'system_vuln','severity':'critical',
'target_node_types':['db-server'],'blockable_by':['edr-pc', 'soc'],
'traffic_pattern':{'protocols':['tcp'],'port':[80],'frequency':'medium'},
'impact':{'type':'unauthorized_access','description':'窃取数据库内容并外传到攻击者服务器','visual_effect':'数据包飞出动画'},
'tools':['sim'],'customizable':True,'custom_params':[]}
def run(target_url: str, params: dict, context: dict) -> dict:
    r={(k if k!='status' else k):(v if k!='status' else 'running') for k,v in {'script_id':'ATT-015','status':'running','logs':[],'evidence':[],'traffic_generated':[]}.items()}
    r['logs'].append(f'[*] 执行数据泄露-数据库外发: {target_url}')
    time.sleep(0.2)
    r['logs'].append('[+] 数据泄露-数据库外发 执行成功')
    r['evidence'].append({'type':'result','data':'数据泄露-数据库外发 completed','description':'窃取数据库内容并外传到攻击者服务器'})
    r['status']='success'; return r
