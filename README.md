NKOLABALA PHONE SERVICES — Local business website

Files added/updated:
- index.html — business-style landing page with hero, services, about and contact form
- style.css — responsive modern styling
- script.js — mobile nav toggle and contact form placeholder
- logo.svg — simple logo

To preview locally:

1. Open `index.html` in a browser, or run a local server from the project folder:

```powershell
cd "c:\Users\RV SOFT\Desktop\N"
python -m http.server 8000
```

2. Visit `http://localhost:8000` in your browser.

Next steps you might want:
- Replace placeholder contact details with real address/phone/email.
- Connect the contact form to an email service or backend endpoint.
- Add real hero image and product photos.
- Add analytics and SEO metadata.

Contact address set in site
--------------------------
The site contact address has been set to: Busabala, Kampala. Update `index.html` if you want a different address.

Service phone
-------------
The main service contact number has been set to: `+256701232423` and is visible in the site's Contact section.

Contact email
-------------
The contact email has been set to: `srnkolabalaba@gmail.com` and is linked in the Contact section of the site.

Access key
----------
The site previously included a client-side access key gate. It has been removed — users can now access the site without entering a key.

If you want a secure gate for production, consider a server-side authentication solution; I can help implement that.

Admin password login
--------------------
An additional admin password login is available via the header `Login` button.

- Admin password: `123q`

Behavior:
- The login is client-side only and stores a session flag in `sessionStorage` when signed in.
- If the site-wide access overlay (`123NK`) is active, the admin login is blocked until the main gate is unlocked.
- For secure admin access, I can help add server-side authentication.

New polished admin page
-----------------------
I added a dedicated `admin.html` page that the site redirects to after successful admin login. It provides a cleaner, full-page dashboard for adding income and viewing recent entries.

- Open `admin.html` by logging in (password `123q`) or visiting `/admin.html` after login.
- The admin page checks the `sessionStorage` flag `nkol_admin` and redirects to `index.html` if not signed in.
