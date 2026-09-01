from flask import Flask, render_template, request, flash, redirect, url_for
from datetime import datetime
import os
import re
import urllib.parse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Security: Require FLASK_SECRET_KEY from environment in production
secret_key = os.environ.get('FLASK_SECRET_KEY')
if not secret_key:
    raise ValueError("FLASK_SECRET_KEY environment variable must be set")
app.secret_key = secret_key

# Business Configuration - EDIT THESE FOR YOUR BUSINESS
BUSINESS_CONFIG = {
    'name': 'MERLIN HAND CARWASH',
    'phone': '+447861686522',
    'postcode': 'WF9 3AP',
    'established': '2018',
    'address': 'MERLIN HAND CARWASH\nWF9 3AP',
    'opening_hours': {
        'monday': 'Monday — 9:00 AM–6:00 PM',
        'tuesday': 'Tuesday — 9:00 AM–6:00 PM',
        'wednesday': 'Wednesday — 9:00 AM–6:00 PM',
        'thursday': 'Thursday — 9:00 AM–6:00 PM',
        'friday': 'Friday — 9:00 AM–6:00 PM',
        'saturday': 'Saturday — 9:00 AM–6:00 PM',
        'sunday': 'Sunday — 9:00 AM–5:00 PM'
    },
    'map_embed_url': 'https://maps.google.com/maps?q=WF9+3AP,+UK&output=embed'
}

# UK-focused services and pricing (GBP)
SERVICES = {
    'washing_outside': {
        'name': 'Washing Outside Car',
        'services': ['Hand Wash', 'Hand Wax', 'Hand Dry', 'Wheel Treatment', 'Inside Doors', 'Tyre Shine'],
        'prices': {
            'small_car': {'name': 'Small Car', 'price': 8},
            'mid_car': {'name': 'Mid Car', 'price': 10},
            '4x4': {'name': '4X4', 'price': 12},
            'small_van': {'name': 'Small Van', 'price': 10},
            'mid_van': {'name': 'Mid Van', 'price': 15},
            'large_van': {'name': 'Large Van', 'price': 20}
        }
    },
    'mini_valeting_silver': {
        'name': 'Mini Valeting - Silver',
        'services': ['Hand Wash', 'Hand Wax', 'Hand Dry', 'Wheel Treatment', 'Inside Doors', 'Tyre Shine', 'Mats Vacuum', 'Dashboard Wipe'],
        'prices': {
            'small_car': {'name': 'Small Car', 'price': 20},
            'mid_car': {'name': 'Mid Car', 'price': 22},
            '4x4': {'name': '4X4', 'price': 25},
            'small_van': {'name': 'Small Van', 'price': 22}
        }
    },
    'mini_valeting_gold': {
        'name': 'Mini Valeting - Gold',
        'services': ['Hand Wash', 'Hand Wax', 'Hand Dry', 'Wheel Treatment', 'Inside Doors', 'Tyre Shine', 'Mats Vacuum', 'Dashboard Wipe', 'Windows Cleaned In and Out', 'Spray Wax'],
        'prices': {
            'small_car': {'name': 'Small Car', 'price': 25},
            'mid_car': {'name': 'Mid Car', 'price': 30},
            '4x4': {'name': '4X4', 'price': 35},
            'small_van': {'name': 'Small Van', 'price': 30}
        }
    },
    'mini_valeting_platinum': {
        'name': 'Mini Valeting - Platinum',
        'services': ['Hand Wash', 'Hand Wax', 'Hand Dry', 'Wheel Treatment', 'Mats Washed', 'Plastic Shine', 'Inside Doors', 'Tyre Shine', 'Mats Vacuum', 'Dashboard Wipe', 'Windows Cleaned In and Out', 'Spray Wax'],
        'prices': {
            'small_car': {'name': 'Small Car', 'price': 30},
            'mid_car': {'name': 'Mid Car', 'price': 35},
            '4x4': {'name': '4X4', 'price': 40},
            'small_van': {'name': 'Small Van', 'price': 35}
        }
    },
    'diamond_full_valeting': {
        'name': 'Diamond Full Valeting',
        'services': ['Hand Wash', 'Hand Wax', 'Hand Dry', 'Wheel Treatment', 'Seats and Carpets Shampooed', 'Mats Washed', 'Plastic Shine', 'Inside Doors', 'Tyre Shine', 'Mats Vacuum', 'Dashboard Wipe', 'Windows Cleaned In and Out', 'Spray Wax'],
        'prices': {
            'small_car': {'name': 'Small Car', 'price': 60},
            'mid_car': {'name': 'Mid Car', 'price': 65},
            '4x4': {'name': '4X4', 'price': 75},
            'small_van': {'name': 'Small Van', 'price': 60}
        }
    }
}

WHATSAPP_CLICK_TO_CHAT_NUMBER = '447861686522'

WEEKDAY_TIMES = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
]
SUNDAY_TIMES = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
]


