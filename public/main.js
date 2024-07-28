// main.js

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/validate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!result.valid) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error:', error);
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    }
});





document.addEventListener('DOMContentLoaded', loadDevices);

function addDevice() {
    const deviceName = document.getElementById('deviceName').value;
    const powerRating = parseFloat(document.getElementById('powerRating').value);
    const usageHours = parseFloat(document.getElementById('usageHours').value);
    const electricityCost = parseFloat(document.getElementById('electricityCost').value);

    if (isNaN(powerRating) || isNaN(usageHours) || isNaN(electricityCost)) {
        alert('Please enter valid numbers for power rating, usage hours, and electricity cost.');
        return;
    }
                                                                                                                                                                                                                                                
    const dailyConsumption = powerRating * usageHours / 1000;
    const monthlyConsumption = dailyConsumption * 30;
    const yearlyConsumption = dailyConsumption * 365;

    const device = {
        name: deviceName,
        power: powerRating,
        hours: usageHours,
        cost: electricityCost,
        daily: dailyConsumption.toFixed(2),
        monthly: monthlyConsumption.toFixed(2),
        yearly: yearlyConsumption.toFixed(2)
    };

    saveDevice(device);
    addDeviceToTable(device);
    document.getElementById('deviceForm').reset();
}

function addDeviceToTable(device) {
    const table = document.getElementById('deviceTable').getElementsByTagName('tbody')[0];
    const row = table.insertRow();

    row.insertCell(0).textContent = device.name;
    row.insertCell(1).textContent = device.power;
    row.insertCell(2).textContent = device.hours;
    row.insertCell(3).textContent = device.cost;
    row.insertCell(4).textContent = device.daily;
    row.insertCell(5).textContent = device.monthly;
    row.insertCell(6).textContent = device.yearly;

    const actionsCell = row.insertCell(7);
    actionsCell.className = 'actions';
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => {
        deleteDevice(device.name);
        row.remove();
    };
    actionsCell.appendChild(deleteButton);
}

function saveDevice(device) {
    const devices = JSON.parse(localStorage.getItem('devices')) || [];
    devices.push(device);
    localStorage.setItem('devices', JSON.stringify(devices));
}

function loadDevices() {
    const devices = JSON.parse(localStorage.getItem('devices')) || [];
    devices.forEach(addDeviceToTable);
}

function deleteDevice(deviceName) {
    let devices = JSON.parse(localStorage.getItem('devices')) || [];
    devices = devices.filter(device => device.name !== deviceName);
    localStorage.setItem('devices', JSON.stringify(devices));
}
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/validate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!result.valid) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error:', error);
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadDevices();
});

let devices = [];

function addDevice() {
    const deviceName = document.getElementById('deviceName').value;
    const powerRating = document.getElementById('powerRating').value;
    const usageHours = document.getElementById('usageHours').value;
    const electricityCost = document.getElementById('electricityCost').value;

    const dailyConsumption = (powerRating * usageHours) / 1000;
    const monthlyConsumption = dailyConsumption * 30;
    const yearlyConsumption = dailyConsumption * 365;

    const device = {
        name: deviceName,
        power: powerRating,
        hours: usageHours,
        cost: electricityCost,
        daily: dailyConsumption,
        monthly: monthlyConsumption,
        yearly: yearlyConsumption,
    };

    devices.push(device);
    displayDevices();
}

function displayDevices() {
    const deviceTable = document.getElementById('deviceTable').getElementsByTagName('tbody')[0];
    deviceTable.innerHTML = '';

    devices.forEach((device, index) => {
        const row = deviceTable.insertRow();
        row.insertCell(0).textContent = device.name;
        row.insertCell(1).textContent = device.power;
        row.insertCell(2).textContent = device.hours;
        row.insertCell(3).textContent = device.cost;
        row.insertCell(4).textContent = device.daily.toFixed(2);
        row.insertCell(5).textContent = device.monthly.toFixed(2);
        row.insertCell(6).textContent = device.yearly.toFixed(2);

        const actionsCell = row.insertCell(7);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            devices.splice(index, 1);
            displayDevices();
        };
        actionsCell.appendChild(deleteButton);
    });
}

async function exportToCSV() {
    const response = await fetch('/export/csv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ devices }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devices.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function exportToExcel() {
    const response = await fetch('/export/excel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ devices }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devices.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function exportToPDF() {
    const response = await fetch('/export/pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ devices }),
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devices.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
