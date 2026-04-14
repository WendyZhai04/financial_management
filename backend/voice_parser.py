import re

CATEGORIES = {
    '买菜': ['买菜', '蔬菜', '水果', '肉', '超市', '永辉', '盒马', '菜市场', '生鲜', '鸡蛋', '牛奶'],
    '餐饮': ['吃饭', '餐厅', '外卖', '奶茶', '咖啡', '午餐', '晚餐', '早餐', '饭店', '海底捞', '肯德基', '麦当劳'],
    '购物': ['购物', '买衣服', '淘宝', '京东', '拼多多', '天猫', '网购', '优衣库', 'zara', 'h&m'],
    '交通': ['打车', '公交', '地铁', '滴滴', '高铁', '火车', '机票', '加油', '出租车', 'uber'],
    '娱乐': ['电影', '游戏', '会员', 'kimi', 'apple music', 'netflix', 'spotify', 'b站', '爱奇艺', '腾讯视频'],
    '日用': ['日用品', '纸巾', '洗发水', '洗衣液', '牙膏', '水电', '煤气', '电费', '水费', '房租'],
    '学习': ['书', '课程', '学费', '考试', '报名'],
    '医疗': ['药', '医院', '看病', '挂号'],
    '其他': []
}

PAYERS = ['wendy', '文迪', '温蒂', 'wen di', 'daniel', '丹尼尔', '单尼尔', 'dan ni er']


def chinese_to_number(s):
    """简单中文数字转阿拉伯数字，支持十到一百以内的常见表达"""
    if not s:
        return None
    # 先尝试直接是阿拉伯数字
    if re.match(r'^\d+$', s):
        return int(s)
    
    mapping = {
        '一': 1, '二': 2, '两': 2, '三': 3, '四': 4,
        '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
    }
    
    total = 0
    temp = 0
    for char in s:
        if char not in mapping:
            continue
        num = mapping[char]
        if num == 10:
            if temp == 0:
                temp = 10
            else:
                temp *= 10
            total += temp
            temp = 0
        else:
            temp = num
    total += temp
    return total if total > 0 else None


def parse_voice_text(text):
    text_lower = text.lower().strip()
    
    # 1. 识别付款人
    payer = None
    for p in PAYERS:
        if p in text_lower:
            if p in ['wendy', '文迪', '温蒂', 'wen di']:
                payer = 'Wendy'
            else:
                payer = 'Daniel'
            break
    
    # 2. 识别金额（优先阿拉伯数字）
    amount = None
    # 匹配 "35块"、"35.5元"、"花了35" 等
    arabic_patterns = [
        r'(\d+(?:\.\d+)?)\s*[块元]',
        r'花了\s*(\d+(?:\.\d+)?)',
        r'消费\s*(\d+(?:\.\d+)?)',
        r'支出\s*(\d+(?:\.\d+)?)',
        r'(\d+(?:\.\d+)?)\s*块钱',
    ]
    for pattern in arabic_patterns:
        match = re.search(pattern, text_lower)
        if match:
            amount = float(match.group(1))
            break
    
    # 中文数字匹配，如 "三十五块"
    if amount is None:
        cn_match = re.search(r'([一二三四五六七八九十两百千万]+)\s*[块元]', text_lower)
        if cn_match:
            amount = chinese_to_number(cn_match.group(1))
            if amount is not None:
                amount = float(amount)
    
    # 3. 识别分类 & 提取备注关键词
    category = '其他'
    note_keyword = ''
    for cat, keywords in CATEGORIES.items():
        for kw in keywords:
            if kw in text_lower:
                category = cat
                note_keyword = kw
                break
        if category != '其他':
            break
    
    # 4. 识别个人标记
    is_personal = 0
    if any(w in text_lower for w in ['朋友', '自己', '单独', '个人']):
        is_personal = 1
    
    # 清理备注：原话去掉人名和金额词，保留核心动作
    note = note_keyword if note_keyword else text.strip()
    
    return {
        'payer': payer,
        'amount': amount,
        'category': category,
        'note': note,
        'is_personal': is_personal
    }
