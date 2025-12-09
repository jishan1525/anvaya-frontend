# Anvaya CRM

A full-stack lead tracking and sales management system where you can add, assign, filter, track, and report leads.
Built with React (frontend), Express/Node (backend), MongoDB, and features fully responsive UI with dashboards, agent management, and reporting tools.

---
## Demo Link

[Live Link](https://anvaya-frontend-delta.vercel.app/)

---
## Quick Start

```
git clone https://github.com/jishan1525/anvaya-frontend.git
cd anvaya-crm
npm install
npm start
```
---

## Technologies

- React JS
- React Router
- Axios
- Tailwind CSS
- Node.js
- Express
- MongoDB
- React Toastify

---

## DEMO Video

Watch a walkthrogh (5-7 minutes) of all major features of this app: [Link](https://drive.google.com/file/d/10GJ6Oj2YJse8Qf-P7k4PsCdyLn_pSN83/view?usp=sharing)

---

## Features

**Dashboard**
- Quick stats
- Lead summary cards
- Navigation to all pages

**Lead Management**
- Add new leads
- Edit and update lead details
- Filter by agent, status, and priority
- Sort leads by priority
- Real-time searching
- Lead detail page

**Sales Agents**
- Add new sales agent
- Display all agents
- Fully responsive grid view

**Reports**
- View statistics through charts
- Agent-wise performance
- Status & priority analytics

**Settings**
- Delete agents and leads
- Manage app data
- Fully responsive layout

---
API References

**GET /api/leads**
Returns all leads <br>
Sample response:<br>
```
[{ "_id": "...", "name": "John Doe", "status": "New", ... }]
```
**POST /api/leads**
Create a new lead<br>
Sample response:<br>
```
{ "_id": "...", "name": "John Doe", ... }
```

**GET /api/agents**
List all agents<br>

**POST /api/agents**
Add new agent<br>

---

## Contact

For bugs or feature request, please reach out to jishana149@gmail.com
