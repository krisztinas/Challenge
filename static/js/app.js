function loadExchanges() {
    fetch('/getExchanges')
    .then(response => response.json())
    .then(exchanges => {
        const exchangeSelect = document.getElementById('exchange');
        exchangeSelect.innerHTML = '<option value="">Please choose an exchange</option>';

        // Print the list of exchanges to the console
        console.log("Exchanges:", exchanges);

        exchanges.forEach(exchange => {
            const option = document.createElement('option');
            option.value = exchange.code;
            option.textContent = exchange.name;
            exchangeSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading exchanges:', error));
}

function selectExchange() {
    const exchangeCode = document.getElementById('exchange').value;
    const stockSelect = document.getElementById('stock');
    const priceDisplay = document.getElementById('price-display');

    while (stockSelect.options.length > 1) {
        stockSelect.remove(1);
    }
    priceDisplay.style.display = 'none';

    if (!exchangeCode) {
        document.getElementById('stock-query').style.display = 'none';
        return;
    }

    
    fetch('/getStocks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exchangeCode: exchangeCode }),
    })
    .then(response => response.json())
    .then(stocks => {
        stocks.forEach(stock => {
            const option = document.createElement('option');
            option.value = stock.code;
            option.textContent = stock.stockName;
            stockSelect.appendChild(option);
        });

        document.getElementById('stock-query').style.display = 'block';
    })
    .catch(error => console.error('Error loading stocks:', error));
}


function selectStock() {
    const exchangeCode = document.getElementById('exchange').value;
    const stockCode = document.getElementById('stock').value;
    const priceDisplay = document.getElementById('price');

    if (!exchangeCode || !stockCode) {
        priceDisplay.textContent = 'Please select both exchange and stock.';
        return;
    }

    fetch('/getPrice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exchangeCode: exchangeCode, stockCode: stockCode }),
    })
    .then(response => response.json())
    .then(data => {
        priceDisplay.textContent = data.price ? `$${data.price}` : 'Price information unavailable';
        document.getElementById('price-display').style.display = 'block';
    })
    .catch(error => console.error('Error fetching price:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    loadExchanges();
    document.getElementById('exchange').addEventListener('change', selectExchange);
    document.getElementById('stock').addEventListener('change', selectStock);
});
