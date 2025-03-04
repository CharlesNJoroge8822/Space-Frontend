# Spaces for Rent -- IVY COURT (Frontend)
## By Luqman Bashir, Charles Njoroge and Marion Okondo

Ivy Court is a web application that allows users to find and rent spaces for various activities, such as events, meetings, or personal use. Users can browse available spaces, view details, and make reservations through a streamlined and user-friendly interface.

## Features
We have two roles; Admin and Client. 

The Admin can: 
- Manage the spaces which includes adding a space and editing the space details.
- Manage the users which gives them the right to add a user, change their roles and give permissions that a normal user is not allowed to do.
- Manage the bookings by seeing which space has been booked, start and end time the space was officially booked, a verified status to show that a space has been paid for and booked and the price of the space.

The Client can:
- View all the available and unavailable spaces.
- Book a space on the availabilty.
- Pay for a space via mPesa and receive a message on their phone to confirm their payment before proceeding.
- View all their bookings including the space details and price of the space.
- Edit their profile.

## Technologies used
Since this is a fullstack project, we used the technologies below:

- Python: For the backend logic and API development.
- ReactJs: A frontend framework for creating a dynamic and interactive user interface.
- Flask: A backend framework used to build the REST API.
- SQLAlchemy: For database interactions and handling.
- CSS: For frontend UI styling, ensuring a responsive and visually appealing design.

But for the frontend, we used; ReactJs and CSS.

## Installation
For the application to work, you need the following prerequisites: 

- Python3
- Npm (Node Package Manager)

## Setup Instructions
1. Clone the respository to your VS Code
   
    `git clone https://github.com/CharlesNJoroge8822/Frontend.git` 
    `cd Frontend`

2. Run the command, `npm install` in your VS Code terminal.
3. Run the final command to start the frontend `npm run dev`.

## Usage
For a Client:

- Once the app is running, the first thing you will see is our landing page where as a client, you are given more information about Ivy Court before creating an account with us.
- There is also an about page that has Frequently asked questions and a contact info. 
- Next, you can create account using the Google Auth and login afterwards to be access the rest of the pages. 
- As a client, you will view the spaces, book one then see all your bookings in the booking page. Afterwards, you can choose to update your profile or not and lastly, you can logout.

For an Admin:

- Their details are already saved in the database so all they need is to login which will navigate them to the manage spaces where they can add another space if their want and update the details.
- They can also manage the bookings, seeing the space booked and whether the payment is confirmed or not.
- In the manage users, they have permissions to remove a user and see a list of all the users logged in as an admin.
- And finally logout.

## Live Server
You can click this link below that will take you to our web application => 

## License
This project is licensed under the MIT License.

## Contacts
Feel free to contact us if you have any enquiries or suggestions at:
::arinabulobi@gmail.com


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Backend : https://github.com/CharlesNJoroge8822/Space-Backend
Deployed Backend : https://space-backend-4.onrender.com
