document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to form submission
    var searchForm = document.getElementById("searchForm");
    if (searchForm) {
        searchForm.addEventListener("submit", handleFormSubmission);
    }

    // Attach event listener to city filter
    var cityFilter = document.getElementById('cityFilter');
    if (cityFilter) {
        cityFilter.addEventListener('change', function() {
            var selectedCity = this.value;
            var tableRows = document.querySelectorAll('#resultsBody tr');
            tableRows.forEach(function(row) {
                var cityCell = row.querySelector('td:nth-child(5)');
                var city = cityCell.textContent.trim();
                if (selectedCity === '' || city === selectedCity) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault();

    var preTaxIncome = document.getElementById('preTaxIncomeInput').value;
    var downPayment = document.getElementById('downPaymentInput').value;

    if (preTaxIncome <= 0 || downPayment < 0) {
        document.getElementById("alertMessage").classList.remove("d-none");
        return;
    } else {
        document.getElementById("alertMessage").classList.add("d-none");
    }

    var queryParams = "preTaxIncome=" + encodeURIComponent(preTaxIncome) + "&downPayment=" + encodeURIComponent(downPayment) + "&status=For Sale";

    fetch('/api/v1.0/affordable_housing?' + queryParams)
        .then(response => response.json())
        .then(data => {
            // Call the function to populate the table with the data
            populateTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Populate the table with data
function populateTable(data) {
    var tbody = document.getElementById("resultsBody");
    tbody.innerHTML = ''; // Clear existing data

    data.forEach(function(property) {
        var row = tbody.insertRow();
        var fields = ['address', 'type_of_house', 'bedrooms', 'bathrooms', 'city', 'price', 'mortgage_insurance_eligible', 'down_payment', 'status'];

        fields.forEach(function(field) {
            var cell = row.insertCell();
            if (field === 'price' || field === 'down_payment') {
                // Apply currency formatting for 'price' and 'down_payment' fields
                var formatter = new Intl.NumberFormat('en-CA', {
                    style: 'currency',
                    currency: 'CAD'
                });
                cell.innerText = formatter.format(property[field]);
            } else if (field === 'bedrooms') {
                // Check if 'bedrooms' field exists, if no, set to 0
                cell.innerText = property.hasOwnProperty(field) ? property[field] : 0;
            } else {
                cell.innerText = property[field];
            }
        });
    });
}

// Filter table based on selected city
document.getElementById('cityFilter').addEventListener('change', function() {
    var selectedCity = this.value;
    var tableRows = document.querySelectorAll('#resultsBody tr');

    tableRows.forEach(function(row) {
        var cityCell = row.querySelector('td:nth-child(5)'); // nth-child(5) - city is the 5th column
        var city = cityCell.textContent.trim();
        if (selectedCity === '' || city === selectedCity) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});
