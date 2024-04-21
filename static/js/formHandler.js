// Attach event listener to form submission
document.getElementById("searchButton").addEventListener("click", handleFormSubmission);

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault(); // Prevent the default form submission behavior (sends you directly to API url)

    var preTaxIncome = document.getElementById('preTaxIncomeInput').value;

    // Construct the query string manually
    var queryParams = "preTaxIncome=" + encodeURIComponent(preTaxIncome) + "&status=For Sale";

    // Fetch data from the API endpoint
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
