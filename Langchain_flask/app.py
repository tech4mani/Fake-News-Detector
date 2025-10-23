from flask import Flask, request, jsonify
from chains.news_chain import analyze_news
from utils.output_parser import parse_analysis
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/api/news/analyze', methods=['POST'])
def analyze():
    data = request.json
    article = data.get("text")

    if not article:
        return jsonify({"error": "Text is required"}), 400

    response_text = analyze_news(article)
    result = parse_analysis(response_text)

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
