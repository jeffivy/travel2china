"""批量创建拓扑模板和预置剧本"""
import json, os

config_dir = os.path.join(os.path.dirname(__file__), '..', 'config')

# === 拓扑模板 T-02 ~ T-05 ===
templates = {
    'T-02-factory.json': {
        'id': 'T-02', 'name': '制造企业工厂网络', 'background': 'machine_room',
        'nodes': [
            {'id':'n-attacker','type':'attacker','label':'攻击者','position':{'x':50,'y':250}},
            {'id':'n-fw','type':'firewall-brain','label':'安全大脑','position':{'x':250,'y':250}},
            {'id':'n-sw','type':'switch','label':'工业交换机','position':{'x':450,'y':250}},
            {'id':'n-mes','type':'app-server','label':'MES服务器','position':{'x':650,'y':100}},
            {'id':'n-plc','type':'app-server','label':'PLC工控机','position':{'x':650,'y':350}},
            {'id':'n-cam','type':'camera','label':'产线摄像头','position':{'x':650,'y':500}},
            {'id':'n-pc','type':'pc','label':'办公PC','position':{'x':450,'y':450}},
            {'id':'n-edr','type':'edr-server','label':'云镜(EDR)','position':{'x':850,'y':250}},
        ],
        'edges': [
            {'id':'e1','source_node_id':'n-attacker','target_node_id':'n-fw'},
            {'id':'e2','source_node_id':'n-fw','target_node_id':'n-sw'},
            {'id':'e3','source_node_id':'n-sw','target_node_id':'n-mes'},
            {'id':'e4','source_node_id':'n-sw','target_node_id':'n-plc'},
            {'id':'e5','source_node_id':'n-sw','target_node_id':'n-cam'},
            {'id':'e6','source_node_id':'n-fw','target_node_id':'n-pc'},
            {'id':'e7','source_node_id':'n-edr','target_node_id':'n-mes'},
        ], 'defense_config':{}
    },
    'T-03-hospital.json': {
        'id': 'T-03', 'name': '医院HIS网络', 'background': 'office',
        'nodes': [
            {'id':'n-attacker','type':'attacker','label':'攻击者','position':{'x':50,'y':250}},
            {'id':'n-fw','type':'firewall-brain','label':'安全大脑','position':{'x':250,'y':250}},
            {'id':'n-waf','type':'waf','label':'网站安全专家','position':{'x':450,'y':100}},
            {'id':'n-his','type':'app-server','label':'HIS服务器','position':{'x':650,'y':100}},
            {'id':'n-pacs','type':'app-server','label':'PACS影像','position':{'x':650,'y':250}},
            {'id':'n-db','type':'db-server','label':'病历数据库','position':{'x':650,'y':400}},
            {'id':'n-pc','type':'pc','label':'医生工作站','position':{'x':450,'y':450}},
            {'id':'n-cam','type':'camera','label':'病房摄像头','position':{'x':850,'y':250}},
            {'id':'n-edr','type':'edr-server','label':'云镜(EDR)','position':{'x':850,'y':400}},
        ],
        'edges': [
            {'id':'e1','source_node_id':'n-attacker','target_node_id':'n-fw'},
            {'id':'e2','source_node_id':'n-fw','target_node_id':'n-waf'},
            {'id':'e3','source_node_id':'n-waf','target_node_id':'n-his'},
            {'id':'e4','source_node_id':'n-his','target_node_id':'n-db'},
            {'id':'e5','source_node_id':'n-fw','target_node_id':'n-pacs'},
            {'id':'e6','source_node_id':'n-fw','target_node_id':'n-pc'},
            {'id':'e7','source_node_id':'n-fw','target_node_id':'n-cam'},
            {'id':'e8','source_node_id':'n-edr','target_node_id':'n-his'},
        ], 'defense_config':{}
    },
    'T-04-campus.json': {
        'id': 'T-04', 'name': '高校校园网', 'background': 'campus',
        'nodes': [
            {'id':'n-attacker','type':'attacker','label':'攻击者','position':{'x':50,'y':250}},
            {'id':'n-fw','type':'firewall-brain','label':'安全大脑','position':{'x':250,'y':250}},
            {'id':'n-sw','type':'switch','label':'核心交换机','position':{'x':450,'y':250}},
            {'id':'n-edu','type':'web-server','label':'教务系统','position':{'x':650,'y':50}},
            {'id':'n-lib','type':'web-server','label':'图书馆系统','position':{'x':650,'y':200}},
            {'id':'n-db','type':'db-server','label':'学生数据库','position':{'x':650,'y':350}},
            {'id':'n-wifi','type':'wifi-ap','label':'校园WiFi','position':{'x':450,'y':450}},
            {'id':'n-pc','type':'pc','label':'学生终端','position':{'x':850,'y':250}},
            {'id':'n-audit','type':'audit-brain','label':'审计版','position':{'x':250,'y':450}},
        ],
        'edges': [
            {'id':'e1','source_node_id':'n-attacker','target_node_id':'n-fw'},
            {'id':'e2','source_node_id':'n-fw','target_node_id':'n-sw'},
            {'id':'e3','source_node_id':'n-sw','target_node_id':'n-edu'},
            {'id':'e4','source_node_id':'n-sw','target_node_id':'n-lib'},
            {'id':'e5','source_node_id':'n-edu','target_node_id':'n-db'},
            {'id':'e6','source_node_id':'n-sw','target_node_id':'n-wifi'},
            {'id':'e7','source_node_id':'n-wifi','target_node_id':'n-pc'},
            {'id':'e8','source_node_id':'n-audit','target_node_id':'n-fw'},
        ], 'defense_config':{}
    },
    'T-05-government.json': {
        'id': 'T-05', 'name': '政府办公网', 'background': 'office',
        'nodes': [
            {'id':'n-attacker','type':'attacker','label':'攻击者','position':{'x':50,'y':250}},
            {'id':'n-fw','type':'firewall-brain','label':'安全大脑','position':{'x':250,'y':100}},
            {'id':'n-audit','type':'audit-brain','label':'审计版','position':{'x':250,'y':400}},
            {'id':'n-oa','type':'app-server','label':'OA系统','position':{'x':450,'y':100}},
            {'id':'n-mail','type':'app-server','label':'邮件系统','position':{'x':450,'y':300}},
            {'id':'n-meet','type':'app-server','label':'视频会议','position':{'x':450,'y':500}},
            {'id':'n-pc','type':'pc','label':'办公终端','position':{'x':650,'y':250}},
            {'id':'n-edr','type':'edr-pc','label':'云脉(终端)','position':{'x':850,'y':250}},
        ],
        'edges': [
            {'id':'e1','source_node_id':'n-attacker','target_node_id':'n-fw'},
            {'id':'e2','source_node_id':'n-fw','target_node_id':'n-oa'},
            {'id':'e3','source_node_id':'n-fw','target_node_id':'n-mail'},
            {'id':'e4','source_node_id':'n-fw','target_node_id':'n-meet'},
            {'id':'e5','source_node_id':'n-fw','target_node_id':'n-pc'},
            {'id':'e6','source_node_id':'n-edr','target_node_id':'n-pc'},
            {'id':'e7','source_node_id':'n-audit','target_node_id':'n-fw'},
        ], 'defense_config':{}
    },
}

