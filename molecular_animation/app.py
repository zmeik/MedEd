from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/molecular-animation')
def molecular_animation():
    return render_template('animation.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Изменили порт на 5001
