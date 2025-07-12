from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():
    data = request.get_json()
    expression = data.get("expression", "")
    try:
        allowed_names = {
            key: value for key, value in math.__dict__.items() if not key.startswith("__")
        }
        allowed_names.update({"abs": abs, "round": round})
        result = eval(expression, {"__builtins__": None}, allowed_names)
        return jsonify(result=result)
    except Exception as err:
        return jsonify(result="Error")

if __name__ == "__main__":
    app.run(debug=True)


