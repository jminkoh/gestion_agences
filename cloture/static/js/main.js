document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("timeForm");
  const heureDebutInput = document.getElementById("heure_debut");
  const saveReportButton = document.getElementById("saveReport");
  const selectAllButton = document.getElementById("selectAll");
  const deselectAllButton = document.getElementById("deselectAll");

  // === Gestion de l'heure de début avec localStorage ===
  const savedHeureDebut = localStorage.getItem("heure_debut");
  if (savedHeureDebut) {
    heureDebutInput.value = savedHeureDebut;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const heureDebut = heureDebutInput.value;
    localStorage.setItem("heure_debut", heureDebut);
    alert("Heure de début sauvegardée avec succès !");
  });

  // === Fonction pour mettre à jour les observations en fonction des checkboxes ===
  const updateObservations = (row) => {
    const balanceCheckbox = row.querySelector(".balance-checkbox");
    const journeeCheckbox = row.querySelector(".journee-checkbox");
    const observationTextarea = row.querySelector(".observation");

    const isBalanceChecked = balanceCheckbox.checked;
    const isJourneeChecked = journeeCheckbox.checked;

    // === Mise à jour de observation ===
    if (!isBalanceChecked && !isJourneeChecked) {
      observationTextarea.value = `La colonne Balance Équilibrée et/ou Journée Fermée n'est pas renseignée.`;
      observationTextarea.disabled = false;
    } else if (isBalanceChecked && !isJourneeChecked) {
      observationTextarea.value = `La colonne Balance Équilibrée est renseignée, mais la colonne Journée Fermée n'est pas renseignée.`;
      observationTextarea.disabled = false;
    } else if (!isBalanceChecked && isJourneeChecked) {
      observationTextarea.value = `La colonne Journée Fermée est renseignée, mais la colonne Balance Équilibrée n'est pas renseignée.`;
      observationTextarea.disabled = false;
    } else if (isBalanceChecked && isJourneeChecked) {
      observationTextarea.value = "Agence clôturée";
      observationTextarea.disabled = true; // Griser le textarea
    }

    // Observation Simplex : Pas de modification ici
    // observationSimplexTextarea.value reste inchangé
  };

  // === Vérification au chargement de la page ===
  const rows = document.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    updateObservations(row); // Mettre à jour les messages dès le chargement
  });

  // === Sauvegarder les données des checkboxes et textareas dans localStorage ===
  const saveFormState = () => {
    const data = [];

    rows.forEach((row) => {
      const agenceId = row.getAttribute("data-agence-id");
      const balanceCheckbox = row.querySelector(".balance-checkbox");
      const journeeCheckbox = row.querySelector(".journee-checkbox");
      const observationTextarea = row.querySelector(".observation");
      const observationSimplexTextarea = row.querySelector(
        ".observation-simplex"
      );

      data.push({
        id: agenceId,
        balance: balanceCheckbox.checked,
        journee: journeeCheckbox.checked,
        observation: observationTextarea.value,
        observation_simplex: observationSimplexTextarea.value, // Sauvegarder observation_simplex
      });
    });

    localStorage.setItem("agenceData", JSON.stringify(data));
  };

  const loadFormState = () => {
    const savedData = localStorage.getItem("agenceData");
    if (savedData) {
      const data = JSON.parse(savedData);

      data.forEach((item) => {
        const row = document.querySelector(`tr[data-agence-id="${item.id}"]`);
        if (row) {
          const balanceCheckbox = row.querySelector(".balance-checkbox");
          const journeeCheckbox = row.querySelector(".journee-checkbox");
          const observationTextarea = row.querySelector(".observation");
          const observationSimplexTextarea = row.querySelector(
            ".observation-simplex"
          );

          balanceCheckbox.checked = item.balance;
          journeeCheckbox.checked = item.journee;
          observationTextarea.value = item.observation;

          // === Observation Simplex ===
          observationSimplexTextarea.value =
            item.observation_simplex === undefined ||
            item.observation_simplex === null
              ? ""
              : item.observation_simplex;
        }
      });
    }
  };

  loadFormState(); // Charger l'état sauvegardé au démarrage

  // === Ajouter un événement pour chaque changement dans les checkboxes et textarea ===
  document
    .querySelectorAll(".balance-checkbox, .journee-checkbox")
    .forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const row = checkbox.closest("tr");
        updateObservations(row); // Mettre à jour immédiatement le message

        saveFormState(); // Sauvegarder l'état du formulaire dans localStorage
      });
    });

  // Ajouter un événement pour chaque changement dans les champs textarea
  document
    .querySelectorAll(".observation, .observation-simplex")
    .forEach((textarea) => {
      textarea.addEventListener("input", function () {
        saveFormState(); // Sauvegarder l'état du formulaire dans localStorage chaque fois qu'il y a une saisie
      });
    });

  // === Génération du PDF ===
  saveReportButton.addEventListener("click", function () {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });

    doc.setFontSize(18);
    doc.text("Rapport des Agences", 40, 40);

    const heureDebut = document.getElementById("heure_debut").value;
    const heureGeneration = new Date().toLocaleString();

    doc.setFontSize(10);
    doc.text(`Heure de Début: ${heureDebut}`, 40, 60);
    doc.text(`Heure de Fin: ${heureGeneration}`, 400, 60);

    const tableRows = [];
    const tableHeaders = [];

    const table = document.querySelector("table");
    const headers = table.querySelectorAll("thead th");
    const rows = table.querySelectorAll("tbody tr");

    headers.forEach((header) => {
      tableHeaders.push(header.textContent.trim());
    });

    rows.forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("td");
      const balanceCheckbox = row.querySelector(".balance-checkbox");
      const journeeCheckbox = row.querySelector(".journee-checkbox");
      const observationTextarea = row.querySelector(".observation");
      const observationSimplexTextarea = row.querySelector(
        ".observation-simplex"
      );

      const isBalanceChecked = balanceCheckbox.checked;
      const isJourneeChecked = journeeCheckbox.checked;

      cells.forEach((cell) => {
        const checkbox = cell.querySelector('input[type="checkbox"]');
        const textarea = cell.querySelector("textarea");

        if (checkbox) {
          rowData.push(checkbox.checked ? "Oui" : "Non");
        } else if (textarea) {
          if (isBalanceChecked && isJourneeChecked) {
            textarea.value = "Agence clôturée"; // Si les deux checkboxes sont cochées
            textarea.disabled = true; // Griser le textarea
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
      startY: 80,
      tableWidth: "auto",
      margin: { left: 40, right: 40 },
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 5,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
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

    // Convertir le PDF en base64
    const pdfBase64 = doc.output("datauristring");

    // Envoi du PDF au serveur via une requête POST
    fetch("/save_report/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
          .value,
      },
      body: JSON.stringify({
        pdf: pdfBase64,
        heure_debut: heureDebut,
        heure_generation: heureGeneration,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Rapport enregistré avec succès!");
        doc.save("rapport_agences.pdf"); // Sauvegarder localement également
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  });

  // === Sélectionner/Désélectionner toutes les checkboxes ===
  selectAllButton.addEventListener("click", () => {
    document
      .querySelectorAll(".balance-checkbox, .journee-checkbox")
      .forEach((checkbox) => {
        checkbox.checked = true;
        const row = checkbox.closest("tr");
        updateObservations(row);
      });
    saveFormState(); // Sauvegarder l'état du formulaire
  });

  deselectAllButton.addEventListener("click", () => {
    document
      .querySelectorAll(".balance-checkbox, .journee-checkbox")
      .forEach((checkbox) => {
        checkbox.checked = false;
        const row = checkbox.closest("tr");
        updateObservations(row);
      });
    saveFormState(); // Sauvegarder l'état du formulaire
  });
});