def format_listed_price(price):
    if isinstance(price, float) and price.is_integer():
        return int(price)
    return price


def lookup_priced_booking(service_key, vehicle_key):
    """Resolve a real priced service/vehicle pair from server data only."""
    if service_key not in SERVICES:
        return None
    service_info = SERVICES[service_key]
    prices = service_info.get('prices') or {}
    if vehicle_key not in prices:
        return None
    vehicle_info = prices[vehicle_key]
    price = vehicle_info.get('price')
    if not isinstance(price, (int, float)) or price <= 0:
        return None
    return {
        'service_name': service_info['name'],
        'vehicle_name': vehicle_info['name'],
        'price': format_listed_price(price)
    }


def is_valid_uk_mobile(phone):
    compact = re.sub(r'\s+', '', (phone or '').strip())
    return bool(re.fullmatch(r'(07\d{9}|\+447\d{9})', compact))


def parse_booking_date(date_str):
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except (TypeError, ValueError):
        return None


def allowed_times_for_date(booking_date):
    if booking_date.weekday() == 6:
        return SUNDAY_TIMES
    return WEEKDAY_TIMES


def is_time_in_past(booking_date, time_str):
    """Check if the booking time is in the past for today."""
    if booking_date != datetime.now().date():
        return False  # Only check for today
    
    try:
        # Parse time string like '9:00 AM' to hours and minutes
        time_part, period = time_str.split(' ')
        hours, minutes = map(int, time_part.split(':'))
        
        # Convert to 24-hour format
        if period == 'PM' and hours != 12:
            hours += 12
        elif period == 'AM' and hours == 12:
            hours = 0
        
        # Create booking datetime
        booking_datetime = datetime(booking_date.year, booking_date.month, booking_date.day, hours, minutes)
        
        # Compare with current time
        now = datetime.now()
        return booking_datetime < now
    except (ValueError, AttributeError):
        return True  # Invalid time, treat as past


def format_booking_date(booking_date):
    return f"{booking_date.day} {booking_date.strftime('%B %Y')}"


def build_whatsapp_click_to_chat_url(name, phone, service_name, vehicle_name, price, formatted_date, time):
    message = (
        f"New Booking - {BUSINESS_CONFIG['name']}\n\n"
        f"Name: {name}\n"
        f"Phone: {phone}\n"
        f"Service: {service_name}\n"
        f"Vehicle: {vehicle_name}\n"
        f"Price: £{price}\n"
        f"Date: {formatted_date}\n"
        f"Time: {time}"
    )
    return (
        f"https://wa.me/{WHATSAPP_CLICK_TO_CHAT_NUMBER}"
        f"?text={urllib.parse.quote(message)}"
    )


@app.route('/')
def index():
    return render_template('index.html', services=SERVICES, config=BUSINESS_CONFIG)

@app.route('/privacy')
def privacy():
    return render_template('privacy.html', config=BUSINESS_CONFIG)

@app.route('/book', methods=['POST'])
def book():
    if request.method == 'POST':
        try:
            service = (request.form.get('service') or '').strip()
            vehicle_type = (request.form.get('vehicle_type') or '').strip()
            date = (request.form.get('date') or '').strip()
            time = (request.form.get('time') or '').strip()
            name = (request.form.get('name') or '').strip()
            phone = (request.form.get('phone') or '').strip()

            if not all([service, vehicle_type, date, time, name, phone]):
                flash('Please fill in all fields', 'error')
                return redirect(url_for('index'))

            if not is_valid_uk_mobile(phone):
                flash('Please enter a valid UK mobile number', 'error')
                return redirect(url_for('index'))

            quoted = lookup_priced_booking(service, vehicle_type)
            if quoted is None:
                flash('Please choose a valid service and vehicle with a listed price', 'error')
                return redirect(url_for('index'))

            booking_date = parse_booking_date(date)
            if booking_date is None:
                flash('Please choose a valid date', 'error')
                return redirect(url_for('index'))

            if booking_date < datetime.now().date():
                flash('Please choose today or a future date', 'error')
                return redirect(url_for('index'))

            if time not in allowed_times_for_date(booking_date):
                flash('Please choose a time within opening hours for that day', 'error')
                return redirect(url_for('index'))

            if is_time_in_past(booking_date, time):
                flash('Please choose a future time for today booking', 'error')
                return redirect(url_for('index'))

            whatsapp_url = build_whatsapp_click_to_chat_url(
                name,
                phone,
                quoted['service_name'],
                quoted['vehicle_name'],
                quoted['price'],
                format_booking_date(booking_date),
                time
            )
            return redirect(whatsapp_url)
        except Exception as e:
            flash(f'An error occurred: {str(e)}', 'error')
            return redirect(url_for('index'))
    
    return redirect(url_for('index'))

if __name__ == '__main__':
    # Debug mode OFF by default, only enable if explicitly set
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)