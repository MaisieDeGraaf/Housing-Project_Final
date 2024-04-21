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


// Function to populate the table with data
function populateTable(data) {
    var tbody = document.getElementById("resultsBody");
    tbody.innerHTML = ''; // Clear existing data

    data.forEach(function(property) {
        var row = tbody.insertRow();
        var fields = ['address', 'type_of_house', 'bedrooms', 'bathrooms', 'city', 'price', 'mortgage_insurance_eligible', 'min_down_payment_for_insurance', 'status'];

        fields.forEach(function(field) {
            var cell = row.insertCell();

            // Format currency fields
            if (field === 'price' || field === 'min_down_payment_for_insurance' || field === 'down_payment') {
                if (!isNaN(property[field])) {
                    var formatter = new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD'
                    });
                    cell.innerText = formatter.format(property[field]);
                } else {
                    console.error('Invalid value for', field + ':', property[field]);
                    cell.innerText = 'N/A';
                }
            } else {
                cell.innerText = property[field];
            }
        });
    });
}