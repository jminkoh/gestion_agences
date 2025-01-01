document.addEventListener('DOMContentLoaded', function () {
const form = document.getElementById('timeForm');
const heureDebutInput = document.getElementById('heure_debut');
const heureFinInput = document.getElementById('heure_fin');

// Charger les données sauvegardées depuis localStorage
const savedHeureDebut = localStorage.getItem('heure_debut');
const savedHeureFin = localStorage.getItem('heure_fin');

if (savedHeureDebut) {
    heureDebutInput.value = savedHeureDebut;
}

if (savedHeureFin) {
    heureFinInput.value = savedHeureFin;
}

// Sauvegarder les données dans localStorage lors de la soumission du formulaire
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Empêcher le rechargement de la page

    const heureDebut = heureDebutInput.value;
    const heureFin = heureFinInput.value;

    // Sauvegarder dans localStorage
    localStorage.setItem('heure_debut', heureDebut);
    localStorage.setItem('heure_fin', heureFin);

    alert('Heures sauvegardées avec succès !');
});
});

document.addEventListener('DOMContentLoaded', function () {
    // Gestion du clic sur les boutons "Clôturer"
    document.querySelectorAll('.cloturer-btn').forEach(button => {
      button.addEventListener('click', function () {
        const row = button.closest('tr'); // Trouver la ligne associée au bouton
        const balanceCheckbox = row.querySelector('.balance-checkbox');
        const journeeCheckbox = row.querySelector('.journee-checkbox');

        // Cocher les checkbox de la ligne
        balanceCheckbox.checked = true;
        journeeCheckbox.checked = true;

        // Désactiver le bouton
        button.disabled = true;

        // Message de confirmation
        alert('Agence clôturée !');
      });
    });

    // Optionnel : Gestion des changements dans les checkboxes
    document.querySelectorAll('.balance-checkbox, .journee-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        const row = checkbox.closest('tr');
        const balanceChecked = row.querySelector('.balance-checkbox').checked;
        const journeeChecked = row.querySelector('.journee-checkbox').checked;
        const cloturerButton = row.querySelector('.cloturer-btn');

        // Activer ou désactiver le bouton en fonction de l'état des checkboxes
        cloturerButton.disabled = balanceChecked && journeeChecked;
      });
    });
  });