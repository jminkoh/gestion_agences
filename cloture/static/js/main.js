document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('timeForm');
    const heureDebutInput = document.getElementById('heure_debut');
    const saveReportButton = document.getElementById('saveReport');

    // === Gestion de l'heure de début avec localStorage ===
    const savedHeureDebut = localStorage.getItem('heure_debut');
    if (savedHeureDebut) {
        heureDebutInput.value = savedHeureDebut;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const heureDebut = heureDebutInput.value;
        localStorage.setItem('heure_debut', heureDebut);
        alert('Heure de début sauvegardée avec succès !');
    });

    // === Fonction pour mettre à jour les observations en fonction des checkboxes ===
    const updateObservations = (row) => {
        const balanceCheckbox = row.querySelector('.balance-checkbox');
        const journeeCheckbox = row.querySelector('.journee-checkbox');
        const observationTextarea = row.querySelector('.observation');

        const isBalanceChecked = balanceCheckbox.checked;
        const isJourneeChecked = journeeCheckbox.checked;

        if (!isBalanceChecked && !isJourneeChecked) {
            // Si aucun checkbox n'est coché
            observationTextarea.value = `La colonne Balance Équilibrée et/ou Journée Fermée n'est pas renseignée.`;
            observationTextarea.disabled = false;
        } else if (isBalanceChecked && !isJourneeChecked) {
            // Si Balance est coché, mais pas Journee
            observationTextarea.value = `La colonne Balance Équilibrée est renseignée, mais la colonne Journée Fermée n'est pas renseignée.`;
            observationTextarea.disabled = false;
        } else if (!isBalanceChecked && isJourneeChecked) {
            // Si Journée est coché, mais pas Balance
            observationTextarea.value = `La colonne Journée Fermée est renseignée, mais la colonne Balance Équilibrée n'est pas renseignée.`;
            observationTextarea.disabled = false;
        } else if (isBalanceChecked && isJourneeChecked) {
            // Si les deux checkboxes sont cochées
            observationTextarea.value = "Agence clôturée";
            observationTextarea.disabled = true;  // Griser le textarea
        }
    };

    // === Vérification au chargement de la page ===
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        updateObservations(row);  // Mettre à jour le message dès le chargement
    });

    // === Sauvegarder les données des checkboxes et textareas dans localStorage ===
    const saveFormState = () => {
        const data = [];

        rows.forEach(row => {
            const agenceId = row.getAttribute('data-agence-id');
            const balanceCheckbox = row.querySelector('.balance-checkbox');
            const journeeCheckbox = row.querySelector('.journee-checkbox');
            const observationTextarea = row.querySelector('.observation');

            data.push({
                id: agenceId,
                balance: balanceCheckbox.checked,
                journee: journeeCheckbox.checked,
                observation: observationTextarea.value,
            });
        });

        localStorage.setItem('agenceData', JSON.stringify(data));
    };

    const loadFormState = () => {
        const savedData = localStorage.getItem('agenceData');
        if (savedData) {
            const data = JSON.parse(savedData);

            data.forEach(item => {
                const row = document.querySelector(`tr[data-agence-id="${item.id}"]`);
                if (row) {
                    const balanceCheckbox = row.querySelector('.balance-checkbox');
                    const journeeCheckbox = row.querySelector('.journee-checkbox');
                    const observationTextarea = row.querySelector('.observation');

                    balanceCheckbox.checked = item.balance;
                    journeeCheckbox.checked = item.journee;
                    observationTextarea.value = item.observation;
                }
            });
        }
    };

    loadFormState();

    // === Ajouter un événement pour chaque changement dans les checkboxes et textarea ===
    document.querySelectorAll('.balance-checkbox, .journee-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const row = checkbox.closest('tr');
            updateObservations(row);  // Mettre à jour immédiatement le message

            saveFormState();  // Sauvegarder l'état du formulaire dans localStorage
        });
    });

    // === Génération du PDF ===
    saveReportButton.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'A4',
        });

        doc.setFontSize(18);
        doc.text('Rapport des Agences', 40, 40);

        const tableRows = [];
        const tableHeaders = [];

        const table = document.querySelector('table');
        const headers = table.querySelectorAll('thead th');
        const rows = table.querySelectorAll('tbody tr');

        // Récupérer les en-têtes de colonnes
        headers.forEach(header => {
            tableHeaders.push(header.textContent.trim());
        });

        // Récupérer les données des lignes
        rows.forEach(row => {
            const rowData = [];
            const cells = row.querySelectorAll('td');
            const balanceCheckbox = row.querySelector('.balance-checkbox');
            const journeeCheckbox = row.querySelector('.journee-checkbox');
            const observationTextarea = row.querySelector('.observation');

            const isBalanceChecked = balanceCheckbox.checked;
            const isJourneeChecked = journeeCheckbox.checked;

            cells.forEach(cell => {
                const checkbox = cell.querySelector('input[type="checkbox"]');
                const textarea = cell.querySelector('textarea');

                if (checkbox) {
                    rowData.push(checkbox.checked ? 'Oui' : 'Non');
                } else if (textarea) {
                    if (isBalanceChecked && isJourneeChecked) {
                        textarea.value = "Agence clôturée";  // Si les deux checkboxes sont cochées
                        textarea.disabled = true;  // Griser le textarea
                    }
                    rowData.push(textarea.value.trim());
                } else {
                    rowData.push(cell.textContent.trim());
                }
            });

            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableHeaders],
            body: tableRows,
            startY: 60,
            tableWidth: 'auto',
            margin: { left: 40, right: 40 },
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 5,
                overflow: 'linebreak',
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],
            },
            didDrawPage: function (data) {
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(10);
                doc.text(
                    `Page ${pageCount}`,
                    doc.internal.pageSize.getWidth() - 70,
                    doc.internal.pageSize.getHeight() - 30
                );
            },
        });

        doc.save('rapport_agences.pdf');
    });
});
