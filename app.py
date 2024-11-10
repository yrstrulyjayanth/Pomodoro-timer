from flask import Flask, render_template, jsonify, request
import os

app = Flask(__name__, 
    static_folder='static',
    static_url_path='/static')

# Global variables to track timer state
current_time = 25 * 60  # 25 minutes in seconds
session_state = "work"

@app.route('/')
def index():
    return render_template('index.html', current_time=current_time, session_state=session_state)

@app.route('/start_session', methods=['POST'])
def start_session():
    global current_time, session_state
    session_type = request.json.get('session_type', 'work')
    is_reset = request.json.get('is_reset', False)

    # For reset, keep the current session type
    if is_reset:
        session_type = session_state
    
    # Set duration based on session type
    if session_type == 'work':
        current_time = 25 * 60  # 25 minutes
        session_state = "work"
    elif session_type == 'short-break':
        current_time = 5 * 60   # 5 minutes
        session_state = "short-break"
    elif session_type == 'long-break':
        current_time = 15 * 60  # 15 minutes
        session_state = "long-break"

    return jsonify({
        "status": "started",
        "time_left": current_time,
        "session_state": session_state
    })

if __name__ == '__main__':
    app.run(debug=True)
