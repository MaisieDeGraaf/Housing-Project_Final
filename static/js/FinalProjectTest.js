let URL = 'http://127.0.0.1:5000/api/v1.0/housing';
let weatherURL = "http://127.0.0.1:5000/api/v1.0/weather";

// Function to get data weather data 
function initializeWeatherApp() {

    d3.json(weatherURL)
        .then(weatherData => {
            
            window.weatherData = weatherData;

            // Populate the date selection dropdown
            populateDateSelect();

            // Display weather for the initial selected date (e.g., today)
            const currentDate = new Date();
            displayWeather(currentDate);
        })
        .catch(error => {
            console.error('Error loading weather data:', error);
        });
}

// Function to populate the dropdown menu
function populateDateSelect() {
    const dateSelect = document.getElementById('date-select');
    const currentDate = new Date();


    for (let i = 0; i < 5; i++) {
        let date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const option = document.createElement('option');
        option.value = i; 
        option.textContent = formattedDate;
        dateSelect.appendChild(option);
    }

    dateSelect.addEventListener('change', function() {
        const selectedIndex = parseInt(this.value);
        if (!isNaN(selectedIndex)) {
            const selectedDate = new Date(currentDate);
            selectedDate.setDate(currentDate.getDate() + selectedIndex);
            displayWeather(selectedDate);
        }
    });
}

// Function to display weather 
function displayWeather(selectedDate) {
    console.log('Selected Date:', selectedDate);

    const selectedMonth = selectedDate.getMonth() + 1;
    const selectedDay = selectedDate.getDate();

    console.log('Selected Month:', selectedMonth);
    console.log('Selected Day:', selectedDay);

    if (window.weatherData) {
        console.log('Weather Data:', window.weatherData);

        const weatherDataForSelectedDate = window.weatherData.filter(entry => {
            return entry.local_month === selectedMonth && entry.local_day === selectedDay;
        });

        console.log('Weather Data for Selected Date:', weatherDataForSelectedDate);

        if (weatherDataForSelectedDate.length > 0) {
            const averageMaxTemperature = calculateAverage(weatherDataForSelectedDate, 'max_temperature');
            const averageMinTemperature = calculateAverage(weatherDataForSelectedDate, 'min_temperature');
            const averagePrecipitation = calculateAverage(weatherDataForSelectedDate, 'total_precipitation');
            const totalSnowDays = weatherDataForSelectedDate.filter(entry => entry.total_snow > 0).length;
            const totalRainyDays = weatherDataForSelectedDate.filter(entry => entry.total_rain > 0).length;
            const totalDays = weatherDataForSelectedDate.length;

            console.log('Average Max Temperature:', averageMaxTemperature);
            console.log('Average Min Temperature:', averageMinTemperature);
            console.log('Average Precipitation:', averagePrecipitation);
            console.log('Total Snow Days:', totalSnowDays);
            console.log('Total Rainy Days:', totalRainyDays);
            console.log('Total Days with Data:', totalDays);

            const snowProbability = (totalSnowDays / totalDays) * 100;
            const rainProbability = (totalRainyDays / totalDays) * 100;

            console.log('Snow Probability:', snowProbability);
            console.log('Rain Probability:', rainProbability);

            const weatherBox = document.getElementById('weather-box');
            weatherBox.innerHTML = `
                <p>Average Max Temperature: ${averageMaxTemperature.toFixed(2)}°C</p>
                <p>Average Min Temperature: ${averageMinTemperature.toFixed(2)}°C</p>
                <p>Average Precipitation: ${averagePrecipitation.toFixed(2)} cm</p>
                <p>Snow Probability: ${snowProbability.toFixed(2)}%</p>
                <p>Rain Probability: ${rainProbability.toFixed(2)}%</p>
            `;
        } else {
            const weatherBox = document.getElementById('weather-box');
            weatherBox.textContent = "No weather data available for the selected date.";
        }
    } else {
        console.error('weatherData is not defined.'); 
    }
}

// Function to calculate average
function calculateAverage(data, key) {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, curr) => acc + curr[key], 0);
    return sum / data.length;
}

document.addEventListener('DOMContentLoaded', initializeWeatherApp);

