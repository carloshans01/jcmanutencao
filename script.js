// Variáveis globais para os gráficos
let typesChart, statusChart, topCostsChart, failuresTrendChart, costTrendChart, slaChart, techniciansChart;
let editMode = false;
let currentImageSrc = "https://randomuser.me/api/portraits/men/32.jpg";
let allMaintenanceData = []; // Armazena todos os dados de manutenção

// Função para abrir/fechar abas
function openTab(tabId) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Funções do modal de personalização
function openCustomizationModal() {
    document.getElementById('nameInput').value = document.getElementById('userName').textContent;
    document.getElementById('positionInput').value = document.getElementById('userPosition').textContent;
    document.getElementById('previewImage').src = currentImageSrc;
    document.getElementById('customizationModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('customizationModal').style.display = 'none';
}

function previewImageFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImage').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function saveProfileChanges() {
    const newName = document.getElementById('nameInput').value;
    const newPosition = document.getElementById('positionInput').value;
    const previewImage = document.getElementById('previewImage').src;

    if (newName && newPosition) {
        const profileData = { name: newName, position: newPosition, image: previewImage };
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        loadProfileData();
        closeModal();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem('userProfile'));
    if (profileData) {
        document.getElementById('userName').textContent = profileData.name;
        document.getElementById('userPosition').textContent = profileData.position;
        document.getElementById('userImage').src = profileData.image;
        currentImageSrc = profileData.image;
    }
}

// Funções de Gráficos e Filtros
function initCharts() {
    const chartOptions = (onClickHandler) => ({
        responsive: true,
        maintainAspectRatio: false,
        onClick: onClickHandler,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#e1e1e6' } },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                        return `${context.label}: ${context.raw} (${percentage}%)`;
                    }
                }
            }
        }
    });

    typesChart = new Chart(document.getElementById('typesChart'), {
        type: 'doughnut',
        options: chartOptions((evt, elements) => {
            if (elements.length > 0) {
                const clickedLabel = typesChart.data.labels[elements[0].index];
                document.getElementById('type-filter').value = clickedLabel;
                applyFilters();
            }
        })
    });
    statusChart = new Chart(document.getElementById('statusChart'), {
        type: 'pie',
        options: chartOptions((evt, elements) => {
            if (elements.length > 0) {
                const clickedLabel = statusChart.data.labels[elements[0].index];
                const filteredData = allMaintenanceData.filter(item => item.status === clickedLabel);
                renderMaintenanceTable(filteredData);
            }
        })
    });
    topCostsChart = new Chart(document.getElementById('topCostsChart'), { type: 'doughnut', options: chartOptions() });
    failuresTrendChart = new Chart(document.getElementById('failuresTrendChart'), { type: 'line', options: chartOptions() });
    costTrendChart = new Chart(document.getElementById('costTrendChart'), {
        type: 'bar',
        options: chartOptions((evt, elements) => {
            if (elements.length > 0) {
                const clickedMonth = costTrendChart.data.labels[elements[0].index];
                const filteredData = allMaintenanceData.filter(item => {
                    if (!item.date) return false;
                    const itemMonth = new Date(item.date).toLocaleString('pt-BR', { month: 'short' });
                    return itemMonth === clickedMonth;
                });
                renderMaintenanceTable(filteredData);
            }
        })
    });
    techniciansChart = new Chart(document.getElementById('techniciansChart'), { type: 'pie', options: chartOptions() });
}

