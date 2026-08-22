/* =====================================================
   STOCK DATA
===================================================== */

const stockData = {

    RELIANCE: {
        price: 1425.30,
        change: 1.25,
        avg: 1390,
        quantity: 20
    },

    TCS: {
        price: 3842.75,
        change: 0.84,
        avg: 3720,
        quantity: 10
    },

    INFY: {
        price: 1682.40,
        change: -0.45,
        avg: 1710,
        quantity: 15
    },

    HDFCBANK: {
        price: 1934.20,
        change: 0.63,
        avg: 1880,
        quantity: 12
    },

    WIPRO: {
        price: 582.65,
        change: -0.28,
        avg: 590,
        quantity: 25
    }

};


/* =====================================================
   ORDERS
===================================================== */

let orders = [

    {
        stock: "RELIANCE",
        type: "BUY",
        orderType: "Market",
        price: 1425.30,
        status: "Completed"
    },

    {
        stock: "TCS",
        type: "BUY",
        orderType: "Market",
        price: 3842.75,
        status: "Completed"
    },

    {
        stock: "INFY",
        type: "SELL",
        orderType: "Limit",
        price: 1700,
        status: "Pending"
    }

];


/* =====================================================
   LOGIN
===================================================== */

const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value.trim();


        if (!username || !password) {

            showToast("Please enter username and password");

            return;

        }


        localStorage.setItem(
            "loggedIn",
            "true"
        );

        localStorage.setItem(
            "username",
            username
        );


        showApplication(username);

    }
);


/* =====================================================
   SHOW APPLICATION
===================================================== */

function showApplication(username) {

    document
        .getElementById("loginPage")
        .classList.add("hidden");


    document
        .getElementById("app")
        .classList.remove("hidden");


    document
        .getElementById("welcomeName")
        .textContent = username;


    document
        .getElementById("profileName")
        .textContent = username;


    document
        .querySelector(".profile-avatar")
        .textContent =
        username.charAt(0).toUpperCase();


    renderWatchlist();

    renderPortfolio();

    renderOrders();

    updatePortfolio();

}


/* =====================================================
   PASSWORD TOGGLE
===================================================== */

function togglePassword() {

    const password =
        document.getElementById("password");

    const icon =
        document.querySelector(".password-toggle i");


    if (password.type === "password") {

        password.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}


/* =====================================================
   WATCHLIST
===================================================== */

function renderWatchlist(
    filter = ""
) {

    const container =
        document.getElementById(
            "watchlistContainer"
        );


    container.innerHTML = "";


    Object.keys(stockData).forEach(
        function(stock) {

            if (
                filter &&
                !stock.includes(filter)
            ) {

                return;

            }


            const data =
                stockData[stock];


            const changeClass =
                data.change >= 0
                    ? "positive"
                    : "negative";


            const sign =
                data.change >= 0
                    ? "+"
                    : "";


            const row =
                document.createElement("div");


            row.className = "stock-row";


            row.innerHTML = `

                <div class="stock-info">

                    <strong>${stock}</strong>

                    <span>NSE</span>

                </div>


                <div class="stock-price">

                    ₹${formatNumber(data.price)}

                </div>


                <div class="stock-change ${changeClass}">

                    ${sign}${data.change}%

                </div>


                <div class="trade-buttons">

                    <button
                        class="trade-btn buy"
                        onclick="openTrade('${stock}', 'BUY')"
                    >
                        Buy
                    </button>

                    <button
                        class="trade-btn sell"
                        onclick="openTrade('${stock}', 'SELL')"
                    >
                        Sell
                    </button>

                </div>

            `;


            container.appendChild(row);

        }
    );

}


/* =====================================================
   SEARCH
===================================================== */

document
    .getElementById("stockSearch")
    .addEventListener(
        "input",
        function() {

            renderWatchlist(
                this.value
                    .trim()
                    .toUpperCase()
            );

        }
    );


/* =====================================================
   ADD STOCK
===================================================== */

function addStock() {

    const stock =
        prompt(
            "Enter stock symbol\n\nExample: RELIANCE"
        );


    if (!stock) {

        return;

    }


    const symbol =
        stock.trim().toUpperCase();


    if (stockData[symbol]) {

        showToast(
            `${symbol} is already in your watchlist`
        );

        return;

    }


    showToast(
        "Demo supports the listed stocks only"
    );

}


/* =====================================================
   TRADE MODAL
===================================================== */

let selectedTradeStock =
    "RELIANCE";

let selectedTradeType =
    "BUY";


function openTrade(
    stock,
    type
) {

    selectedTradeStock = stock;

    selectedTradeType = type;


    const data =
        stockData[stock];


    document
        .getElementById("selectedStock")
        .textContent = stock;


    document
        .getElementById("selectedPrice")
        .textContent =
        `₹${formatNumber(data.price)}`;


    document
        .getElementById("price")
        .value = data.price;


    document
        .getElementById("quantity")
        .value = 1;


    updateTradeUI();


    document
        .getElementById("tradeModal")
        .classList.add("active");


    updateEstimatedTotal();

}


/* =====================================================
   TRADE TYPE
===================================================== */

function setTradeType(type) {

    selectedTradeType = type;

    updateTradeUI();

}


function updateTradeUI() {

    const title =
        document.getElementById(
            "tradeTitle"
        );


    const buyTab =
        document.getElementById(
            "buyTab"
        );


    const sellTab =
        document.getElementById(
            "sellTab"
        );


    title.textContent =
        `${selectedTradeType === "BUY" ? "Buy" : "Sell"} ${selectedTradeStock}`;


    buyTab.classList.toggle(
        "active",
        selectedTradeType === "BUY"
    );


    sellTab.classList.toggle(
        "active",
        selectedTradeType === "SELL"
    );

}


/* =====================================================
   CLOSE TRADE
===================================================== */

function closeTrade() {

    document
        .getElementById("tradeModal")
        .classList.remove("active");

}


document
    .getElementById("tradeModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeTrade();

            }

        }
    );


