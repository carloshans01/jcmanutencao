// Variáveis globais para os gráficos
let typesChart, statusChart, topCostsChart, failuresTrendChart, costTrendChart, slaChart, techniciansChart;
let editMode = false;
let currentImageSrc = "https://randomuser.me/api/portraits/men/32.jpg";

// Função para abrir/fechar abas
function openTab(tabId) {
    // Esconder todas as abas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Remover classe ativa de todas as abas
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Mostrar a aba selecionada
    document.getElementById(tabId).classList.add('active');

    // Adicionar classe ativa à aba clicada
    event.currentTarget.classList.add('active');
}

// Função para abrir o modal de personalização
function openCustomizationModal() {
    document.getElementById('nameInput').value = document.getElementById('userName').textContent;
    document.getElementById('positionInput').value = document.getElementById('userPosition').textContent;
    document.getElementById('previewImage').src = currentImageSrc;
    document.getElementById('customizationModal').style.display = 'flex';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('customizationModal').style.display = 'none';
}

// Função para pré-visualizar a imagem
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

// Função para salvar as alterações do perfil
function saveProfileChanges() {
    const newName = document.getElementById('nameInput').value;
    const newPosition = document.getElementById('positionInput').value;
    const previewImage = document.getElementById('previewImage').src;

    if (newName && newPosition) {
        const profileData = {
            name: newName,
            position: newPosition,
            image: previewImage
        };
        localStorage.setItem('userProfile', JSON.stringify(profileData));

        document.getElementById('userName').textContent = newName;
        document.getElementById('userPosition').textContent = newPosition;
        document.getElementById('userImage').src = previewImage;
        currentImageSrc = previewImage;
        closeModal();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

// Função para carregar os dados do perfil
function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem('userProfile'));
    if (profileData) {
        document.getElementById('userName').textContent = profileData.name;
        document.getElementById('userPosition').textContent = profileData.position;
        document.getElementById('userImage').src = profileData.image;
        currentImageSrc = profileData.image;
    }
}

