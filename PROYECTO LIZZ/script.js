document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reservationForm');
  const reservationList = document.getElementById('reservationList');
  const serviceSelect = document.getElementById('service');
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);

  // Populate time slots based on selected service
  serviceSelect.addEventListener('change', populateTimeSlots);
  dateInput.addEventListener('change', populateTimeSlots);

  function populateTimeSlots() {
    const service = serviceSelect.value;
    const date = dateInput.value;
    timeSelect.innerHTML = '<option value="" disabled selected>Selecciona una hora</option>';

    if (service && date) {
      const timeSlots = getTimeSlots(service, date);
      timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
      });
    }
  }

  function getTimeSlots(service, date) {
    // This is a mock function. In a real application, you might fetch this data from a server.
    const slots = {
      'Corte de pelo': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      'Psicologo': ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30'],
      'Fisioterapeuta': ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30'],
      'Nutriologa': ['10:00', '11:30', '13:00', '14:30', '16:00'],
      'Veterinario': ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
    };
    return slots[service] || [];
  }

  // Form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const service = serviceSelect.value;
    const date = dateInput.value;
    const time = timeSelect.value;
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    if (!service || !date || !time || !name || !phone) {
      showNotification('Por favor, completa todos los campos.', 'error');
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      showNotification('Por favor, ingresa un número de teléfono válido.', 'error');
      return;
    }

    const listItem = createReservationItem(service, date, time, name, phone);
    reservationList.appendChild(listItem);

    form.reset();
    showNotification('¡Cita reservada exitosamente!', 'success');
  });

  function isValidPhoneNumber(phone) {
    // This is a simple validation. Adjust as needed for your specific requirements.
    return /^\d{10}$/.test(phone);
  }

  function createReservationItem(service, date, time, name, phone) {
    const listItem = document.createElement('li');
    listItem.classList.add('reservation-item');
    listItem.innerHTML = `
      <div class="reservation-info">
        <h3>${service}</h3>
        <p><i class="far fa-calendar"></i> ${date} <i class="far fa-clock"></i> ${time}</p>
        <p><i class="fas fa-user"></i> ${name} <i class="fas fa-phone"></i> ${phone}</p>
      </div>
      <button class="cancel-btn"><i class="fas fa-times"></i> Cancelar</button>
    `;

    const cancelButton = listItem.querySelector('.cancel-btn');
    cancelButton.addEventListener('click', function() {
      listItem.classList.add('fade-out');
      setTimeout(() => {
        reservationList.removeChild(listItem);
        showNotification('Cita cancelada.', 'info');
      }, 300);
    });

    return listItem;
  }

  function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(function() {
      notification.classList.remove('show');
    }, 3000);
  }
});