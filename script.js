// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only intercept if this is a same-page anchor (link doesn't have a path component)
        // Cross-page links like "http://localhost:5000/#services" should navigate normally
        if (href.startsWith('#') && href.length > 1 && this.pathname === window.location.pathname) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
        // Cross-page navigation (different pathname) proceeds normally
    });
});

// Handle hash fragments on page load for smooth scrolling
window.addEventListener('load', function() {
    if (window.location.hash && window.location.pathname === '/') {
        const target = document.querySelector(window.location.hash);
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Quick date buttons functionality
const dateInput = document.getElementById('date');
const quickDatesButtons = document.getElementById('quick-dates-buttons');
const showCalendarBtn = document.getElementById('show-calendar-btn');

if (dateInput && quickDatesButtons) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Generate next 7 valid booking dates (Today + Next 6 days)
    function generateQuickDates() {
        const dates = [];
        const currentDate = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i);
            
            const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
            const dayNumber = date.getDate();
            const monthName = date.toLocaleDateString('en-GB', { month: 'short' });
            // Use local date string to avoid timezone issues
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            dates.push({
                dateStr: dateStr,
                display: `${dayName}, ${dayNumber} ${monthName}`,
                dayName: dayName,
                dayDate: `${dayNumber} ${monthName}`
            });
        }
        
        return dates;
    }

    // Render quick date buttons
    function renderQuickDates() {
        const dates = generateQuickDates();
        quickDatesButtons.innerHTML = '';
        
        dates.forEach((dateObj, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'quick-date-btn';
            button.dataset.date = dateObj.dateStr;
            
            const dayNameSpan = document.createElement('span');
            dayNameSpan.className = 'day-name';
            dayNameSpan.textContent = index === 0 ? 'Today' : dateObj.dayName;
            
            const dayDateSpan = document.createElement('span');
            dayDateSpan.className = 'day-date';
            dayDateSpan.textContent = dateObj.dayDate;
            
            button.appendChild(dayNameSpan);
            button.appendChild(dayDateSpan);
            
            button.addEventListener('click', () => {
                // Remove selected class from all buttons
                document.querySelectorAll('.quick-date-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Add selected class to clicked button
                button.classList.add('selected');
                
                // Set the date input value
                dateInput.value = dateObj.dateStr;
                
                // Trigger change event to update time options
                dateInput.dispatchEvent(new Event('change'));
                
                // Hide calendar and show "Choose another date" button
                dateInput.style.display = 'none';
                showCalendarBtn.style.display = 'inline-block';
            });
            
            quickDatesButtons.appendChild(button);
        });
    }

    // Show calendar button functionality
    if (showCalendarBtn) {
        showCalendarBtn.addEventListener('click', () => {
            dateInput.style.display = 'block';
            showCalendarBtn.style.display = 'none';
            
            // Remove selected class from all buttons
            document.querySelectorAll('.quick-date-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Reset time options
            const timeButtonsContainer = document.getElementById('time-buttons-container');
            if (timeButtonsContainer) {
                timeButtonsContainer.innerHTML = '<p class="select-date-first">Please select a date first</p>';
            }
            const timeInput = document.getElementById('time');
            if (timeInput) {
                timeInput.value = '';
            }
        });
    }

    // Initialize quick dates
    renderQuickDates();
}

// Service selection function
function selectService(serviceKey) {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.value = serviceKey;
        // Trigger the change event to update vehicle options
        serviceSelect.dispatchEvent(new Event('change'));
        // Scroll to booking section
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            const headerOffset = 70;
            const elementPosition = bookingSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    return false; // Prevent default link behavior
}

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Vehicle selection based on service
const serviceSelect = document.getElementById('service');
const vehicleSelect = document.getElementById('vehicle_type');
const servicesData = document.getElementById('services-data');

if (serviceSelect && vehicleSelect && servicesData && dateInput) {
    const services = JSON.parse(servicesData.textContent);

    // Weekday times (Monday-Saturday) - removed 6:00 PM
    const weekdayTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    // Sunday times
    const sundayTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

    function updateVehicleOptions() {
        const selectedService = serviceSelect.value;
        vehicleSelect.innerHTML = '<option value="">Choose a service first...</option>';

        if (selectedService && services[selectedService]) {
            const prices = services[selectedService].prices;
            for (const [key, vehicle] of Object.entries(prices)) {
                if (vehicle.price > 0) {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = `${vehicle.name} — £${vehicle.price}`;
                    vehicleSelect.appendChild(option);
                }
            }
        }
    }

    function updateTimeOptions() {
        const timeInput = document.getElementById('time');
        const timeButtonsContainer = document.getElementById('time-buttons-container');
        const dateInputElement = document.getElementById('date');
        const selectedDate = dateInputElement ? dateInputElement.value : '';
        
        if (!selectedDate || !timeButtonsContainer) {
            // Show "select date first" message
            if (timeButtonsContainer) {
                timeButtonsContainer.innerHTML = '<p class="select-date-first">Please select a date first</p>';
            }
            if (timeInput) {
                timeInput.value = '';
            }
            return;
        }

        const dateObj = new Date(selectedDate + 'T00:00:00'); // Ensure proper date parsing
        const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
        const times = dayOfWeek === 0 ? sundayTimes : weekdayTimes;

        // Check if selected date is today (more robust comparison)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDateOnly = new Date(dateObj);
        selectedDateOnly.setHours(0, 0, 0, 0);
        const isToday = selectedDateOnly.getTime() === today.getTime();

        // Get current time in minutes for filtering
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        // Convert time string to minutes for comparison
        function timeToMinutes(timeStr) {
            const [time, period] = timeStr.split(' ');
            const [hours, minutes] = time.split(':').map(Number);
            let hours24 = hours;
            if (period === 'PM' && hours !== 12) {
                hours24 += 12;
            } else if (period === 'AM' && hours === 12) {
                hours24 = 0;
            }
            return hours24 * 60 + minutes;
        }

        // Filter times for today - only show future times
        const availableTimes = isToday 
            ? times.filter(time => timeToMinutes(time) > currentMinutes)
            : times;

        // Clear previous content
        timeButtonsContainer.innerHTML = '';
        
        if (availableTimes.length === 0) {
            timeButtonsContainer.innerHTML = '<p class="select-date-first">No available times remaining for today. Please select a future date.</p>';
            if (timeInput) {
                timeInput.value = '';
            }
            return;
        }
        
        // Create time buttons
        availableTimes.forEach(time => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'time-btn';
            button.textContent = time;
            button.dataset.time = time;
            
            button.addEventListener('click', () => {
                // Remove selected class from all buttons
                document.querySelectorAll('.time-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                
                // Add selected class to clicked button
                button.classList.add('selected');
                
                // Set the hidden time input value
                if (timeInput) {
                    timeInput.value = time;
                }
            });
            
            timeButtonsContainer.appendChild(button);
        });
        
        // Clear time input when date changes
        if (timeInput) {
            timeInput.value = '';
        }
    }

    serviceSelect.addEventListener('change', updateVehicleOptions);
    const dateInputElement = document.getElementById('date');
    const showCalendarBtnElement = document.getElementById('show-calendar-btn');
    if (dateInputElement) {
        dateInputElement.addEventListener('change', function() {
            updateTimeOptions();
            // Show "Choose another date" button when calendar is used
            if (showCalendarBtnElement) {
                showCalendarBtnElement.style.display = 'inline-block';
            }
        });
    }

    // Initialize
    updateVehicleOptions();
    updateTimeOptions();
}

// Form validation - let server handle WhatsApp redirect
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        const phoneInput = document.getElementById('phone');
        const phoneValue = phoneInput.value.replace(/\s+/g, '');
        
        // UK mobile validation: 07XXXXXXXXX or +447XXXXXXXXX
        const ukMobileRegex = /^(07\d{9}|\+447\d{9})$/;
        if (!ukMobileRegex.test(phoneValue)) {
            e.preventDefault();
            alert('Please enter a valid UK mobile number (e.g., 07123 456789 or +44 7123 456789)');
            phoneInput.focus();
            return;
        }

        // Validate service and vehicle selection
        const serviceSelect = document.getElementById('service');
        const vehicleSelect = document.getElementById('vehicle_type');
        
        if (!serviceSelect.value || !vehicleSelect.value) {
            e.preventDefault();
            alert('Please select a service and vehicle type');
            return;
        }

        // Validate time selection
        const timeInput = document.getElementById('time');
        if (!timeInput || !timeInput.value) {
            e.preventDefault();
            alert('Please select a time');
            return;
        }

        // Validate date is not in the past
        const dateInputElement = document.getElementById('date');
        const dateValue = dateInputElement ? dateInputElement.value : '';
        if (dateValue) {
            const selectedDate = new Date(dateValue + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                e.preventDefault();
                alert('Please select today or a future date');
                return;
            }
        }

        // Let the form submit to server for WhatsApp redirect
    });
}

// UK Phone number formatting - preserve +44 if entered
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // If user starts with +44, preserve it
        if (value.startsWith('+44')) {
            let digits = value.replace(/\D/g, '').substring(2); // Remove +44
            if (digits.length > 10) {
                digits = digits.slice(0, 10);
            }
            // Format as +44 7XXX XXXXXX
            if (digits.length >= 7) {
                value = '+44 ' + digits.slice(0, 4) + ' ' + digits.slice(4);
            } else if (digits.length >= 4) {
                value = '+44 ' + digits.slice(0, 4) + ' ' + digits.slice(4);
            } else {
                value = '+44 ' + digits;
            }
        } else {
            // Standard 07XXX XXXXXX format
            let digits = value.replace(/\D/g, '');
            if (digits.length > 11) {
                digits = digits.slice(0, 11);
            }
            if (digits.length >= 7) {
                value = digits.slice(0, 5) + ' ' + digits.slice(5);
            } else {
                value = digits;
            }
        }
        
        e.target.value = value;
    });
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all service cards and gallery items
document.querySelectorAll('.service-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Auto-hide flash messages after 5 seconds
const flashMessages = document.querySelectorAll('.flash-message');
flashMessages.forEach(message => {
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100%)';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 5000);
});