d3.json(URL)
  .then(function(data) {
    // Log the loaded data for verification
    console.log(data);
    // Extract house status types and their counts
    let houseStatusCounts = {};
    data.forEach(function(item) {
      let houseStatus = item.status;
      if (!houseStatusCounts[houseStatus]) {
        houseStatusCounts[houseStatus] = 1;
      } else {
        houseStatusCounts[houseStatus]++;
      }
    });
    // Get house status labels and counts
    let houseStatusLabels = Object.keys(houseStatusCounts);
    let houseStatusData = Object.values(houseStatusCounts);

    const cityDropdown=document.getElementById("cityDropdown");
    cityDropdown.addEventListener("change", function(event){
        console.log("clicked")
    })
    // Populate dropdown menu
    const dropdown = d3.select("cityDropdown");
    const citys = ["All Cities","Burlington", "Milton", "Oakville","Oshawa", "Vaughan"];
    dropdown.selectAll("a")
        .data(citys)
        .enter()
        .append("a")
        .text(function(d) { return d; })
        .attr("href", "#");
       // Get the navbar links by their IDs
const AllCities = document.getElementById("AllCities");
const Burlington = document.getElementById("Burlington");
const Milton = document.getElementById("Milton");
const Oakville = document.getElementById("Oakville");
const Oshawa = document.getElementById("Oshawa");
const Vaughan = document.getElementById("Vaughan");
// Add click event listeners to each link
AllCities.addEventListener("click", handleDropdownAction);
Burlington.addEventListener("click", handleDropdownAction);
Milton.addEventListener("click", handleDropdownAction);
Oakville.addEventListener("click", handleDropdownAction);
Oshawa.addEventListener("click", handleDropdownAction);
Vaughan.addEventListener("click", handleDropdownAction);
// AllCities.addEventListener("click", changeRoute);

function changeRoute(event) {
event.preventDefault(); // Prevent the default link behavior
const route = event.target.getAttribute("href");
console.log(event)
// window.location.href = route;
}
function handleDropdownAction(event) {
event.preventDefault();
const action = event.target.innerText;
// alert(`Performing action: ${action}`);
console.log(action)
updateCharts(action);
}
   // Function to update charts based on selected city
    function updateCharts(selectedCity) {
        console.log(`inside updatecharts : ${selectedCity}`)
        // Filter data for the selected city or show all data if "All Cities" is selected
        const cityData = selectedCity === "All Cities" ? data : data.filter(item => item.city === selectedCity);
        // Extract house status types and their counts
        let houseStatusCounts = {};
        cityData.forEach(function(item) { // Change 'data' to 'cityData'
            let houseStatus = item.status;
            if (!houseStatusCounts[houseStatus]) {
                houseStatusCounts[houseStatus] = 1;
            } else {
                houseStatusCounts[houseStatus]++;
            }
        });
        dropdown.on("change", function() {
             const selectedCity = dropdown.property("#");
             updateChartsAndMetadata(selectedCity);
        console.log("option change")
        });
        // Get house status labels and counts
        let houseStatusLabels = Object.keys(houseStatusCounts);
        let houseStatusData = Object.values(houseStatusCounts);
        // Extract list and sale prices for the selected city
        const neighborhoodPrices = {};
        cityData.forEach(item => {
            const neighborhood = item.neighbourhood;
            const price = parseFloat(item.price);
            if (!neighborhoodPrices[neighborhood]) {
                neighborhoodPrices[neighborhood] = [];
            }
            neighborhoodPrices[neighborhood].push(price);
        });
        // Calculate average prices for each neighborhood in the selected city
        const neighborhoodAverages = {};
        Object.keys(neighborhoodPrices).forEach(neighborhood => {
            const prices = neighborhoodPrices[neighborhood];
            const averagePrice = prices.reduce((acc, cur) => acc + cur, 0) / prices.length;
            neighborhoodAverages[neighborhood] = averagePrice;
        });
        // Extract house types and their counts for the selected city
        let houseTypes = {};
        cityData.forEach(function(item) {
            let houseType = item.type_of_house;
            if (!houseTypes[houseType]) {
                houseTypes[houseType] = 0;
            }
            houseTypes[houseType]++;
        });

        myChart1.data.labels = houseStatusLabels;
        myChart1.data.datasets[0].data = houseStatusData;
        myChart1.update();

        myChart4.data.labels = Object.keys(neighborhoodAverages);
        myChart4.data.datasets[0].data = Object.values(neighborhoodAverages);
        myChart4.update();

        myChart5.data.labels = Object.keys(houseTypes);
        myChart5.data.datasets[0].data = Object.values(houseTypes);
        myChart5.update();

        myChart7.data.labels = Object.keys(neighborhoodPrices);
        myChart7.data.datasets[0].data = Object.values(neighborhoodPrices).map(prices => prices.length);
        myChart7.update();
    }
    // Extract house types and their counts
    let houseTypes = {};
    data.forEach(function(item) {
        let houseType = item.type_of_house;
        if (!houseTypes[houseType]) {
            houseTypes[houseType] = 0;
        }
        houseTypes[houseType]++;
    });
    // Step 3: Define options for your charts
    let options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Cities' // Label for the x-axis
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value, index, values) {
                        return '$' + value;
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Price'
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    };

    // Step 4: Create Chart.js instances
    let myChart1, myChart3, myChart4, myChart5, myChart6, myChart7;

    // Step 5: Function to update chart data
    function updateChartData(chart, newData) {
        chart.data.datasets[0].data = newData;
        chart.update();
    }

    // Step 6: Extract data for visualization
    let cities = [];
    let neighborhoods = [];
    let averageListPricesByCity = {};
    let averageSalePricesByCity = {};
    let averageListPricesByNeighborhood = {};
    let averageSalePricesByNeighborhood = {};

    data.forEach(function(item) {
        let city = item.city;
        let neighborhood = item.neighbourhood;
        let listPrice = parseFloat(item.price);
        let salePrice = parseFloat(item.sold_price);

        // Only consider entries where salePrice is not zero
        if (!isNaN(salePrice) && salePrice !== 0) {
            if (!averageListPricesByCity[city]) {
                averageListPricesByCity[city] = [];
                averageSalePricesByCity[city] = [];
            }

            if (!averageListPricesByNeighborhood[neighborhood]) {
                averageListPricesByNeighborhood[neighborhood] = [];
                averageSalePricesByNeighborhood[neighborhood] = [];
            }

            if (cities.indexOf(city) === -1) {
                cities.push(city);
            }

            if (neighborhoods.indexOf(neighborhood) === -1) {
                neighborhoods.push(neighborhood);
            }
            averageListPricesByCity[city].push(listPrice);
            averageSalePricesByCity[city].push(salePrice);
            averageListPricesByNeighborhood[neighborhood].push(listPrice);
            averageSalePricesByNeighborhood[neighborhood].push(salePrice);
        }
    });
    // Calculate average prices for each city
    cities.forEach(city => {
        let totalListPrice = averageListPricesByCity[city].reduce((acc, cur) => acc + cur, 0);
        let totalSalePrice = averageSalePricesByCity[city].reduce((acc, cur) => acc + cur, 0);
        let countListed = averageListPricesByCity[city].length;
        let countSold = averageSalePricesByCity[city].length;

        let averageListPrice = countListed > 0 ? totalListPrice / countListed : 0;
        let averageSalePrice = countSold > 0 ? totalSalePrice / countSold : 0;

        averageListPricesByCity[city] = averageListPrice;
        averageSalePricesByCity[city] = averageSalePrice;
    });
    // Calculate average prices for each neighborhood
    neighborhoods.forEach(neighborhood => {
        let totalListPrice = averageListPricesByNeighborhood[neighborhood].reduce((acc, cur) => acc + cur, 0);
        let totalSalePrice = averageSalePricesByNeighborhood[neighborhood].reduce((acc, cur) => acc + cur, 0);
        let countListed = averageListPricesByNeighborhood[neighborhood].length;
        let countSold = averageSalePricesByNeighborhood[neighborhood].length;

        let averageListPrice = countListed > 0 ? totalListPrice / countListed : 0;
        let averageSalePrice = countSold > 0 ? totalSalePrice / countSold : 0;

        averageListPricesByNeighborhood[neighborhood] = averageListPrice;
        averageSalePricesByNeighborhood[neighborhood] = averageSalePrice;
    });
    myChart1 = new Chart(document.getElementById('chart1'), {
        type: 'doughnut',
        data: {
            labels: houseStatusLabels,
            datasets: [{
                label: 'House Status',
                data: houseStatusData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)' 
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins:{
                title: {
                    display: true,
                    text: 'House Status',
                    font : {size:20}
            }},
            legend: {
                display: true,
                position: 'right',
                labels: {
                    boxWidth: 20
                }
            }
        }
    });
    myChart3 = new Chart(document.getElementById('chart3'), {
        type: 'bar',
        data: {
            labels: cities,
            datasets: [{
                label: 'Average List Price',
                data: Object.values(averageListPricesByCity),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Average Sale Price',
                data: Object.values(averageSalePricesByCity),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins:{
                    title:{
                        display:true,
                        text: 'Average List Price vs Average Sale Price per City',
                        font : {size : 20}

                    }},
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Cities'
                    }
                },
                y: {
                    title:{
                        display: true,
                        text: 'Price'
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function(value, index, values) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Price'
                    },
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
    myChart4 = new Chart(document.getElementById('chart4'), {
      type: 'bar',
      data: {
          labels: Object.keys(averageListPricesByNeighborhood), // Use neighborhood names as labels
          datasets: [{
              label: 'Average List Price',
              data: Object.values(averageListPricesByNeighborhood),
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
          }, {
              label: 'Average Sale Price',
              data: Object.values(averageSalePricesByNeighborhood),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          }]
      },
      options: {
            plugins :{
                title : {
                    display: true,
                    text : 'Average List Price vs Average Sale Price per Neighborhood',
                    font: {size : 20}
                    
                }},
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Neighborhoods' 
                  }
              },
              y: {
                title : {
                    display : true,
                    text : 'Price'
                },
                  beginAtZero: true,
                  ticks: {
                      callback: function(value, index, values) {
                          return '$' + value.toLocaleString();
                      }
                  },
                  scaleLabel: {
                      display: true,
                      labelString: 'Price'
                  },
                  grid: {
                      display: true,
                      color: 'rgba(0, 0, 0, 0.1)'
                  }
              }
          }
      }
  });
  myChart5 = new Chart(document.getElementById('chart5'), {
    type: 'bar',
    data: {
        labels: Object.keys(houseTypes),
        datasets: [{
            label: 'Number of Houses',
            data: Object.values(houseTypes),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {            
        plugins : {
            title : {
                display : true,
                text : 'Number of Houses per House Type',
                font : {size :20}

        }},
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Type of House'
                }
            },
            y: {
                title : {
                    display : true,
                    text: 'Number of Houses'
                },
                beginAtZero: true,
                ticks: {
                    callback: function(value, index, values) {
                        return value; 
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Number of Houses'
                },
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    }
});
    myChart6 = new Chart(document.getElementById('chart6'), {
        type: 'polarArea',
        data: {
            labels: cities,
            datasets: [{
                label: 'Houses Marked (by City)',
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                data: cities.map(city => data.filter(item => item.city === city).length)
            }]
        },
        options: {
            plugins : {
                title : {
                    display : true,
                    text : 'Number of Houses per City',
                    font : {size : 20}
                }},
            scale: {
                ticks: {
                    beginAtZero: true
                }
            }
        }
    });
    myChart7 = new Chart(document.getElementById('chart7'), {
        type: 'pie',
        data: {
            labels: neighborhoods,
            datasets: [{
                label: 'Houses Marked (by Neighborhood)',
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
                data: neighborhoods.map(neighborhood => data.filter(item => item.neighbourhood === neighborhood).length)
            }]
        },
        options: {
            plugins: {
                title:{
                    display : true,
                    text : 'Number of Houses per Neighborhood',
                    font : {size : 20}

            }},
            scales: {
                y: {
                    display: false
                }
            }
        }
    });

}).catch(function(error) {
    console.log('Error loading data:', error);
});
// Updated code for triggering the navbar dropdown menu and updating charts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Bootstrap Tab for the dropdown menu
    var cityDropdown = document.getElementById('cityDropdown');
    var tabTrigger = new bootstrap.Dropdown(cityDropdown);

    // Add event listener for dropdown change event
    cityDropdown.addEventListener('change', function(event) {
        event.preventDefault();
        tabTrigger.toggle(); // Toggle the dropdown menu
        updateCharts(cityDropdown.value); // Update charts based on the selected value
    });
    
});
document.addEventListener('DOMContentLoaded', function() {
   document.getElementById('cityDropdown').addEventListener('change', function() {
      const selectedCity = this.value;
      updateCharts(selectedCity);
   });
});