function applyFilters() {
    const timeFilter = document.getElementById('time-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const now = new Date();

    let filteredData = allMaintenanceData;

    if (timeFilter !== 'all') {
        filteredData = filteredData.filter(item => {
            if (!item.date) return false;
            const itemDate = new Date(item.date);
            const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
            return diffDays <= parseInt(timeFilter);
        });
    }

    if (typeFilter !== 'all') {
        filteredData = filteredData.filter(item => item.type === typeFilter);
    }

    updateAllVisuals(filteredData);
}

function clearFilters() {
    document.getElementById('time-filter').value = 'all';
    document.getElementById('type-filter').value = 'all';
    applyFilters();
    renderMaintenanceTable(allMaintenanceData); // Garante que a tabela principal seja re-renderizada com todos os dados
}

function updateAllVisuals(data) {
    updateKpis(data);
    updateTypesChart(data);
    updateStatusChart(data);
    updateTopCostsChart(data);
    updateFailuresTrendChart(data);
    updateCostTrendChart(data);
    updateTechniciansChart(data);
    renderMaintenanceTable(data);
    updatePredictiveAlerts();
}

function updatePredictiveAlerts() {
    const alertsList = document.getElementById('predictiveAlertsList');
    alertsList.innerHTML = '';
    const rows = document.querySelectorAll('#partsTable tbody tr');

    rows.forEach(row => {
        const partName = row.cells[1].querySelector('input').value;
        const healthStatusDiv = row.cells[7].querySelector('.health-status');
        if (healthStatusDiv) {
            const statusText = healthStatusDiv.textContent;
            if (statusText === 'Atenção' || statusText === 'Substituir') {
                const li = document.createElement('li');
                li.className = healthStatusDiv.className.replace('health-status', '').trim();
                li.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <strong>${partName}:</strong> Status de saúde - ${statusText}`;
                alertsList.appendChild(li);
            }
        }
    });

    if (alertsList.children.length === 0) {
        alertsList.innerHTML = '<li>Nenhum alerta preditivo no momento.</li>';
    }
}

function updateKpis(data) {
    const { totalHours = 0, totalFailures = 1 } = JSON.parse(localStorage.getItem('metricsData')) || {};
    const mtbf = totalFailures > 0 ? (totalHours / totalFailures) : 0;
    const mttr = data.filter(d => d.type === 'Corretiva').reduce((sum, item) => sum + parseFloat(item.duration || 0), 0) / (data.filter(d => d.type === 'Corretiva').length || 1);

    const availability = (mtbf / (mtbf + mttr)) * 100;
    document.getElementById('availabilityResult').textContent = isNaN(availability) ? '0.00%' : availability.toFixed(2) + '%';
    document.getElementById('mtbfResult').textContent = mtbf.toFixed(0);
    document.getElementById('mttrResult').textContent = mttr.toFixed(0);

    const totalCost = data.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
    document.getElementById('totalCostResult').textContent = `R$ ${totalCost.toFixed(2)}`;
}

function updateChart(chart, labels, data, chartLabel) {
    chart.data.labels = labels;
    chart.data.datasets = [{
        label: chartLabel,
        data: data,
        backgroundColor: ['#00a8f3', '#e83f5b', '#04d361', '#ffcd1e', '#9c27b0'],
    }];
    chart.update();
}

function updateTypesChart(data) {
    const typeCount = data.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {});
    updateChart(typesChart, Object.keys(typeCount), Object.values(typeCount), 'Tipos de Manutenção');
}

function updateStatusChart(data) {
    const statusCount = data.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
    }, {});
    updateChart(statusChart, Object.keys(statusCount), Object.values(statusCount), 'Status das Ordens');
}

function updateTopCostsChart(data) {
    const componentCosts = data.reduce((acc, item) => {
        acc[item.component] = (acc[item.component] || 0) + parseFloat(item.cost || 0);
        return acc;
    }, {});
    const sorted = Object.entries(componentCosts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    updateChart(topCostsChart, sorted.map(item => item[0]), sorted.map(item => item[1]), 'Top 5 Custos');
}

function updateFailuresTrendChart(data) {
    const failuresByMonth = data.filter(d => d.type === 'Corretiva').reduce((acc, item) => {
        if(item.date) {
            const month = new Date(item.date).toLocaleString('pt-BR', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
        }
        return acc;
    }, {});
    updateChart(failuresTrendChart, Object.keys(failuresByMonth), Object.values(failuresByMonth), 'Falhas por Período');
}

function updateCostTrendChart(data) {
    const costsByMonth = data.reduce((acc, item) => {
        if(item.date) {
            const month = new Date(item.date).toLocaleString('pt-BR', { month: 'short' });
            acc[month] = (acc[month] || 0) + parseFloat(item.cost || 0);
        }
        return acc;
    }, {});
    updateChart(costTrendChart, Object.keys(costsByMonth), Object.values(costsByMonth), 'Custo Mensal');
}

function updateTechniciansChart(data) {
    const fracasData = JSON.parse(localStorage.getItem('fracasData')) || [];
    const techCount = fracasData.reduce((acc, item) => {
        acc[item.responsible] = (acc[item.responsible] || 0) + 1;
        return acc;
    }, {});
    updateChart(techniciansChart, Object.keys(techCount), Object.values(techCount), 'Técnicos');
}


// CRUD e Funções de Persistência de Dados
function saveMaintenanceData() {
    const table = document.getElementById('maintenanceTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const data = [];
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        data.push({
            id: cells[1].querySelector('input').value,
            date: cells[2].querySelector('input').value,
            component: cells[3].querySelector('input').value,
            type: cells[4].querySelector('select').value,
            status: cells[5].querySelector('select').value,
            cost: cells[6].querySelector('input').value,
            duration: cells[7].querySelector('input').value,
        });
    }
    localStorage.setItem('maintenanceData', JSON.stringify(data));
    allMaintenanceData = data;
    applyFilters();
}

function loadMaintenanceData() {
    const data = JSON.parse(localStorage.getItem('maintenanceData'));
    if (data) {
        allMaintenanceData = data;
    } else {
        // Se não houver dados, pegue os da tabela HTML como padrão
        const table = document.getElementById('maintenanceTable');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].cells;
            allMaintenanceData.push({
                id: cells[1].querySelector('input').value,
                date: cells[2].querySelector('input').value,
                component: cells[3].querySelector('input').value,
                type: cells[4].querySelector('select').value,
                status: cells[5].querySelector('select').value,
                cost: cells[6].querySelector('input').value,
                duration: cells[7].querySelector('input').value,
            });
        }
        saveMaintenanceData();
    }
}

function renderMaintenanceTable(data) {
    const tableBody = document.getElementById('maintenanceTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';
    data.forEach(item => addMaintenanceRowFromData(item));
}

function addNewRow() {
    addMaintenanceRowFromData({});
    saveMaintenanceData();
}

function deleteRow(button) {
    button.closest('tr').remove();
    saveMaintenanceData();
}

function deleteSelectedRows() {
    const checkboxes = document.querySelectorAll('#maintenanceTable .row-select:checked');
    if (checkboxes.length > 0 && confirm(`Excluir ${checkboxes.length} registro(s)?`)) {
        checkboxes.forEach(cb => cb.closest('tr').remove());
        saveMaintenanceData();
    }
}

function saveRow(button) {
    saveMaintenanceData();
    alert('Registro salvo!');
}

function addMaintenanceRowFromData(data) {
    const tableBody = document.getElementById('maintenanceTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();

    newRow.innerHTML = `
        <td><input type="checkbox" class="row-select"></td>
        <td><input type="text" class="editable-cell" value="${data.id || '#MT-NEW'}"></td>
        <td><input type="date" class="editable-cell" value="${data.date || ''}"></td>
        <td><input type="text" class="editable-cell" value="${data.component || ''}"></td>
        <td>
            <select class="editable-cell">
                <option ${data.type === 'Preventiva' ? 'selected' : ''}>Preventiva</option>
                <option ${data.type === 'Corretiva' ? 'selected' : ''}>Corretiva</option>
                <option ${data.type === 'Preditiva' ? 'selected' : ''}>Preditiva</option>
            </select>
        </td>
        <td>
            <select class="editable-cell status-select">
                <option value="completed" ${data.status === 'completed' ? 'selected' : ''}>Concluída</option>
                <option value="in-progress" ${data.status === 'in-progress' ? 'selected' : ''}>Em Andamento</option>
                <option value="overdue" ${data.status === 'overdue' ? 'selected' : ''}>Atrasada</option>
                <option value="pending" ${data.status === 'pending' ? 'selected' : ''}>Pendente</option>
            </select>
        </td>
        <td><input type="number" class="editable-cell" value="${data.cost || 0}"></td>
        <td><input type="number" class="editable-cell" value="${data.duration || 0}" step="0.25"></td>
        <td class="action-cell">
            <button class="action-btn save-btn" onclick="saveRow(this)"><i class="fas fa-save"></i></button>
            <button class="action-btn delete-btn" onclick="deleteRow(this)"><i class="fas fa-trash"></i></button>
        </td>
    `;
    applyStatusStyles();
}

function updatePartHealthStatus() {
    const rows = document.querySelectorAll('#partsTable tbody tr');
    const now = new Date();

    rows.forEach(row => {
        const nextChangeInput = row.cells[4].querySelector('input');
        const healthCell = row.cells[7]; // A 8ª coluna (índice 7) é o Status de Saúde
        if (!nextChangeInput || !healthCell) return;

        const nextChangeDate = new Date(nextChangeInput.value);
        const diffDays = (nextChangeDate - now) / (1000 * 60 * 60 * 24);

        let statusClass = 'status-healthy';
        let statusText = 'Saudável';

        if (diffDays <= 7 && diffDays > 0) {
            statusClass = 'status-attention';
            statusText = 'Atenção';
        } else if (diffDays <= 0) {
            statusClass = 'status-replace';
            statusText = 'Substituir';
        }

        healthCell.innerHTML = `<div class="health-status ${statusClass}">${statusText}</div>`;
    });
}

function loadPartsData() {
    const partsData = JSON.parse(localStorage.getItem('partsData')) || [];
    const tableBody = document.getElementById('partsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    if (partsData.length > 0) {
        partsData.forEach(addPartRowFromData);
    }
    updatePartHealthStatus();
}

function savePartsChanges() {
    savePartsData();
    alert('Alterações salvas!');
}

function addPartRowFromData(data) {
    const tableBody = document.getElementById('partsTable').getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
        <td><input type="checkbox" class="part-select"></td>
        <td><input type="text" class="editable-cell" value="${data.part || ''}"></td>
        <td><input type="number" class="editable-cell" value="${data.stock || 0}" min="0"></td>
        <td><input type="number" class="editable-cell" value="${data.minStock || 0}" min="0"></td>
        <td><input type="date" class="editable-cell" value="${data.nextChange || ''}"></td>
        <td><input type="text" class="editable-cell" value="${data.avgTime || '30 dias'}"></td>
        <td><input type="number" class="editable-cell" value="${data.cost || 0}" min="0"></td>
        <td><div class="health-status"></div></td>
        <td class="action-cell">
            <button class="action-btn save-btn" onclick="savePartRow(this)"><i class="fas fa-save"></i></button>
            <button class="action-btn delete-btn" onclick="deletePartRow(this)"><i class="fas fa-trash"></i></button>
        </td>
    `;
}

// Funções para as outras tabelas (Peças, FRACAS) - mantidas para integridade
function savePartsData() {
    const rows = document.querySelectorAll('#partsTable tbody tr');
    const data = Array.from(rows).map(row => ({
        part: row.cells[1].querySelector('input').value,
        stock: row.cells[2].querySelector('input').value,
        minStock: row.cells[3].querySelector('input').value,
        nextChange: row.cells[4].querySelector('input').value,
        avgTime: row.cells[5].querySelector('input').value,
        cost: row.cells[6].querySelector('input').value,
    }));
    localStorage.setItem('partsData', JSON.stringify(data));
    updatePartHealthStatus();
    updatePredictiveAlerts();
    checkStockAlert();
}
function saveFracasData() { /* ... */ }
function loadFracasData() { /* ... */ }
function addNewPartRow() {
    addPartRowFromData({});
    savePartsData();
}
function deletePartRow(button) {
    button.closest('tr').remove();
    savePartsData();
}
function savePartRow(button) {
    savePartsData();
    alert('Peça salva!');
}
function addNewFracasRow() { /* ... */ }
function deleteFracasRow(button) { /* ... */ }
function saveFracasRow(button) { /* ... */ }
function recalculateMetrics() { /* ... */ }
function saveMetricsData() { /* ... */ }
function loadMetricsData() { /* ... */ }

// Inicialização
window.addEventListener('load', function() {
    initCharts();
    loadProfileData();
    loadMaintenanceData();
    loadPartsData();
    loadFracasData();
    loadMetricsData();
    applyFilters(); // Aplica os filtros iniciais (todos)

    document.querySelectorAll('.editable-cell').forEach(cell => {
        cell.addEventListener('change', saveMaintenanceData);
    });
});