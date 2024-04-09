from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

def loadStockData():
    try:
        with open('Inputs/ChatbotStockData.json') as file:
            data = json.load(file)

            for item in data:
                if not all(key in item for key in ['code', 'stockExchange', 'topStocks']):
                    raise ValueError("JSON item missing required keys")
            return data

    except (FileNotFoundError, json.JSONDecodeError, ValueError) as e:
        print(f"Error loading or parsing stock data: {e}")
        return []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getExchanges', methods=['GET'])
def getExchanges():
    data = loadStockData()

    if not data:
        return jsonify({"error": "Stock data not available"}), 500

    exchanges = [{'code': item['code'], 'name': item['stockExchange']} for item in data]
    return jsonify(exchanges)

@app.route('/getStocks', methods=['POST'])
def getStocks():
    data = loadStockData()
    content = request.json
    exchange_code = content.get('exchangeCode')
    
    for exchange in data:
        if exchange['code'] == exchange_code:
            return jsonify(exchange['topStocks'])

    return jsonify({"error": "Exchange not found"}), 404

@app.route('/getPrice', methods=['POST'])
def getPrice():
    data = loadStockData()
    content = request.json
    exchange_code = content.get('exchangeCode')
    stock_code = content.get('stockCode')

    exchange = next((item for item in data if item['code'] == exchange_code), None)
    if not exchange:
        return jsonify({"error": "Exchange not found"}), 404
    
    stock = next((stk for stk in exchange['topStocks'] if stk['code'] == stock_code), None)
    if not stock:
        return jsonify({"error": "Stock not found"}), 404

    return jsonify({"price": stock.get('price')})

if __name__ == "__main__":
    app.run(debug=True, port=5010)