// Função para inicializar os gráficos
function initCharts() {
    // Gráfico de Tipos de Manutenção (circular)
    const typesCtx = document.getElementById('typesChart').getContext('2d');
    typesChart = new Chart(typesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Preventiva', 'Corretiva', 'Preditiva'],
            datasets: [{
                data: [3, 2, 1],
                backgroundColor: [
                    'rgba(15, 204, 69, 0.8)',
                    'rgba(233, 69, 96, 0.8)',
                    'rgba(76, 201, 240, 0.8)'
                ],
                borderColor: [
                    'rgba(15, 204, 69, 1)',
                    'rgba(233, 69, 96, 1)',
                    'rgba(76, 201, 240, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f8f9fa',
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });

    // Gráfico de Status das Ordens (circular)
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    statusChart = new Chart(statusCtx, {
        type: 'pie',
        data: {
            labels: ['Concluída', 'Em Andamento', 'Atrasada', 'Pendente'],
            datasets: [{
                data: [3, 1, 1, 0],
                backgroundColor: [
                    'rgba(15, 204, 69, 0.8)',
                    'rgba(22, 83, 126, 0.8)',
                    'rgba(233, 69, 96, 0.8)',
                    'rgba(255, 159, 28, 0.8)'
                ],
                borderColor: [
                    'rgba(15, 204, 69, 1)',
                    'rgba(22, 83, 126, 1)',
                    'rgba(233, 69, 96, 1)',
                    'rgba(255, 159, 28, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f8f9fa',
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // Gráfico de Top 5 Custos (circular)
    const topCostsCtx = document.getElementById('topCostsChart').getContext('2d');
    topCostsChart = new Chart(topCostsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Válvula Direcional', 'Sistema de Resfriamento', 'Bloco Hidráulico', 'Bomba Hidráulica', 'Mangueira Principal'],
            datasets: [{
                data: [2100, 1200, 1500, 850, 350],
                backgroundColor: [
                    'rgba(233, 69, 96, 0.8)',
                    'rgba(76, 201, 240, 0.8)',
                    'rgba(22, 83, 126, 0.8)',
                    'rgba(15, 204, 69, 0.8)',
                    'rgba(255, 159, 28, 0.8)'
                ],
                borderColor: [
                    'rgba(233, 69, 96, 1)',
                    'rgba(76, 201, 240, 1)',
                    'rgba(22, 83, 126, 1)',
                    'rgba(15, 204, 69, 1)',
                    'rgba(255, 159, 28, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f8f9fa',
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: R$${context.raw} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });

    // Gráfico de tendências de falhas - sincronizado com histórico
    updateFailuresTrendChart();

    // Gráfico de custo mensal - sincronizado com histórico
    updateCostTrendChart();

    // Gráfico de SLA - sincronizado com FRACAS
    updateSlaChart();

    // Gráfico de técnicos - sincronizado com FRACAS
    updateTechniciansChart();
}

// Função para atualizar gráfico de tendências de falhas
function updateFailuresTrendChart() {
    const table = document.getElementById('maintenanceTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    // Agrupar falhas por mês
    const failuresByMonth = {};
    for (let i = 0; i < rows.length; i++) {
        const dateInput = rows[i].cells[2].getElementsByTagName('input')[0];
        if (dateInput && dateInput.value) {
            const date = new Date(dateInput.value);
            const month = date.toLocaleString('pt-BR', { month: 'short' });
            failuresByMonth[month] = (failuresByMonth[month] || 0) + 1;
        }
    }

    // Preparar dados para o gráfico
    const months = Object.keys(failuresByMonth);
    const failureCounts = Object.values(failuresByMonth);

    if (failuresTrendChart) {
        failuresTrendChart.destroy();
    }

    const failuresTrendCtx = document.getElementById('failuresTrendChart').getContext('2d');
    failuresTrendChart = new Chart(failuresTrendCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Número de Falhas',
                data: failureCounts,
                borderColor: 'rgba(233, 69, 96, 1)',
                backgroundColor: 'rgba(233, 69, 96, 0.2)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#f8f9fa'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#adb5bd'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#adb5bd'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Função para atualizar gráfico de custo mensal
function updateCostTrendChart() {
    const table = document.getElementById('maintenanceTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    // Agrupar custos por mês
    const costsByMonth = {};
    for (let i = 0; i < rows.length; i++) {
        const dateInput = rows[i].cells[2].getElementsByTagName('input')[0];
        const costInput = rows[i].cells[6].getElementsByTagName('input')[0];
        if (dateInput && dateInput.value && costInput) {
            const date = new Date(dateInput.value);
            const month = date.toLocaleString('pt-BR', { month: 'short' });
            const cost = parseFloat(costInput.value) || 0;
            costsByMonth[month] = (costsByMonth[month] || 0) + cost;
        }
    }

    // Preparar dados para o gráfico
    const months = Object.keys(costsByMonth);
    const costValues = Object.values(costsByMonth);

    if (costTrendChart) {
        costTrendChart.destroy();
    }

    const costTrendCtx = document.getElementById('costTrendChart').getContext('2d');
    costTrendChart = new Chart(costTrendCtx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Custo Mensal (R$)',
                data: costValues,
                backgroundColor: 'rgba(15, 204, 69, 0.8)',
                borderColor: 'rgba(15, 204, 69, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#f8f9fa'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#adb5bd'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#adb5bd'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Função para atualizar gráfico de SLA
function updateSlaChart() {
    const table = document.getElementById('fracasTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    let withinSla = 0;
    let outsideSla = 0;

    // Contar registros dentro e fora do SLA
    for (let i = 0; i < rows.length; i++) {
        const timeInput = rows[i].cells[6].getElementsByTagName('input')[0];
        if (timeInput) {
            const time = parseFloat(timeInput.value) || 0;
            // SLA: tempo máximo de 4 horas para falhas corretivas
            if (time <= 4) {
                withinSla++;
            } else {
                outsideSla++;
            }
        }
    }

    if (slaChart) {
        slaChart.destroy();
    }

    const slaCtx = document.getElementById('slaChart').getContext('2d');
    slaChart = new Chart(slaCtx, {
        type: 'doughnut',
        data: {
            labels: ['Dentro do SLA', 'Fora do SLA'],
            datasets: [{
                data: [withinSla, outsideSla],
                backgroundColor: [
                    'rgba(15, 204, 69, 0.8)',
                    'rgba(233, 69, 96, 0.8)'
                ],
                borderColor: [
                    'rgba(15, 204, 69, 1)',
                    'rgba(233, 69, 96, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f8f9fa'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Função para atualizar gráfico de técnicos
function updateTechniciansChart() {
    const table = document.getElementById('fracasTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    const technicians = {};

    // Contar registros por técnico
    for (let i = 0; i < rows.length; i++) {
        const technicianInput = rows[i].cells[5].getElementsByTagName('input')[0];
        if (technicianInput) {
            const technician = technicianInput.value || 'Não especificado';
            technicians[technician] = (technicians[technician] || 0) + 1;
        }
    }

    // Preparar dados para o gráfico
    const technicianNames = Object.keys(technicians);
    const technicianCounts = Object.values(technicians);

    // Cores para os técnicos
    const colors = [
        'rgba(76, 201, 240, 0.8)',
        'rgba(22, 83, 126, 0.8)',
        'rgba(233, 69, 96, 0.8)',
        'rgba(255, 159, 28, 0.8)',
        'rgba(15, 204, 69, 0.8)'
    ];

    const backgroundColors = [];
    const borderColors = [];

    for (let i = 0; i < technicianNames.length; i++) {
        const colorIndex = i % colors.length;
        backgroundColors.push(colors[colorIndex]);
        borderColors.push(colors[colorIndex].replace('0.8', '1'));
    }

    if (techniciansChart) {
        techniciansChart.destroy();
    }

    const techniciansCtx = document.getElementById('techniciansChart').getContext('2d');
    techniciansChart = new Chart(techniciansCtx, {
        type: 'pie',
        data: {
            labels: technicianNames,
            datasets: [{
                data: technicianCounts,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f8f9fa'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Função para atualizar todos os gráficos
function updateAllCharts() {
    updateTypesChart();
    updateStatusChart();
    updateTopCostsChart();
    updateFailuresTrendChart();
    updateCostTrendChart();
    updateSlaChart();
    updateTechniciansChart();
    updateMtbfMttr();
    checkStockAlert();
}

// Função para atualizar MTBF e MTTR
function updateMtbfMttr() {
    const totalHours = parseFloat(document.getElementById('totalHoursInput').value) || 1000;
    const totalFailures = parseFloat(document.getElementById('totalFailuresInput').value) || 1;
    const repairTime = parseFloat(document.getElementById('mttrInput').value) || 12;

    // Calcular MTBF
    const mtbf = totalHours / totalFailures;
    document.getElementById('mtbfResult').textContent = mtbf + 'h';
    document.getElementById('mtbfCalculation').textContent = `${totalHours} / ${totalFailures} = ${mtbf}`;

    // Calcular MTTR
    const mttr = repairTime;
    document.getElementById('mttrResult').textContent = mttr + 'h';
    document.getElementById('mttrCalculation').textContent = `${repairTime} / ${totalFailures} = ${mttr}`;

    // Atualizar campos de input
    document.getElementById('mtbfInput').value = mtbf;
    document.getElementById('mttrInput').value = mttr;
}

// Função para verificar estoque crítico
function checkStockAlert() {
    const table = document.getElementById('partsTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const lowStockItems = [];

    for (let i = 0; i < rows.length; i++) {
        const currentInput = rows[i].cells[2].getElementsByTagName('input')[0];
        const minInput = rows[i].cells[3].getElementsByTagName('input')[0];
        const partName = rows[i].cells[1].getElementsByTagName('input')[0].value;

        if (currentInput && minInput) {
            const current = parseInt(currentInput.value) || 0;
            const min = parseInt(minInput.value) || 0;

            if (current < min) {
                lowStockItems.push(partName);
                rows[i].classList.add('low-stock');
            } else {
                rows[i].classList.remove('low-stock');
            }
        }
    }

    const alertElement = document.getElementById('stockAlert');
    const alertMessage = document.getElementById('stockAlertMessage');

    if (lowStockItems.length > 0) {
        alertElement.style.display = 'flex';
        alertMessage.textContent = `Peças abaixo do nível mínimo: ${lowStockItems.join(', ')}`;
    } else {
        alertElement.style.display = 'none';
    }
}

// Função para atualizar gráfico de tipos
function updateTypesChart() {
    const table = document.getElementById('maintenanceTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const typeCount = { 'Preventiva': 0, 'Corretiva': 0, 'Preditiva': 0 };

    // Contar tipos
    for (let i = 0; i < rows.length; i++) {
        const typeSelect = rows[i].cells[4].getElementsByTagName('select')[0];
        const type = typeSelect.options[typeSelect.selectedIndex].text;
        typeCount[type] = (typeCount[type] || 0) + 1;
    }

    // Atualizar gráfico
    typesChart.data.datasets[0].data = [typeCount['Preventiva'], typeCount['Corretiva'], typeCount['Preditiva']];
    typesChart.update();
}

// Função para atualizar gráfico de status
function updateStatusChart() {
    const table = document.getElementById('maintenanceTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const statusCount = {
        'Concluída': 0,
        'Em Andamento': 0,
        'Atrasada': 0,
        'Pendente': 0
    };

    // Contar status
    for (let i = 0; i < rows.length; i++) {
        const statusSelect = rows[i].cells[5].getElementsByTagName('select')[0];
        const status = statusSelect.options[statusSelect.selectedIndex].text;
        statusCount[status] = (statusCount[status] || 0) + 1;
    }

    // Atualizar gráfico
    statusChart.data.datasets[0].data = [
        statusCount['Concluída'],
        statusCount['Em Andamento'],
        statusCount['Atrasada'],
        statusCount['Pendente']
    ];
    statusChart.update();
}

// Função para atualizar gráfico de top 5 custos
function updateTopCostsChart() {
    const table = document.getElementById('maintenanceTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const componentCosts = {};

    // Calcular custos por componente
    for (let i = 0; i < rows.length; i++) {
        const component = rows[i].cells[3].getElementsByTagName('input')[0].value;
        const cost = parseFloat(rows[i].cells[6].getElementsByTagName('input')[0].value) || 0;
        componentCosts[component] = (componentCosts[component] || 0) + cost;
    }

    // Ordenar por custo e pegar os top 5
    const sortedComponents = Object.entries(componentCosts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Preparar dados para o gráfico
    const labels = sortedComponents.map(item => item[0]);
    const data = sortedComponents.map(item => item[1]);

    // Atualizar gráfico
    topCostsChart.data.labels = labels;
    topCostsChart.data.datasets[0].data = data;

    // Gerar cores dinamicamente
    const backgroundColors = [];
    const borderColors = [];
    const colors = [
        'rgba(233, 69, 96, 0.8)',
        'rgba(76, 201, 240, 0.8)',
        'rgba(22, 83, 126, 0.8)',
        'rgba(15, 204, 69, 0.8)',
        'rgba(255, 159, 28, 0.8)'
    ];

    for (let i = 0; i < labels.length; i++) {
        const colorIndex = i % colors.length;
        backgroundColors.push(colors[colorIndex].replace('0.8', '0.8'));
        borderColors.push(colors[colorIndex].replace('0.8', '1'));
    }

    topCostsChart.data.datasets[0].backgroundColor = backgroundColors;
    topCostsChart.data.datasets[0].borderColor = borderColors;

    topCostsChart.update();
}

// Função para adicionar nova linha na tabela de manutenção
function addNewRow() {
    const table = document.getElementById('maintenanceTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td><input type="checkbox" class="row-select"></td>
        <td><input type="text" class="editable-cell" value="#MT-NEW"></td>
        <td><input type="date" class="editable-cell" value=""></td>
        <td><input type="text" class="editable-cell" value=""></td>
        <td>
            <select class="editable-cell">
                <option>Preventiva</option>
                <option>Corretiva</option>
                <option>Preditiva</option>
            </select>
        </td>
        <td>
            <select class="editable-cell status-select">
                <option value="pending">Pendente</option>
                <option value="in-progress">Em Andamento</option>
                <option value="completed">Concluída</option>
                <option value="overdue">Atrasada</option>
            </select>
        </td>
        <td><input type="number" class="editable-cell" value="0"></td>
        <td><input type="number" class="editable-cell" value="0" step="0.25"></td>
        <td class="action-cell">
            <button class="action-btn save-btn" onclick="saveRow(this)"><i class="fas fa-save"></i></button>
            <button class="action-btn cancel-btn" onclick="cancelEdit(this)"><i class="fas fa-times"></i></button>
            <button class="action-btn delete-btn" onclick="deleteRow(this)"><i class="fas fa-trash"></i></button>
        </td>
    `;

    // Aplicar estilos aos status
    applyStatusStyles();
    saveMaintenanceData();
}

// Função para excluir linha da tabela de manutenção
function deleteRow(button) {
    const row = button.closest('tr');
    row.remove();
    saveMaintenanceData();
    updateAllCharts();
}

// Função para excluir linhas selecionadas da tabela de manutenção
function deleteSelectedRows() {
    const checkboxes = document.querySelectorAll('.row-select:checked');
    if (checkboxes.length === 0) {
        alert('Selecione pelo menos uma linha para excluir.');
        return;
    }

    if (confirm(`Tem certeza que deseja excluir ${checkboxes.length} registro(s)?`)) {
        checkboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            row.remove();
        });
        saveMaintenanceData();
        updateAllCharts();
    }
}

// Função para selecionar/desselecionar todas as linhas da tabela de manutenção
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.row-select');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

// Função para salvar linha da tabela de manutenção
function saveRow(button) {
    const row = button.closest('tr');
    saveMaintenanceData();
    alert('Registro salvo com sucesso!');
    updateAllCharts();
}

// Função para cancelar edição da tabela de manutenção
function cancelEdit(button) {
    const row = button.closest('tr');
    // Aqui você poderia reverter para os valores originais
    alert('Edição cancelada.');
}

// Função para alternar modo de edição da tabela de manutenção
function toggleEditMode() {
    const table = document.getElementById('maintenanceTable');
    editMode = !editMode;

    if (editMode) {
        table.classList.add('edit-mode');
        table.classList.remove('view-mode');
    } else {
        table.classList.add('view-mode');
        table.classList.remove('edit-mode');
    }
}

// Função para salvar todas as alterações da tabela de manutenção
function saveChanges() {
    saveMaintenanceData();
    alert('Todas as alterações foram salvas!');
    updateAllCharts();
}

// Função para salvar os dados da tabela de manutenção
function saveMaintenanceData() {
    const table = document.getElementById('maintenanceTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const maintenanceData = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.cells;
        const rowData = {
            id: cells[1].getElementsByTagName('input')[0].value,
            date: cells[2].getElementsByTagName('input')[0].value,
            component: cells[3].getElementsByTagName('input')[0].value,
            type: cells[4].getElementsByTagName('select')[0].value,
            status: cells[5].getElementsByTagName('select')[0].value,
            cost: cells[6].getElementsByTagName('input')[0].value,
            duration: cells[7].getElementsByTagName('input')[0].value,
        };
        maintenanceData.push(rowData);
    }

    localStorage.setItem('maintenanceData', JSON.stringify(maintenanceData));
}

// Função para carregar os dados da tabela de manutenção
function loadMaintenanceData() {
    const maintenanceData = JSON.parse(localStorage.getItem('maintenanceData'));
    const tableBody = document.getElementById('maintenanceTable').getElementsByTagName('tbody')[0];

    if (!maintenanceData || maintenanceData.length === 0) {
        if(!localStorage.getItem('maintenanceData')){
            saveMaintenanceData();
        }
        return;
    }

    tableBody.innerHTML = ''; // Limpa a tabela antes de carregar

    const statusMapToText = {
        'completed': 'Concluída',
        'in-progress': 'Em Andamento',
        'overdue': 'Atrasada',
        'pending': 'Pendente'
    };

    maintenanceData.forEach(data => {
        addMaintenanceRowFromData([
            data.id,
            data.date,
            data.component,
            data.type,
            statusMapToText[data.status] || data.status,
            data.cost,
            data.duration
        ]);
    });
}

// Função para aplicar estilos aos status
function applyStatusStyles() {
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        updateStatusStyle(select);
        select.addEventListener('change', function() {
            updateStatusStyle(this);
            saveMaintenanceData(); // Salva ao mudar o status
        });
    });
}

// Função para atualizar estilo do status
function updateStatusStyle(select) {
    const selectedValue = select.value;
    const parentTd = select.parentElement;

    // Remover classes existentes
    parentTd.classList.remove('status-completed', 'status-in-progress', 'status-overdue', 'status-pending');

    // Adicionar classe apropriada
    switch(selectedValue) {
        case 'completed':
            parentTd.classList.add('status-completed');
            break;
        case 'in-progress':
            parentTd.classList.add('status-in-progress');
            break;
        case 'overdue':
            parentTd.classList.add('status-overdue');
            break;
        case 'pending':
            parentTd.classList.add('status-pending');
            break;
    }
}

// Função para adicionar nova linha na tabela de peças
function addNewPartRow() {
    const table = document.getElementById('partsTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td><input type="checkbox" class="part-select"></td>
        <td><input type="text" class="editable-cell" value=""></td>
        <td><input type="number" class="editable-cell" value="0" min="0"></td>
        <td><input type="number" class="editable-cell" value="0" min="0"></td>
        <td><input type="date" class="editable-cell" value=""></td>
        <td><input type="text" class="editable-cell" value="30 dias"></td>
        <td><input type="number" class="editable-cell" value="0" min="0"></td>
        <td class="action-cell">
            <button class="action-btn save-btn" onclick="savePartRow(this)"><i class="fas fa-save"></i></button>
            <button class="action-btn cancel-btn" onclick="cancelPartEdit(this)"><i class="fas fa-times"></i></button>
            <button class="action-btn delete-btn" onclick="deletePartRow(this)"><i class="fas fa-trash"></i></button>
        </td>
    `;
    savePartsData();
}

// Função para excluir linha da tabela de peças
function deletePartRow(button) {
    const row = button.closest('tr');
    row.remove();
    savePartsData();
    checkStockAlert();
}

// Função para excluir linhas selecionadas da tabela de peças
function deleteSelectedParts() {
    const checkboxes = document.querySelectorAll('.part-select:checked');
    if (checkboxes.length === 0) {
        alert('Selecione pelo menos uma peça para excluir.');
        return;
    }

    if (confirm(`Tem certeza que deseja excluir ${checkboxes.length} peça(s)?`)) {
        checkboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            row.remove();
        });
        savePartsData();
        checkStockAlert();
    }
}

// Função para selecionar/desselecionar todas as linhas da tabela de peças
function toggleSelectAllParts() {
    const selectAll = document.getElementById('selectAllParts');
    const checkboxes = document.querySelectorAll('.part-select');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

// Função para salvar linha da tabela de peças
function savePartRow(button) {
    const row = button.closest('tr');
    savePartsData();
    alert('Peça salva com sucesso!');
    checkStockAlert();
}

// Função para cancelar edição da tabela de peças
function cancelPartEdit(button) {
    const row = button.closest('tr');
    // Aqui você poderia reverter para os valores originais
    alert('Edição cancelada.');
}

// Função para salvar todas as alterações da tabela de peças
function savePartsChanges() {
    savePartsData();
    alert('Todas as alterações foram salvas!');
    checkStockAlert();
}

// Função para salvar os dados da tabela de peças
function savePartsData() {
    const table = document.getElementById('partsTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const partsData = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.cells;
        const rowData = {
            part: cells[1].getElementsByTagName('input')[0].value,
            stock: cells[2].getElementsByTagName('input')[0].value,
            minStock: cells[3].getElementsByTagName('input')[0].value,
            nextChange: cells[4].getElementsByTagName('input')[0].value,
            avgTime: cells[5].getElementsByTagName('input')[0].value,
            cost: cells[6].getElementsByTagName('input')[0].value,
        };
        partsData.push(rowData);
    }

    localStorage.setItem('partsData', JSON.stringify(partsData));
}

// Função para carregar os dados da tabela de peças
function loadPartsData() {
    const partsData = JSON.parse(localStorage.getItem('partsData'));
    const tableBody = document.getElementById('partsTable').getElementsByTagName('tbody')[0];

    if (!partsData || partsData.length === 0) {
        if(!localStorage.getItem('partsData')){
            savePartsData();
        }
        return;
    }

    tableBody.innerHTML = '';

    partsData.forEach(data => {
        addPartRowFromData([
            data.part,
            data.stock,
            data.minStock,
            data.nextChange,
            data.avgTime,
            data.cost
        ]);
    });
}

// Função para adicionar nova linha na tabela FRACAS
function addNewFracasRow() {
    const table = document.getElementById('fracasTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td><input type="checkbox" class="fracas-select"></td>
        <td><input type="datetime-local" class="editable-cell" value=""></td>
        <td><input type="text" class="editable-cell" value=""></td>
        <td><input type="text" class="editable-cell" value=""></td>
        <td><input type="text" class="editable-cell" value=""></td>
        <td><input type="text" class="editable-cell" value=""></td>
        <td><input type="number" class="editable-cell" value="0" step="0.1"></td>
        <td class="action-cell">
            <button class="action-btn save-btn" onclick="saveFracasRow(this)"><i class="fas fa-save"></i></button>
            <button class="action-btn cancel-btn" onclick="cancelFracasEdit(this)"><i class="fas fa-times"></i></button>
            <button class="action-btn delete-btn" onclick="deleteFracasRow(this)"><i class="fas fa-trash"></i></button>
        </td>
    `;
    saveFracasData();
}

// Função para excluir linha da tabela FRACAS
function deleteFracasRow(button) {
    const row = button.closest('tr');
    row.remove();
    saveFracasData();
    updateSlaChart();
    updateTechniciansChart();
}

// Função para excluir linhas selecionadas da tabela FRACAS
function deleteSelectedFracas() {
    const checkboxes = document.querySelectorAll('.fracas-select:checked');
    if (checkboxes.length === 0) {
        alert('Selecione pelo menos uma falha para excluir.');
        return;
    }

    if (confirm(`Tem certeza que deseja excluir ${checkboxes.length} falha(s)?`)) {
        checkboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            row.remove();
        });
        saveFracasData();
        updateSlaChart();
        updateTechniciansChart();
    }
}

// Função para selecionar/desselecionar todas as linhas da tabela FRACAS
function toggleSelectAllFracas() {
    const selectAll = document.getElementById('selectAllFracas');
    const checkboxes = document.querySelectorAll('.fracas-select');

    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

// Função para salvar linha da tabela FRACAS
function saveFracasRow(button) {
    const row = button.closest('tr');
    saveFracasData();
    alert('Falha salva com sucesso!');
    updateSlaChart();
    updateTechniciansChart();
}

// Função para cancelar edição da tabela FRACAS
function cancelFracasEdit(button) {
    const row = button.closest('tr');
    // Aqui você poderia reverter para os valores originais
    alert('Edição cancelada.');
}

// Função para salvar todas as alterações da tabela FRACAS
function saveFracasChanges() {
    saveFracasData();
    alert('Todas as alterações foram salvas!');
    updateSlaChart();
    updateTechniciansChart();
}

// Função para salvar os dados da tabela FRACAS
function saveFracasData() {
    const table = document.getElementById('fracasTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    const fracasData = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.cells;
        const rowData = {
            dateTime: cells[1].getElementsByTagName('input')[0].value,
            symptom: cells[2].getElementsByTagName('input')[0].value,
            cause: cells[3].getElementsByTagName('input')[0].value,
            action: cells[4].getElementsByTagName('input')[0].value,
            responsible: cells[5].getElementsByTagName('input')[0].value,
            solutionTime: cells[6].getElementsByTagName('input')[0].value,
        };
        fracasData.push(rowData);
    }

    localStorage.setItem('fracasData', JSON.stringify(fracasData));
}

// Função para carregar os dados da tabela FRACAS
function loadFracasData() {
    const fracasData = JSON.parse(localStorage.getItem('fracasData'));
    const tableBody = document.getElementById('fracasTable').getElementsByTagName('tbody')[0];

    if (!fracasData || fracasData.length === 0) {
        if(!localStorage.getItem('fracasData')){
            saveFracasData();
        }
        return;
    }

    tableBody.innerHTML = '';

    fracasData.forEach(data => {
        addFracasRowFromData([
            data.dateTime,
            data.symptom,
            data.cause,
            data.action,
            data.responsible,
            data.solutionTime
        ]);
    });
}

// Função para salvar os dados das métricas
function saveMetricsData() {
    const metricsData = {
        totalHours: document.getElementById('totalHoursInput').value,
        totalFailures: document.getElementById('totalFailuresInput').value,
        mtbf: document.getElementById('mtbfInput').value,
        mttr: document.getElementById('mttrInput').value,
        maintenanceCost: document.getElementById('maintenanceCostInput').value,
        assetValue: document.getElementById('assetValueInput').value,
        preventiveCount: document.getElementById('preventiveCountInput').value,
        correctiveCount: document.getElementById('correctiveCountInput').value,
    };
    localStorage.setItem('metricsData', JSON.stringify(metricsData));
}

// Função para carregar os dados das métricas
function loadMetricsData() {
    const metricsData = JSON.parse(localStorage.getItem('metricsData'));
    if (metricsData) {
        document.getElementById('totalHoursInput').value = metricsData.totalHours;
        document.getElementById('totalFailuresInput').value = metricsData.totalFailures;
        document.getElementById('mtbfInput').value = metricsData.mtbf;
        document.getElementById('mttrInput').value = metricsData.mttr;
        document.getElementById('maintenanceCostInput').value = metricsData.maintenanceCost;
        document.getElementById('assetValueInput').value = metricsData.assetValue;
        document.getElementById('preventiveCountInput').value = metricsData.preventiveCount;
        document.getElementById('correctiveCountInput').value = metricsData.correctiveCount;
    }
    recalculateMetrics(); // Recalcula com os dados carregados
}

// Função para recalcular métricas com base nos inputs do usuário
function recalculateMetrics() {
    const totalHours = parseFloat(document.getElementById('totalHoursInput').value);
    const totalFailures = parseFloat(document.getElementById('totalFailuresInput').value);
    const mtbf = parseFloat(document.getElementById('mtbfInput').value);
    const mttr = parseFloat(document.getElementById('mttrInput').value);
    const maintenanceCost = parseFloat(document.getElementById('maintenanceCostInput').value);
    const assetValue = parseFloat(document.getElementById('assetValueInput').value);
    const preventiveCount = parseFloat(document.getElementById('preventiveCountInput').value);
    const correctiveCount = parseFloat(document.getElementById('correctiveCountInput').value);
    const totalOrders = preventiveCount + correctiveCount;

    // Calcula disponibilidade
    const availability = (mtbf / (mtbf + mttr)) * 100;
    document.getElementById('availabilityResult').textContent = availability.toFixed(2) + '%';
    document.getElementById('availabilityCalculation').textContent = `${mtbf} / (${mtbf} + ${mttr}) × 100`;

    // Calcula confiabilidade
    const reliability = Math.exp(-50 / mtbf) * 100;
    document.getElementById('reliabilityResult').textContent = reliability.toFixed(2) + '%';
    document.getElementById('reliabilityCalculation').textContent = `e^(-50/${mtbf}) × 100`;

    // Calcula MTBF
    const calculatedMTBF = totalHours / totalFailures;
    document.getElementById('mtbfResult').textContent = calculatedMTBF + 'h';
    document.getElementById('mtbfCalculation').textContent = `${totalHours} / ${totalFailures} = ${calculatedMTBF}`;

    // Calcula MTTR
    const calculatedMTTR = mttr;
    document.getElementById('mttrResult').textContent = calculatedMTTR + 'h';
    document.getElementById('mttrCalculation').textContent = `${mttr} / ${totalFailures} = ${calculatedMTTR}`;

    // Calcula CPMV
    const cpmv = (maintenanceCost / assetValue) * 100;
    document.getElementById('cpmvResult').textContent = cpmv.toFixed(2) + '%';
    document.getElementById('cpmvCalculation').textContent = `(${maintenanceCost} / ${assetValue}) × 100`;

    // Calcula Preventiva vs Corretiva
    const preventiveRatio = (preventiveCount / totalOrders) * 100;
    document.getElementById('preventiveResult').textContent = preventiveRatio.toFixed(0) + '%';
    document.getElementById('preventiveCalculation').textContent = `(${preventiveCount} / ${totalOrders}) × 100`;

    saveMetricsData();
    updateAllCharts();
}

// Função para exportar dados de peças para Excel
function exportPartsToExcel() {
    const table = document.getElementById('partsTable');
    const wb = XLSX.utils.book_new();

    // Criar array com os dados da tabela
    const data = [];
    const headers = [];

    // Pegar cabeçalhos
    const headerRow = table.querySelector('thead tr');
    const headerCells = headerRow.querySelectorAll('th');
    headerCells.forEach((cell, index) => {
        if (index !== 0 && index !== headerCells.length - 1) { // Ignorar checkbox e ações
            headers.push(cell.textContent.trim());
        }
    });
    data.push(headers);

    // Pegar dados das linhas
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('td');

        cells.forEach((cell, index) => {
            if (index !== 0 && index !== cells.length - 1) { // Ignorar checkbox e ações
                const input = cell.querySelector('input, select');
                if (input) {
                    if (input.type === 'date') {
                        rowData.push(input.value);
                    } else if (input.tagName === 'SELECT') {
                        rowData.push(input.options[input.selectedIndex].text);
                    } else {
                        rowData.push(input.value);
                    }
                } else {
                    rowData.push(cell.textContent.trim());
                }
            }
        });

        if (rowData.length > 0) {
            data.push(rowData);
        }
    });

    // Criar worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Inventario_Pecas");

    // Exportar arquivo
    XLSX.writeFile(wb, "inventario_pecas.xlsx");
}

// Função para importar dados de peças do Excel
function importPartsFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Pegar a primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
            alert('O arquivo Excel está vazio ou não contém dados.');
            return;
        }

        // Confirmar importação
        if (!confirm(`Deseja importar ${jsonData.length - 1} registros do arquivo Excel? Isso substituirá os dados atuais.`)) {
            return;
        }

        // Limpar tabela atual
        const tbody = document.querySelector('#partsTable tbody');
        tbody.innerHTML = '';

        // Adicionar novos dados (ignorar cabeçalho)
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.length >= 7) { // Verificar se a linha tem dados suficientes
                addPartRowFromData(row);
            }
        }

        checkStockAlert();
        alert('Dados importados com sucesso!');
    };

    reader.readAsArrayBuffer(file);
}

// Função para adicionar linha de peça com dados importados
function addPartRowFromData(data) {
    const table = document.getElementById('partsTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td><input type="checkbox" class="part-select"></td>
        <td><input type="text" class="editable-cell" value="${data[0] || ''}"></td>
        <td><input type="number" class="editable-cell" value="${data[1] || 0}" min="0"></td>
        <td><input type="number" class="editable-cell" value="${data[2] || 0}" min="0"></td>
        <td><input type="date" class="editable-cell" value="${data[3] || ''}"></td>
        <td><input type="text" class="editable-cell" value="${data[4] || ''}"></td>
        <td><input type="number" class="editable-cell" value="${data[5] || 0}" min="0"></td>
        <td class="action-cell">
            <button class="action-btn save-btn" onclick="savePartRow(this)"><i class="fas fa-save"></i></button>
            <button class="action-btn cancel-btn" onclick="cancelPartEdit(this)"><i class="fas fa-times"></i></button>
            <button class="action-btn delete-btn" onclick="deletePartRow(this)"><i class="fas fa-trash"></i></button>
        </td>
    `;
}

// Função para exportar dados de manutenção para Excel
function exportMaintenanceToExcel() {
    const table = document.getElementById('maintenanceTable');
    const wb = XLSX.utils.book_new();

    // Criar array com os dados da tabela
    const data = [];
    const headers = [];

    // Pegar cabeçalhos
    const headerRow = table.querySelector('thead tr');
    const headerCells = headerRow.querySelectorAll('th');
    headerCells.forEach((cell, index) => {
        if (index !== 0 && index !== headerCells.length - 1) { // Ignorar checkbox e ações
            headers.push(cell.textContent.trim());
        }
    });
    data.push(headers);

    // Pegar dados das linhas
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('td');

        cells.forEach((cell, index) => {
            if (index !== 0 && index !== cells.length - 1) { // Ignorar checkbox e ações
                const input = cell.querySelector('input, select');
                if (input) {
                    if (input.type === 'date') {
                        rowData.push(input.value);
                    } else if (input.tagName === 'SELECT') {
                        rowData.push(input.options[input.selectedIndex].text);
                    } else {
                        rowData.push(input.value);
                    }
                } else {
                    rowData.push(cell.textContent.trim());
                }
            }
        });

        if (rowData.length > 0) {
            data.push(rowData);
        }
    });

    // Criar worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Historico_Manutencao");

    // Exportar arquivo
    XLSX.writeFile(wb, "historico_manutencao.xlsx");
}

// Função para importar dados de manutenção do Excel
function importMaintenanceFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Pegar a primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
            alert('O arquivo Excel está vazio ou não contém dados.');
            return;
        }

        // Confirmar importação
        if (!confirm(`Deseja importar ${jsonData.length - 1} registros do arquivo Excel? Isso substituirá os dados atuais.`)) {
            return;
        }

        // Limpar tabela atual
        const tbody = document.querySelector('#maintenanceTable tbody');
        tbody.innerHTML = '';

        // Adicionar novos dados (ignorar cabeçalho)
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.length >= 7) { // Corrigido de 8 para 7
                addMaintenanceRowFromData(row);
            }
        }

        saveMaintenanceData();
        updateAllCharts();
        alert('Dados importados com sucesso!');
    };

    reader.readAsArrayBuffer(file);
}

// Função para adicionar linha de manutenção com dados importados
function addMaintenanceRowFromData(data) {
    const table = document.getElementById('maintenanceTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    // Mapear status para valores
    const statusMap = {
        'Concluída': 'completed',
        'Em Andamento': 'in-progress',
        'Atrasada': 'overdue',
        'Pendente': 'pending'
    };
    const statusValue = statusMap[data[4]] || 'pending';

    // Mapear tipo para valores
    const typeMap = {
        'Preventiva': 'Preventiva',
        'Corretiva': 'Corretiva',
        'Preditiva': 'Preditiva'
    };
    const typeValue = typeMap[data[3]] || 'Preventiva';

    newRow.innerHTML = `
        <td><input type="checkbox" class="row-select"></td>
        <td><input type="text" class="editable-cell" value="${data[0] || ''}"></td>
        <td><input type="date" class="editable-cell" value="${data[1] || ''}"></td>
        <td><input type="text" class="editable-cell" value="${data[2] || ''}"></td>
        <td>
            <select class="editable-cell">
                <option ${typeValue === 'Preventiva' ? 'selected' : ''}>Preventiva</option>
                <option ${typeValue === 'Corretiva' ? 'selected' : ''}>Corretiva</option>
                <option ${typeValue === 'Preditiva' ? 'selected' : ''}>Preditiva</option>
            </select>
        </td>
        <td>
            <select class="editable-cell status-select">
                <option value="completed" ${statusValue === 'completed' ? 'selected' : ''}>Concluída</option>
                <option value="in-progress" ${statusValue === 'in-progress' ? 'selected' : ''}>Em Andamento</option>
                <option value="overdue" ${statusValue === 'overdue' ? 'selected' : ''}>Atrasada</option>
                <option value="pending" ${statusValue === 'pending' ? 'selected' : ''}>Pendente</option>
            </select>
        </td>
        <td><input type="number" class="editable-cell" value="${data[5] || 0}"></td>
        <td><input type="number" class="editable-cell" value="${data[6] || 0}" step="0.25"></td>
        <td class="action-cell">
            <button class="action-btn save-btn" onclick="saveRow(this)"><i class="fas fa-save"></i></button>
            <button class="action-btn cancel-btn" onclick="cancelEdit(this)"><i class="fas fa-times"></i></button>
            <button class="action-btn delete-btn" onclick="deleteRow(this)"><i class="fas fa-trash"></i></button>
        </td>
    `;

    // Aplicar estilos aos status
    applyStatusStyles();
}

// Função para exportar dados FRACAS para Excel
function exportFracasToExcel() {
    const table = document.getElementById('fracasTable');
    const wb = XLSX.utils.book_new();

    // Criar array com os dados da tabela
    const data = [];
    const headers = [];

    // Pegar cabeçalhos
    const headerRow = table.querySelector('thead tr');
    const headerCells = headerRow.querySelectorAll('th');
    headerCells.forEach((cell, index) => {
        if (index !== 0 && index !== headerCells.length - 1) { // Ignorar checkbox e ações
            headers.push(cell.textContent.trim());
        }
    });
    data.push(headers);

    // Pegar dados das linhas
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('td');

        cells.forEach((cell, index) => {
            if (index !== 0 && index !== cells.length - 1) { // Ignorar checkbox e ações
                const input = cell.querySelector('input, select');
                if (input) {
                    if (input.type === 'datetime-local') {
                        rowData.push(input.value);
                    } else if (input.tagName === 'SELECT') {
                        rowData.push(input.options[input.selectedIndex].text);
                    } else {
                        rowData.push(input.value);
                    }
                } else {
                    rowData.push(cell.textContent.trim());
                }
            }
        });

        if (rowData.length > 0) {
            data.push(rowData);
        }
    });

    // Criar worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Registro_Falhas");

    // Exportar arquivo
    XLSX.writeFile(wb, "registro_falhas.xlsx");
}

// Função para importar dados FRACAS do Excel
function importFracasFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Pegar a primeira planilha
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Converter para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
            alert('O arquivo Excel está vazio ou não contém dados.');
            return;
        }

        // Confirmar importação
        if (!confirm(`Deseja importar ${jsonData.length - 1} registros do arquivo Excel? Isso substituirá os dados atuais.`)) {
            return;
        }

        // Limpar tabela atual
        const tbody = document.querySelector('#fracasTable tbody');
        tbody.innerHTML = '';

        // Adicionar novos dados (ignorar cabeçalho)
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row.length >= 7) { // Verificar se a linha tem dados suficientes
                addFracasRowFromData(row);
            }
        }

        saveFracasData();
        updateSlaChart();
        updateTechniciansChart();
        alert('Dados importados com sucesso!');
    };

    reader.readAsArrayBuffer(file);
}

// Função para adicionar linha FRACAS com dados importados
function addFracasRowFromData(data) {
    const table = document.getElementById('fracasTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td><input type="checkbox" class="fracas-select"></td>
        <td><input type="datetime-local" class="editable-cell" value="${data[0] || ''}"></td>
        <td><input type="text" class="editable-cell" value="${data[1] || ''}"></td>
        <td><input type="text" class="editable-cell" value="${data[2] || ''}"></td>
        <td><input type="text" class="editable-cell" value="${data[3] || ''}"></td>
        <td><input type="text" class="editable-cell" value="${data[4] || ''}"></td>
        <td><input type="number" class="editable-cell" value="${data[5] || 0}" step="0.1"></td>
        <td class="action-cell">
            <button class="action-btn save-btn" onclick="saveFracasRow(this)"><i class="fas fa-save"></i></button>
            <button class="action-btn cancel-btn" onclick="cancelFracasEdit(this)"><i class="fas fa-times"></i></button>
            <button class="action-btn delete-btn" onclick="deleteFracasRow(this)"><i class="fas fa-trash"></i></button>
        </td>
    `;
}

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('customizationModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Inicializa os gráficos quando a página carrega
window.addEventListener('load', function() {
    initCharts();
    loadProfileData();
    loadMetricsData();
    loadMaintenanceData();
    loadPartsData();
    loadFracasData();
    applyStatusStyles();
    checkStockAlert();
    updateAllCharts();

    // Inicializar tabela no modo de visualização
    const table = document.getElementById('maintenanceTable');
    table.classList.add('view-mode');

    // Adicionar evento de clique para personalização do perfil
    document.getElementById('userProfile').addEventListener('click', openCustomizationModal);
});