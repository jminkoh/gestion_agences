document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("timeForm");
  const heureDebutInput = document.getElementById("heure_debut");
  const saveReportButton = document.getElementById("saveReport");
  const closePeriodButton = document.getElementById("closePeriod"); // Bouton de clôture

  // === Chargement et sauvegarde de l'heure de début ===
  const savedHeureDebut = localStorage.getItem("heure_debut");
  if (savedHeureDebut) heureDebutInput.value = savedHeureDebut;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("heure_debut", heureDebutInput.value);
    alert("Heure de début sauvegardée avec succès !");
  });

  // === Désactiver la modification de la date après clôture ===
  if (localStorage.getItem("periode_cloturee") === "true") {
    heureDebutInput.disabled = true;
  }

  // === Clôture de la période ===
  closePeriodButton.addEventListener("click", () => {
    localStorage.setItem("periode_cloturee", "true");
    heureDebutInput.disabled = true;
    alert("Période clôturée avec succès !");
    generateStatistics();
  });

  // === Générer les statistiques et l'histogramme ===
  function generateStatistics() {
    const data = JSON.parse(localStorage.getItem("agenceData") || "[]");
    let totalAgences = data.length;
    let totalClotures = data.filter(
      (item) => item.balance && item.journee
    ).length;

    console.log(
      `Total agences: ${totalAgences}, Agences clôturées: ${totalClotures}`
    );
    alert(
      `Statistiques générées ! Total agences: ${totalAgences}, Clôturées: ${totalClotures}`
    );
    // Ici, on pourrait intégrer une bibliothèque de graphes pour afficher l'histogramme
  }

  // === Génération et sauvegarde du PDF ===
  saveReportButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "A4",
    });

    const heureDebut = heureDebutInput.value;
    const heureGeneration = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text("Rapport des Agences", 40, 40);
    doc.setFontSize(10);
    doc.text(`Heure de Début: ${heureDebut}`, 40, 60);
    doc.text(`Heure de Fin: ${heureGeneration}`, 400, 60);

    const headers = [
      [
        "Agence",
        "Journée Fermée",
        "Observation",
        "Comptabilisation",
        "Journée Fermée",
      ],
    ];
    const rows = [];

    document.querySelectorAll("tbody tr").forEach((row) => {
      const rowData = [];
      const cells = row.querySelectorAll("td");
      cells.forEach((cell) => {
        const checkbox = cell.querySelector('input[type="checkbox"]');
        const textarea = cell.querySelector("textarea");
        rowData.push(
          checkbox
            ? checkbox.checked
              ? "Oui"
              : "Non"
            : textarea
            ? textarea.value.trim()
            : cell.textContent.trim()
        );
      });
      rows.push(rowData);
    });

    doc.autoTable({ head: headers, body: rows, startY: 80, theme: "grid" });
    doc.save("rapport_agences.pdf");
    location.reload();
  });
});
