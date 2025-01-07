document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('timeForm');
    const heureDebutInput = document.getElementById('heure_debut');

    // Charger les données sauvegardées depuis localStorage
    const savedHeureDebut = localStorage.getItem('heure_debut');

    if (savedHeureDebut) {
      heureDebutInput.value = savedHeureDebut;
    }

    // Sauvegarder l'heure de début dans localStorage lors de la soumission du formulaire
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Empêcher le rechargement de la page

      const heureDebut = heureDebutInput.value;

      // Sauvegarder dans localStorage
      localStorage.setItem('heure_debut', heureDebut);

      alert('Heure de début sauvegardée avec succès !');
    });
});

document.addEventListener('DOMContentLoaded', function () {

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