/* =====================================================
   ESTIMATED TOTAL
===================================================== */

document
    .getElementById("quantity")
    .addEventListener(
        "input",
        updateEstimatedTotal
    );


document
    .getElementById("price")
    .addEventListener(
        "input",
        updateEstimatedTotal
    );


function updateEstimatedTotal() {

    const quantity =
        Number(
            document.getElementById(
                "quantity"
            ).value
        ) || 0;


    const price =
        Number(
            document.getElementById(
                "price"
            ).value
        ) || 0;


    const total =
        quantity * price;


    document
        .getElementById(
            "estimatedTotal"
        )
        .textContent =
        `₹${formatNumber(total)}`;

}


/* =====================================================
   PLACE ORDER
===================================================== */

function placeOrder() {

    const quantity =
        Number(
            document.getElementById(
                "quantity"
            ).value
        );


    const price =
        Number(
            document.getElementById(
                "price"
            ).value
        );


    const orderType =
        document.getElementById(
            "orderType"
        ).value;


    if (
        !quantity ||
        quantity <= 0
    ) {

        showToast(
            "Enter a valid quantity"
        );

        return;

    }


    if (
        !price ||
        price <= 0
    ) {

        showToast(
            "Enter a valid price"
        );

        return;

    }


    orders.unshift({

        stock: selectedTradeStock,

        type: selectedTradeType,

        orderType: orderType,

        price: price,

        status: "Completed"

    });


    renderOrders();


    closeTrade();


    showToast(
        `${selectedTradeType === "BUY" ? "Buy" : "Sell"} order placed successfully`
    );


    updatePortfolio();

}


/* =====================================================
   PORTFOLIO
===================================================== */

function renderPortfolio() {

    const container =
        document.getElementById(
            "portfolioRows"
        );


    container.innerHTML = "";


    Object.keys(stockData).forEach(
        function(stock) {

            const data =
                stockData[stock];


            const pnl =
                (
                    data.price -
                    data.avg
                ) * data.quantity;


            const pnlClass =
                pnl >= 0
                    ? "positive"
                    : "negative";


            const row =
                document.createElement("div");


            row.className =
                "table-row";


            row.innerHTML = `

                <span>
                    ${stock}
                </span>

                <span>
                    ${data.quantity}
                </span>

                <span>
                    ₹${formatNumber(data.avg)}
                </span>

                <span>
                    ₹${formatNumber(data.price)}
                </span>

                <span class="${pnlClass}">
                    ${pnl >= 0 ? "+" : ""}
                    ₹${formatNumber(Math.abs(pnl))}
                </span>

            `;


            container.appendChild(row);

        }
    );

}


/* =====================================================
   DYNAMIC P&L
===================================================== */

function updatePortfolio() {

    let totalInvested = 0;

    let totalValue = 0;


    Object.keys(stockData).forEach(
        function(stock) {

            const data =
                stockData[stock];


            totalInvested +=
                data.avg *
                data.quantity;


            totalValue +=
                data.price *
                data.quantity;

        }
    );


    const profit =
        totalValue -
        totalInvested;


    const returnPercent =
        totalInvested > 0
            ? (
                profit /
                totalInvested
            ) * 100
            : 0;


    document
        .getElementById("invested")
        .textContent =
        `₹${formatNumber(totalInvested)}`;


    document
        .getElementById("currentValue")
        .textContent =
        `₹${formatNumber(totalValue)}`;


    const profitElement =
        document.getElementById(
            "totalProfit"
        );


    profitElement.textContent =
        `${profit >= 0 ? "+" : "-"}₹${formatNumber(Math.abs(profit))}`;


    profitElement.className =
        profit >= 0
            ? "positive"
            : "negative";


    document
        .getElementById(
            "portfolioProfit"
        )
        .textContent =
        `${profit >= 0 ? "+" : "-"}₹${formatNumber(Math.abs(profit))}`;


    document
        .getElementById(
            "portfolioReturn"
        )
        .textContent =
        `${returnPercent >= 0 ? "+" : ""}${returnPercent.toFixed(2)}%`;


    document
        .getElementById(
            "portfolioReturn"
        )
        .className =
        returnPercent >= 0
            ? "positive"
            : "negative";


    renderPortfolio();

}