# === 预置剧本 SCN-002 ~ SCN-008 ===
scenarios = {
    'SCN-002-ransomware.json': {
        'name': '勒索软件扩散', 'difficulty': 'hard', 'expected_duration_sec': 360,
        'description': '演示钓鱼邮件 -> 宏病毒 -> 勒索加密 -> 横向移动的全链路',
        'tags': ['勒索', '钓鱼', '横向移动', 'EDR'],
        'attack_sequence': [
            {'step_id':'s1','order':1,'script_id':'ATT-026','target_node_id':'n-pc','params':{},'wait_after_sec':3},
            {'step_id':'s2','order':2,'script_id':'ATT-021','target_node_id':'n-pc','params':{},'wait_after_sec':3},
            {'step_id':'s3','order':3,'script_id':'ATT-013','target_node_id':'n-pc','params':{},'wait_after_sec':2},
        ],
        'defense_snapshot': {
            'firewall-brain':{'enabled':False,'rules':{'DEF-008':{'enabled':False}}},
            'edr-pc':{'enabled':False,'rules':{'DEF-012':{'enabled':False}}},
            'edr-server':{'enabled':False,'rules':{'DEF-015':{'enabled':False},'DEF-016':{'enabled':False}}},
        }
    },
    'SCN-003-weak-password.json': {
        'name': '弱口令横向移动', 'difficulty': 'medium', 'expected_duration_sec': 300,
        'description': '演示SSH弱口令爆破 -> SMB横向移动 -> 数据泄露全流程',
        'tags': ['弱口令', '横向移动', '数据泄露'],
        'attack_sequence': [
            {'step_id':'s1','order':1,'script_id':'ATT-006','target_node_id':'n-app','params':{},'wait_after_sec':3},
            {'step_id':'s2','order':2,'script_id':'ATT-013','target_node_id':'n-pc','params':{},'wait_after_sec':2},
            {'step_id':'s3','order':3,'script_id':'ATT-015','target_node_id':'n-db','params':{},'wait_after_sec':2},
        ],
        'defense_snapshot': {
            'edr-pc':{'enabled':False,'rules':{'DEF-011':{'enabled':False}}},
            'edr-server':{'enabled':False,'rules':{'DEF-016':{'enabled':False}}},
        }
    },
    'SCN-004-ddos.json': {
        'name': 'DDoS攻击演示', 'difficulty': 'easy', 'expected_duration_sec': 180,
        'description': '演示HTTP CC攻击和SYN Flood，以及云堤抗D清洗效果',
        'tags': ['DDoS', 'CC攻击', '云堤'],
        'attack_sequence': [
            {'step_id':'s1','order':1,'script_id':'ATT-022','target_node_id':'n-web','params':{},'wait_after_sec':2},
            {'step_id':'s2','order':2,'script_id':'ATT-023','target_node_id':'n-web','params':{},'wait_after_sec':2},
        ],
        'defense_snapshot': {
            'anti-ddos':{'enabled':False,'rules':{'DEF-025':{'enabled':False}}},
            'waf':{'enabled':False,'rules':{'DEF-021':{'enabled':False}}},
        }
    },
    'SCN-005-camera.json': {
        'name': '摄像头入侵演示', 'difficulty': 'easy', 'expected_duration_sec': 180,
        'description': '演示摄像头弱口令和固件后门入侵',
        'tags': ['摄像头', 'IoT', '弱口令'],
        'attack_sequence': [
            {'step_id':'s1','order':1,'script_id':'ATT-027','target_node_id':'n-cam','params':{},'wait_after_sec':2},
            {'step_id':'s2','order':2,'script_id':'ATT-028','target_node_id':'n-cam','params':{},'wait_after_sec':2},
        ],
        'defense_snapshot': {
            'firewall-brain':{'enabled':False,'rules':{'DEF-007':{'enabled':False}}},
        }
    },
    'SCN-006-llm-guardrail.json': {
        'name': '大模型安全演示', 'difficulty': 'medium', 'expected_duration_sec': 240,
        'description': '演示提示词注入和敏感信息提取攻击',
        'tags': ['大模型', '提示注入', 'AI安全'],
        'attack_sequence': [
            {'step_id':'s1','order':1,'script_id':'ATT-017','target_node_id':'n-app','params':{},'wait_after_sec':3},
            {'step_id':'s2','order':2,'script_id':'ATT-018','target_node_id':'n-db','params':{},'wait_after_sec':3},
        ],
        'defense_snapshot': {
            'llm-guardrail':{'enabled':False,'rules':{'DEF-026':{'enabled':False},'DEF-027':{'enabled':False}}},
        }
    },
    'SCN-007-data-exfil.json': {
        'name': '数据泄露演示', 'difficulty': 'high', 'expected_duration_sec': 300,
        'description': '演示SQL注入拖库 -> 数据库外发 -> 文件外泄全流程',
        'tags': ['数据泄露', 'SQL注入', 'DLP'],
        'attack_sequence': [
            {'step_id':'s1','order':1,'script_id':'ATT-002','target_node_id':'n-web','params':{},'wait_after_sec':3},
            {'step_id':'s2','order':2,'script_id':'ATT-015','target_node_id':'n-db','params':{},'wait_after_sec':2},
            {'step_id':'s3','order':3,'script_id':'ATT-016','target_node_id':'n-pc','params':{},'wait_after_sec':2},
        ],
        'defense_snapshot': {
            'waf':{'enabled':False,'rules':{'DEF-020':{'enabled':False}}},
            'edr-pc':{'enabled':False,'rules':{'DEF-013':{'enabled':False}}},
        }
    },
    'SCN-008-phishing.json': {
        'name': '钓鱼邮件演示', 'difficulty': 'medium', 'expected_duration_sec': 240,
        'description': '演示钓鱼邮件凭证窃取和附件宏病毒攻击',
        'tags': ['钓鱼', '邮件安全', '社会工程学'],
        'attack_sequence': [
            {'step_id':'s1','order':1,'script_id':'ATT-025','target_node_id':'n-pc','params':{},'wait_after_sec':3},
            {'step_id':'s2','order':2,'script_id':'ATT-026','target_node_id':'n-pc','params':{},'wait_after_sec':3},
        ],
        'defense_snapshot': {
            'firewall-brain':{'enabled':False,'rules':{'DEF-008':{'enabled':False}}},
            'edr-pc':{'enabled':False,'rules':{'DEF-012':{'enabled':False}}},
        }
    },
}

# 写入模板
tmpl_dir = os.path.join(config_dir, 'topology-templates')
for fname, data in templates.items():
    path = os.path.join(tmpl_dir, fname)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'  Template: {fname}')

# 写入剧本
scn_dir = os.path.join(config_dir, 'scenario-presets')
for fname, data in scenarios.items():
    path = os.path.join(scn_dir, fname)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'  Scenario: {fname}')

print(f'\nDone: {len(templates)} templates + {len(scenarios)} scenarios')
