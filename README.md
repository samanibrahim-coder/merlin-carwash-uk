# Merlin Hand Carwash Website

A professional, responsive UK car wash website built with Flask with WhatsApp-based booking system.

## 🚀 Quick Start

### For Windows Users:
1. **Double-click `start.bat`** to automatically start the website
2. The website will open in your default browser at: **http://127.0.0.1:5000**
3. Press `Ctrl+C` in the command window to stop the server

### Manual Start:
```bash
cd C:\Users\moham\OneDrive\Desktop\merlin_carwash
python -m pip install -r requirements.txt
python app.py
```

## ⚙️ Configuration (IMPORTANT)

### 1. Business Configuration
Business details are configured in `app.py` under `BUSINESS_CONFIG`:
- Business name: MERLIN HAND CARWASH
- Phone: +447861686522
- Postcode: WF9 3AP
- Established: 2018
- Opening hours: Monday–Saturday 9:00 AM–6:00 PM, Sunday 9:00 AM–5:00 PM

### 2. Google Maps Setup
The map is currently configured for WF9 3AP. To update to your specific location:
1. Go to Google Maps and find your business location
2. Click "Share" → "Embed a map"
3. Copy the embed URL
4. Update the `map_embed_url` in `BUSINESS_CONFIG` in `app.py`

### 3. Security Setup
- Set FLASK_SECRET_KEY environment variable (required)
- Generate a secure key: `python -c "import secrets; print(secrets.token_hex(32))"`
- Copy `.env.example` to `.env` and add your secret key
- For production, use environment variables instead of hardcoding
- **IMPORTANT: Never upload, commit, or share the .env file. It contains real secrets.**
- Only upload .env.example as a template with safe placeholders

### 4. Services & Pricing
Edit the `SERVICES` dictionary in `app.py` to match your actual services and UK pricing.

## 📁 Project Structure
```
merlin_carwash/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── start.bat             # Windows startup script
├── README.md             # This file
├── .gitignore            # Git ignore file (excludes .env, __pycache__)
├── .env.example          # Environment variables template (safe placeholders)
├── .env                  # Environment variables (NOT committed/shared)
├── static/
│   ├── css/
│   │   └── style.css     # Website styling
│   ├── js/
│   │   └── script.js      # JavaScript functionality
│   └── images/           # Add your car wash photos here
└── templates/
    ├── base.html         # Base template with navigation
    ├── index.html        # Main homepage
    └── privacy.html      # Privacy policy page
```

## 🎯 Website URLs
- **Main website:** http://127.0.0.1:5000
- **Privacy Policy:** http://127.0.0.1:5000/privacy

## 📝 Content Customization

### Business Information
All business details are configured in `app.py` under `BUSINESS_CONFIG`:
- Business name
- Phone number (UK format)
- Address (multiline support)
- Opening hours
- Google Maps embed URL

### Modify Services & Pricing
Edit the `SERVICES` dictionary in `app.py`:
- Service names
- GBP pricing
- Descriptions

### Change Colors
- Modify CSS variables in `static/css/style.css` (lines 8-18)

## 🌟 Features
- ✅ **UK-focused:** GBP pricing, UK phone formatting, UK location support
- ✅ **WhatsApp booking:** Direct booking via WhatsApp click-to-chat
- ✅ **Responsive design:** Works perfectly on mobile and desktop
- ✅ **Service packages:** Customizable car wash packages with pricing
- ✅ **Contact information:** Configurable UK phone, address, hours
- ✅ **Google Maps integration:** UK map with business location
- ✅ **Security:** Environment variables for secret keys, production mode
- ✅ **Privacy policy:** Clear explanation of data handling

## 🚨 Troubleshooting

### Python not found:
- Install Python from https://www.python.org/
- Make sure to check "Add Python to PATH" during installation

### Port already in use:
- The script uses port 5000 by default
- If port 5000 is busy, close other applications using it

### Dependencies not installing:
- Run: `python -m pip install --upgrade pip`
- Then run: `python -m pip install -r requirements.txt`

## 🔒 Security Notes
- **Production deployment:** Disable debug mode (set FLASK_DEBUG=False)
- **Secret key:** FLASK_SECRET_KEY environment variable is required for production
- **Environment variables:** Never commit .env file or real secrets to version control
- **IMPORTANT: The .env file must never be uploaded, committed, or included in shared ZIP files.**

## 📱 UK-Specific Features
- **Phone formatting:** UK mobile number format (07XXX XXXXXX)
- **Currency:** GBP (£) pricing throughout
- **Location:** UK-focused address and map integration
- **Date/time:** UK-friendly booking system

## 🎨 Customization Guide

### Update Business Information
All business details are configured in `app.py` under `BUSINESS_CONFIG`:
- Business name
- Phone number (UK format)
- Address (multiline support)
- Opening hours
- Google Maps embed URL

### Modify Services & Pricing
Edit the `SERVICES` dictionary in `app.py`:
- Service names
- GBP pricing
- Descriptions

### Styling Changes
- Primary colors: Edit CSS variables in `static/css/style.css`
- Fonts: Modify font families in the same file
- Layout: Adjust CSS classes and responsive breakpoints

## 📞 Support
For issues or questions, refer to the Flask documentation: https://flask.palletsprojects.com/

## 🚀 Deployment

### Local Development
For local development, you can use the built-in Flask development server:
```bash
python app.py
```

### Production Deployment
**IMPORTANT:** Flask's built-in development server is NOT suitable for production deployment.

For production deployment, you must:

1. **Use a production WSGI server** (e.g., Gunicorn, uWSGI)
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Set required environment variables:**
   - `FLASK_SECRET_KEY`: Generate a secure random key
   - `FLASK_DEBUG=False`: Disable debug mode
   ```bash
   export FLASK_SECRET_KEY=$(python -c "import secrets; print(secrets.token_hex(32))")
   export FLASK_DEBUG=False
   ```

3. **Enable HTTPS** for secure connections
   - Use a reverse proxy (nginx, Apache) with SSL/TLS certificates
   - Consider using Let's Encrypt for free SSL certificates

4. **Set up proper logging and monitoring**

5. **Configure proper error handling and security headers**

**Required Environment Variables for Production:**
- `FLASK_SECRET_KEY`: Required - generate a secure random key
- `FLASK_DEBUG`: Set to `False` for production