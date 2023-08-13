// Obtener una referencia al formulario y la tabla
const cardForm = document.getElementById('cardForm');
const cardTableBody = document.querySelector('#cardTable tbody');
const searchButton = document.getElementById('searchButton');
const searchTermInput = document.getElementById('searchTerm');
const loadCardsButton = document.getElementById('loadCards');

// Función para agregar un nuevo Pokémon al servidor
function createCard(event) {
  event.preventDefault();

  const cardData = {
    type: document.getElementById('cardType').value,
    name: document.getElementById('cardName').value,
    description: document.getElementById('cardDescription').value,
    battlePoints: parseInt(document.getElementById('cardBattlePoints').value),
  };

  // Realizar una solicitud POST al servidor para registrar el Pokémon
  $.ajax({
    type: 'POST',
    url: '/pokemon',
    data: JSON.stringify(cardData),
    contentType: 'application/json',
    success: function (data) {
      // Mostrar mensaje de éxito y actualizar la lista de Pokémones
      showMessage('Pokémon registrado exitosamente', 'success');
      loadCards();
      cardForm.reset();
    },
    error: function (error) {
      showMessage('Error al registrar el Pokémon', 'error');
    },
  });
}

// Función para cargar los Pokémones registrados desde el servidor
function loadCards() {
  // Realizar una solicitud GET al servidor para obtener los Pokémones
  $.ajax({
    type: 'GET',
    url: '/pokemon',
    success: function (data) {
      // Limpiar la tabla antes de cargar los nuevos datos
      cardTableBody.innerHTML = '';

      // Iterar sobre los Pokémones obtenidos y agregarlos a la tabla
      data.forEach((card) => {
        const newRow = cardTableBody.insertRow();

        newRow.innerHTML = `
          <td>${card.type}</td>
          <td>${card.name}</td>
          <td>${card.description}</td>
          <td>${card.battlePoints}</td>
        `;

        newRow.addEventListener('click', () => {
          // Mostrar el formulario de edición con los detalles del Pokémon seleccionado
          showEditForm(card);
        });
      });
    },
    error: function (error) {
      showMessage('Error al cargar los Pokémones', 'error');
    },
  });
}

// Función para buscar Pokémones por nombre o tipo
function searchCards() {
  const searchTerm = searchTermInput.value.trim();

  // Realizar una solicitud GET al servidor para buscar Pokémones por nombre o tipo
  $.ajax({
    type: 'GET',
    url: `/pokemon?search=${encodeURIComponent(searchTerm)}`,
    success: function (data) {
      // Limpiar la tabla antes de cargar los nuevos datos
      cardTableBody.innerHTML = '';

      // Iterar sobre los Pokémones obtenidos y agregarlos a la tabla
      data.forEach((card) => {
        const newRow = cardTableBody.insertRow();

        newRow.innerHTML = `
          <td>${card.type}</td>
          <td>${card.name}</td>
          <td>${card.description}</td>
          <td>${card.battlePoints}</td>
        `;

        newRow.addEventListener('click', () => {
          // Mostrar el formulario de edición con los detalles del Pokémon seleccionado
          showEditForm(card);
        });
      });

      showMessage(`${data.length} Pokémones encontrados`, 'success');
    },
    error: function (error) {
      showMessage('Error al buscar los Pokémones', 'error');
    },
  });
}

// Función para mostrar un mensaje en la página
function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
  messageDiv.className = type;
}

// Función para mostrar el formulario de edición con los detalles del Pokémon seleccionado
function showEditForm(card) {
  const editCardForm = document.getElementById('editCardForm');
  const editCardType = document.getElementById('editCardType');
  const editCardName = document.getElementById('editCardName');
  const editCardDescription = document.getElementById('editCardDescription');
  const editCardBattlePoints = document.getElementById('editCardBattlePoints');
  const updateCardButton = document.getElementById('updateCardButton');
  const deleteCardButton = document.getElementById('deleteCardButton');

  // Rellenar los campos del formulario de edición con los detalles del Pokémon seleccionado
  editCardType.value = card.type;
  editCardName.value = card.name;
  editCardDescription.value = card.description;
  editCardBattlePoints.value = card.battlePoints;

  // Mostrar el formulario de edición y ocultar el formulario de registro
  editCardForm.style.display = 'block';
  cardForm.style.display = 'none';

  // Configurar el botón de actualizar para enviar una solicitud PUT al servidor
  updateCardButton.addEventListener('click', () => {
    const updatedCardData = {
      type: editCardType.value,
      name: editCardName.value,
      description: editCardDescription.value,
      battlePoints: parseInt(editCardBattlePoints.value),
    };

    // Realizar una solicitud PUT al servidor para actualizar los detalles del Pokémon
    $.ajax({
      type: 'PUT',
      url: `/pokemon/${card._id}`,
      data: JSON.stringify(updatedCardData),
      contentType: 'application/json',
      success: function (data) {
        showMessage('Pokémon actualizado exitosamente', 'success');
        loadCards();
        hideEditForm();
      },
      error: function (error) {
        showMessage('Error al actualizar el Pokémon', 'error');
      },
    });
  });

  // Configurar el botón de eliminar para enviar una solicitud DELETE al servidor
  deleteCardButton.addEventListener('click', () => {
    // Realizar una solicitud DELETE al servidor para eliminar el Pokémon
    $.ajax({
      type: 'DELETE',
      url: `/pokemon/${card._id}`,
      success: function (data) {
        showMessage('Pokémon eliminado exitosamente', 'success');
        loadCards();
        hideEditForm();
      },
      error: function (error) {
        showMessage('Error al eliminar el Pokémon', 'error');
      },
    });
  });
}

// Función para ocultar el formulario de edición y mostrar el formulario de registro
function hideEditForm() {
  const editCardForm = document.getElementById('editCardForm');
  const updateCardButton = document.getElementById('updateCardButton');
  const deleteCardButton = document.getElementById('deleteCardButton');

  // Restablecer los campos del formulario de edición
  editCardForm.reset();

  // Ocultar el formulario de edición y mostrar el formulario de registro
  editCardForm.style.display = 'none';
  cardForm.style.display = 'block';

  // Eliminar los listeners del botón de actualizar y eliminar
  updateCardButton.removeEventListener('click', () => {});
  deleteCardButton.removeEventListener('click', () => {});
}

// Configurar los eventos para los botones y el formulario
cardForm.addEventListener('submit', createCard);
searchButton.addEventListener('click', searchCards);
loadCardsButton.addEventListener('click', loadCards);

