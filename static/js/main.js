document.addEventListener("DOMContentLoaded", function () {
// Charger l'état des cases à cocher et des boutons "Clôturer"
var checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(function (checkbox) {
    var id = checkbox.getAttribute("data-id");
    var checked = localStorage.getItem(id) === "true";
    checkbox.checked = checked;
});

// Charger les valeurs des textarea depuis localStorage
var textareas = document.querySelectorAll('textarea');
textareas.forEach(function (textarea) {
    var id = textarea.getAttribute("data-id");
    var savedText = localStorage.getItem(id);
    if (savedText !== null) {
    textarea.value = savedText;
    }
});

// Sauvegarder l'état des cases à cocher et des textarea
checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
    var id = checkbox.getAttribute("data-id");
    localStorage.setItem(id, checkbox.checked);
    updateCloturerButton(checkbox.closest("tr")); // Mettre à jour le bouton "Clôturer"
    });
});

textareas.forEach(function (textarea) {
    textarea.addEventListener("input", function () {
    var id = textarea.getAttribute("data-id");
    localStorage.setItem(id, textarea.value);
    });
});

// Fonction pour vérifier si toutes les cases sont cochées
function updateCloturerButton(row) {
    const checkboxes = row.querySelectorAll('input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    const cloturerButton = row.querySelector(".cloturer-btn");

    // Si toutes les cases sont cochées, griser le bouton
    if (allChecked) {
    cloturerButton.classList.add("disabled");
    cloturerButton.textContent = "Agence Clôturée";
    localStorage.setItem("cloturer_" + row.dataset.agenceId, "true");
    } else {
    cloturerButton.classList.remove("disabled");
    cloturerButton.textContent = "Clôturer";
    localStorage.setItem("cloturer_" + row.dataset.agenceId, "false");
    }
}

// Mise à jour des boutons "Clôturer" après un rechargement de la page
document.querySelectorAll("tr").forEach(function (row) {
    var agenceId = row.dataset.agenceId;
    if (localStorage.getItem("cloturer_" + agenceId) === "true") {
    const cloturerButton = row.querySelector(".cloturer-btn");
    cloturerButton.classList.add("disabled");
    cloturerButton.textContent = "Agence Clôturée"; // Griser le bouton
    row.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.checked = true; // Cocher toutes les cases dans cette ligne
    });
    } else {
    updateCloturerButton(row); // Vérifier si toutes les cases sont cochées
    }
});

// Ajouter un écouteur d'événement pour chaque bouton "Clôturer"
document.querySelectorAll(".cloturer-btn").forEach(function (button) {
    button.addEventListener("click", function () {
    const row = button.closest("tr");
    const agenceId = row.dataset.agenceId;

    // Si le bouton est déjà désactivé, éviter toute action
    if (button.classList.contains("disabled")) {
        return;
    }

    // Logique pour clôturer l'agence (par exemple, envoyer une requête à votre serveur)
    console.log("Clôturer l'agence avec l'ID:", agenceId);

    // Griser le bouton et marquer l'agence comme clôturée
    button.classList.add("disabled");
    button.textContent = "Agence Clôturée"; // Changer le texte du bouton
    localStorage.setItem("cloturer_" + agenceId, "true");

    // Cocher toutes les cases
    row.querySelectorAll('input[type="checkbox"]').forEach(function (checkbox) {
        checkbox.checked = true;
    });
    });
});

// Sauvegarder les heures dans le stockage local à l'envoi du formulaire
document.getElementById("timeForm").addEventListener("submit", function () {
    localStorage.setItem(
    "heure_debut",
    document.getElementById("heure_debut").value
    );
    localStorage.setItem(
    "heure_fin",
    document.getElementById("heure_fin").value
    );
});
});

document.getElementById("saveReport").addEventListener("click", function () {
// Activer toutes les cases à cocher avant de générer le PDF
var checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(function (checkbox) {
    checkbox.disabled = false;
});

html2canvas(document.getElementById("tableContainer"), {
    scrollY: -window.scrollY,
    scrollX: -window.scrollX,
})
    .then((canvas) => {
    var imgData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    var doc = new jsPDF("p", "mm", "a4"); // Format A4 portrait en mm

    var imgWidth = 190; // Largeur en mm pour une page A4
    var pageHeight = 297; // Hauteur en mm pour une page A4
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    var heightLeft = imgHeight;

    var position = 10;

    // Ajouter la date et l'heure avant le tableau
    var today = new Date();
    var date = today.toLocaleDateString();
    var time = today.toLocaleTimeString();

    doc.setFontSize(12);
    doc.text("Date: " + date, 10, position); // Afficher la date
    position += 10; // Décaler vers le bas pour l'heure
    doc.text("Heure: " + time, 10, position); // Afficher l'heure
    position += 20; // Décaler avant le tableau

    // Ajouter l'image du tableau (tableau à partir de html2canvas)
    doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Ajouter des pages si nécessaire pour le tableau
    while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    // Ajouter la section de signature après le tableau
    position += imgHeight + 10; // Décaler sous le tableau
    doc.text("Nom: _______________________________", 10, position);
    position += 10;
    doc.text("Signature: _________________________", 10, position);

    // Sauvegarder le PDF
    doc.save("tableau.pdf");

    // Réactiver les cases à cocher après la génération du PDF
    checkboxes.forEach(function (checkbox) {
        checkbox.disabled = false;
    });
    })
    .catch((error) => {
    console.error("Erreur lors de la génération du PDF:", error);

    // Réactiver les cases à cocher en cas d'erreur
    checkboxes.forEach(function (checkbox) {
        checkbox.disabled = false;
    });
    });
});