/* =====================================================
   ORDERS
===================================================== */

function renderOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );


    container.innerHTML = "";


    orders.slice(0,8).forEach(
        function(order) {

            const row =
                document.createElement("div");


            row.className =
                "order-row";


            const statusClass =
                order.status === "Completed"
                    ? "completed"
                    : "pending";


            row.innerHTML = `

                <div class="order-stock">

                    <strong>
                        ${order.stock}
                    </strong>

                    <span>
                        ${order.type} • ${order.orderType}
                    </span>

                </div>


                <span class="${statusClass}">
                    ${order.status}
                </span>


                <span>
                    ₹${formatNumber(order.price)}
                </span>

            `;


            container.appendChild(row);

        }
    );

}


/* =====================================================
   CHART
===================================================== */

const chartData = {

    "1D": [
        1408,
        1412,
        1410,
        1418,
        1420,
        1416,
        1424,
        1421,
        1427,
        1423,
        1429,
        1425
    ],

    "1W": [
        1385,
        1398,
        1402,
        1410,
        1405,
        1418,
        1422,
        1425
    ],

    "1M": [
        1340,
        1360,
        1352,
        1380,
        1375,
        1395,
        1408,
        1425
    ],

    "1Y": [
        1120,
        1180,
        1210,
        1195,
        1270,
        1300,
        1345,
        1425
    ]

};


const chartLabels = {

    "1D": [
        "9:15",
        "10:00",
        "10:45",
        "11:30",
        "12:15",
        "1:00",
        "1:45",
        "2:30",
        "3:00",
        "3:15",
        "3:30",
        "3:45"
    ],

    "1W": [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Mon",
        "Tue",
        "Today"
    ],

    "1M": [
        "Week 1",
        "Week 2",
        "Week 3",
        "Week 4",
        "Week 5",
        "Week 6",
        "Week 7",
        "Today"
    ],

    "1Y": [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug"
    ]

};


let stockChart;


function initializeChart() {

    const canvas =
        document.getElementById(
            "stockChart"
        );


    if (!canvas) {

        return;

    }


    stockChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels:
                        chartLabels["1D"],

                    datasets: [{

                        data:
                            chartData["1D"],

                        borderWidth: 2,

                        tension: .35,

                        pointRadius: 0,

                        fill: true

                    }]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        x: {

                            grid: {
                                display: false
                            }

                        },

                        y: {

                            grid: {
                                color: "#eeeeee"
                            }

                        }

                    }

                }

            }
        );

}


function changeChart(
    period,
    button
) {

    if (!stockChart) {

        return;

    }


    stockChart.data.labels =
        chartLabels[period];


    stockChart.data.datasets[0].data =
        chartData[period];


    stockChart.update();


    document
        .querySelectorAll(".chart-period")
        .forEach(
            function(btn) {

                btn.classList.remove(
                    "active"
                );

            }
        );


    button.classList.add("active");


    const values =
        chartData[period];


    const latest =
        values[values.length - 1];


    document
        .getElementById(
            "chartPrice"
        )
        .textContent =
        `₹${formatNumber(latest)}`;

}


/* =====================================================
   THEME
===================================================== */

function toggleTheme() {

    document
        .body
        .classList.toggle("dark");


    const isDark =
        document
            .body
            .classList
            .contains("dark");


    localStorage.setItem(
        "theme",
        isDark
            ? "dark"
            : "light"
    );


    const icon =
        document.querySelector(
            ".theme-btn i"
        );


    icon.className =
        isDark
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    document
        .getElementById(
            "toastMessage"
        )
        .textContent = message;


    toast.classList.add("show");


    setTimeout(
        function() {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =====================================================
   FORMAT NUMBER
===================================================== */

function formatNumber(number) {

    return Number(number)
        .toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


/* =====================================================
   DEMO MARKET MOVEMENT
===================================================== */

function simulateMarket() {

    Object.keys(stockData).forEach(
        function(stock) {

            const data =
                stockData[stock];


            const movement =
                (
                    Math.random() -
                    .5
                ) * .008;


            data.price =
                data.price *
                (1 + movement);


            data.change =
                data.change +
                movement * 100;

        }
    );


    renderWatchlist(
        document
            .getElementById(
                "stockSearch"
            )
            .value
            .trim()
            .toUpperCase()
    );


    updatePortfolio();

}


setInterval(
    simulateMarket,
    8000
);


/* =====================================================
   LOAD SAVED SETTINGS
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    function() {

        const savedTheme =
            localStorage.getItem(
                "theme"
            );


        if (savedTheme === "dark") {

            document
                .body
                .classList
                .add("dark");


            document
                .querySelector(
                    ".theme-btn i"
                )
                .className =
                "fa-solid fa-sun";

        }


        const loggedIn =
            localStorage.getItem(
                "loggedIn"
            );


        const username =
            localStorage.getItem(
                "username"
            );


        if (
            loggedIn === "true" &&
            username
        ) {

            showApplication(
                username
            );

        }


        initializeChart();

    }
);