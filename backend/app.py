from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime, date
from database import get_db, init_db
from voice_parser import parse_voice_text

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def ensure_subscriptions_for_month(year, month):
    """确保某月的订阅记录已生成"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM subscriptions WHERE is_active = 1")
    subs = cursor.fetchall()

    for sub in subs:
        # 如果该月没有该日期，取该月最后一天（如2月30日->2月28日）
        import calendar
        last_day = calendar.monthrange(year, month)[1]
        day = min(sub['day_of_month'], last_day)
        sub_date = f"{year}-{month:02d}-{day:02d}"

        cursor.execute("""
            SELECT 1 FROM expenses 
            WHERE is_subscription_instance = 1 
            AND date = ? 
            AND note = ?
        """, (sub_date, sub['name']))
        exists = cursor.fetchone()

        if not exists:
            cursor.execute("""
                INSERT INTO expenses 
                (type, amount, category, payer, is_personal, note, date, is_subscription_instance)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                'expense', sub['amount'], sub['category'], sub['payer'],
                sub['is_personal'], sub['name'], sub_date
            ))

    conn.commit()
    conn.close()


@app.route('/api/summary', methods=['GET'])
def get_summary():
    start_date = request.args.get('start_date', date.today().replace(day=1).isoformat())
    end_date = request.args.get('end_date', date.today().isoformat())

    year, month = int(start_date[:4]), int(start_date[5:7])
    ensure_subscriptions_for_month(year, month)

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT COALESCE(SUM(amount), 0) as total FROM expenses 
        WHERE type = 'expense' AND payer = 'Wendy' AND date BETWEEN ? AND ?
    """, (start_date, end_date))
    wendy_total = cursor.fetchone()['total']

    cursor.execute("""
        SELECT COALESCE(SUM(amount), 0) as total FROM expenses 
        WHERE type = 'expense' AND payer = 'Daniel' AND date BETWEEN ? AND ?
    """, (start_date, end_date))
    daniel_total = cursor.fetchone()['total']

    cursor.execute("""
        SELECT COALESCE(SUM(amount), 0) as total FROM expenses 
        WHERE type = 'income' AND date BETWEEN ? AND ?
    """, (start_date, end_date))
    income_total = cursor.fetchone()['total']

    cursor.execute("""
        SELECT category, SUM(amount) as total FROM expenses 
        WHERE type = 'expense' AND date BETWEEN ? AND ?
        GROUP BY category ORDER BY total DESC
    """, (start_date, end_date))
    categories = [dict(row) for row in cursor.fetchall()]

    cursor.execute("""
        SELECT payer, category, SUM(amount) as total FROM expenses 
        WHERE type = 'expense' AND date BETWEEN ? AND ?
        GROUP BY payer, category ORDER BY payer, total DESC
    """, (start_date, end_date))
    payer_categories = [dict(row) for row in cursor.fetchall()]

    cursor.execute("""
        SELECT payer, COALESCE(SUM(amount), 0) as total FROM expenses 
        WHERE type = 'expense' AND is_personal = 1 AND date BETWEEN ? AND ?
        GROUP BY payer
    """, (start_date, end_date))
    personal_stats = {row['payer']: row['total'] for row in cursor.fetchall()}

    conn.close()

    return jsonify({
        'wendy_total': wendy_total,
        'daniel_total': daniel_total,
        'income_total': income_total,
        'categories': categories,
        'payer_categories': payer_categories,
        'personal_stats': personal_stats
    })


@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    start_date = request.args.get('start_date', date.today().replace(day=1).isoformat())
    end_date = request.args.get('end_date', date.today().isoformat())

    year, month = int(start_date[:4]), int(start_date[5:7])
    ensure_subscriptions_for_month(year, month)

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM expenses 
        WHERE date BETWEEN ? AND ? 
        ORDER BY date DESC, id DESC
    """, (start_date, end_date))
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(rows)


@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO expenses 
        (type, amount, category, payer, is_personal, note, date, receipt_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get('type', 'expense'),
        data['amount'],
        data.get('category', '其他'),
        data['payer'],
        1 if data.get('is_personal') else 0,
        data.get('note', ''),
        data.get('date', date.today().isoformat()),
        data.get('receipt_image', '')
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': new_id, 'message': 'Created'}), 201


@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE expenses SET 
            type = ?, amount = ?, category = ?, payer = ?, is_personal = ?, 
            note = ?, date = ?, receipt_image = ?
        WHERE id = ?
    """, (
        data.get('type', 'expense'),
        data['amount'],
        data.get('category', '其他'),
        data['payer'],
        1 if data.get('is_personal') else 0,
        data.get('note', ''),
        data.get('date', date.today().isoformat()),
        data.get('receipt_image', ''),
        expense_id
    ))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Updated'})


@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'})


@app.route('/api/subscriptions', methods=['GET'])
def get_subscriptions():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM subscriptions ORDER BY created_at DESC")
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(rows)


@app.route('/api/subscriptions', methods=['POST'])
def add_subscription():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO subscriptions 
        (name, amount, category, payer, is_personal, day_of_month, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data['name'], data['amount'], data.get('category', '订阅'),
        data['payer'], 1 if data.get('is_personal') else 0,
        data['day_of_month'], 1 if data.get('is_active', True) else 0
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': new_id, 'message': 'Created'}), 201


@app.route('/api/subscriptions/<int:sub_id>', methods=['PUT'])
def update_subscription(sub_id):
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE subscriptions SET 
            name = ?, amount = ?, category = ?, payer = ?, is_personal = ?, 
            day_of_month = ?, is_active = ?
        WHERE id = ?
    """, (
        data['name'], data['amount'], data.get('category', '订阅'),
        data['payer'], 1 if data.get('is_personal') else 0,
        data['day_of_month'], 1 if data.get('is_active', True) else 0,
        sub_id
    ))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Updated'})


@app.route('/api/subscriptions/<int:sub_id>', methods=['DELETE'])
def delete_subscription(sub_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM subscriptions WHERE id = ?", (sub_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'})


@app.route('/api/parse-voice', methods=['POST'])
def parse_voice():
    data = request.json
    text = data.get('text', '')
    result = parse_voice_text(text)
    return jsonify(result)


@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No filename'}), 400

    filename = datetime.now().strftime('%Y%m%d_%H%M%S_') + file.filename
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    return jsonify({'url': f'/uploads/{filename}'})


@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', debug=True, port=5000)
