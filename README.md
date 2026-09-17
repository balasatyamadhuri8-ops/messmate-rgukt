# Mess Manager Pro

Build a complete, fully functional, production-style College Mess Management Web Application for RGUKT Srikakulam.



I want the entire application built in ONE implementation. Do NOT create a partial prototype, mockup, static demo, placeholder buttons, fake QR scanner, fake authentication, fake database, or incomplete functionality.



Implement the complete frontend + backend/database + authentication + role-based authorization + QR scanning + occupancy calculation + menu management + problem reporting + persistent sessions + reset functionality.



Every button, form, navigation item, scanner, calculation, database operation, status update, and authentication flow must actually work.



Do NOT tell me to implement anything manually later.

Do NOT leave TODOs.

Do NOT give me a second implementation requirement.

Build everything described below in this single project.



---



TECHNOLOGY / IMPLEMENTATION



Use a modern production-ready web stack supported by Lovable.



Use:



- React/TypeScript for frontend

- Proper backend/database integration

- Supabase or the best supported persistent database/authentication solution

- Real authentication

- Real database tables

- Real row-level security/authorization where applicable

- Real file/image storage for problem-report images

- Real camera-based QR scanning using a suitable browser QR scanning library

- Persistent login sessions

- Protected routes

- Responsive design



Do NOT use localStorage as the main database.



The database must be persistent and shared between Student and Admin dashboards.



If Supabase is used, create the required tables, relationships, policies, storage bucket, authentication flow, and database logic as part of this implementation.



---



APPLICATION NAME



Use the application name:



RGUKT Mess Management



Subtitle:



Smart Mess Management System — RGUKT Srikakulam



Create a professional college-management visual identity.



The design should be modern, clean, simple and professional.



Avoid:



- excessive colors

- excessive animations

- overcrowded screens

- unnecessarily complicated UI

- tiny text

- putting every function on one dashboard



Use separate pages for separate functions.



---



1. AUTHENTICATION ENTRY PAGE



When the website is opened and the user is not authenticated, show a professional welcome/login portal.



The first page must clearly provide two portals:



Student Portal



Admin / Staff Portal



Use two attractive cards/buttons.



The user must select which portal they want.



Do NOT show Student and Admin forms mixed together.



---



2. STUDENT AUTHENTICATION



Create:



Student Login



Fields:



- Email ID

- Password



Buttons:



- Login

- Create Account



Also provide:



"Don't have an account? Create Account"



Create a separate Student Registration page.



Registration fields:



- Full Name

- Student ID

- Email

- Password

- Confirm Password



Validate:



- required fields

- valid email

- password confirmation

- duplicate email

- duplicate student ID



After successful registration:



- create the student account

- assign role = student

- create the student's profile

- create a unique QR identifier for that student

- redirect to Student Dashboard



Student must have their own password.



---



3. ADMIN / STAFF AUTHENTICATION



Create a completely separate Admin/Staff login page.



Fields:



- Email ID

- Password



The common Admin/Staff password is:



rguktsklmmess@2016



The admin/staff account must be recognized as an admin role.



IMPORTANT:

Do not display this password anywhere in the application's normal UI.



Admin should have access only after successful authentication.



Student users must never be able to access admin pages simply by typing the URL.



Implement real role-based route protection.



---



4. PERSISTENT LOGIN



This is compulsory.



After successful login:



- Do NOT send the user back to login while navigating.

- Do NOT ask for email/password again on every page.

- Do NOT show the login page again on refresh.

- Keep the authenticated session active.

- Restore the correct Student or Admin dashboard after refresh.



Only:



Sign Out



should end the session.



After sign out:



- clear the active session

- redirect to the login portal.



Use proper authentication session handling.



---



5. APPLICATION LAYOUT



After login, use a separate application layout for each role.



Use a sidebar on desktop and responsive navigation on mobile.



Show:



- Application logo/name

- User name

- Role

- Navigation

- Sign Out



The currently selected page should be visually highlighted.



---



6. STUDENT NAVIGATION



Student sidebar/menu:



1. Dashboard

2. Mess Status

3. Food Menu

4. Report a Problem

5. My Reported Problems

6. My QR Code

7. Profile

8. Sign Out



Each must be a separate page.



Do NOT place everything on one page.



---



7. ADMIN NAVIGATION



Admin sidebar/menu:



1. Dashboard

2. QR Scanner

3. Occupancy

4. QR Transaction History

5. Reported Problems

6. Food Menu Management

7. Reset Mess

8. Mess Settings

9. Profile

10. Sign Out



Each must be a separate page.



---



8. STUDENT DASHBOARD



Create a professional Student Dashboard.



Show:



Welcome



"Welcome, [Student Name]"



Current Mess Status



Display:



People Inside



Current number of students currently inside the mess.



Seat Availability



Display:



- Available seats

- Total seats

- Percentage



Example:



75% Available



75 / 100 seats available



Use a visual progress indicator.



Queue / Crowd Level



Display:



Current Crowd: Medium



and:



42 people currently inside



The queue level must be calculated from actual current occupancy.



It must NOT be random.



---



9. INITIAL OCCUPANCY



When the system is newly initialized:



Current people inside:



0



Therefore:



Queue/Crowd:



Very Low / No Queue



Seat availability:



100%



Available seats:



Total Seats



Do NOT create fake/random starting numbers.



---



10. OCCUPANCY LOGIC



This is one of the most important requirements.



The occupancy count is controlled ONLY through the Admin QR scanner.



Every student has a unique QR code.



Admin scans a student's QR code.



After scanning:



Show:



- Student name

- Student ID

- Email

- Current status

- QR identity



Then show two large buttons:



IN



OUT



The QR scan itself MUST NOT change the occupancy.



The Admin MUST click either:



IN



or



OUT



Only after clicking IN or OUT should the transaction be saved.



Then update:



- Student current occupancy status

- People currently inside

- Available seats

- Seat availability percentage

- Queue/crowd level

- QR transaction history



All dashboards must use the same database values.



---



11. STUDENT OCCUPANCY STATE



Every student must have a current status:



IN



or



OUT



Default:



OUT



When Admin scans the student and clicks IN:



Student status becomes:



IN



Current people inside increases by 1.



When Admin scans the student and clicks OUT:



Student status becomes:



OUT



Current people inside decreases by 1.



Never allow the count to become negative.



---



12. INVALID/DUPLICATE ACTIONS



Implement strict validation.



If student is already IN:



- Disable or prevent IN.

- Allow OUT.

- Show:



"Student is already inside the mess."



If student is OUT:



- Allow IN.

- Disable or prevent OUT.

- Show:



"Student is currently outside the mess."



If QR is invalid/unregistered:



Show:



"Invalid or unregistered student QR code."



Do not modify occupancy for invalid scans.



---



13. QR SCANNER



Create a dedicated Admin page:



QR Scanner



This page must use the device's real camera.



Do NOT create a fake button saying "Scan QR".



Implement an actual browser camera QR scanner using an appropriate QR scanning library supported by the chosen stack.



The scanner should:



1. Request camera permission.

2. Open the camera.

3. Detect QR codes.

4. Read the unique student QR identifier.

5. Find the corresponding student in the database.

6. Display student information.

7. Display current IN/OUT state.

8. Allow Admin to select IN or OUT.

9. Save the transaction only after button click.

10. Update occupancy.

11. Show confirmation.



Example successful message:



"Student marked IN successfully."



or:



"Student marked OUT successfully."



Also display:



- Current people inside

- Available seats

- Seat availability %

- Current queue level



after every transaction.



---



14. QR SCANNER MOBILE EXPERIENCE



The QR scanner must be optimized for mobile because Admin/Staff may use a smartphone.



Make the camera scanning area large.



Include:



- Start camera

- Stop camera

- Camera permission error handling

- Scan result

- Student details

- IN / OUT controls



If camera permission is denied, show:



"Camera permission is required to scan student QR codes."



Provide clear instructions.



---



15. STUDENT QR CODE



Create a separate Student page:



My QR Code



Display:



- Student Name

- Student ID

- Email

- Unique QR Code



The QR code must encode a unique identifier that maps to that student.



Students cannot change their own occupancy status.



Students cannot click IN or OUT.



Only Admin/Staff QR scanning can modify occupancy.



---



16. QR TRANSACTION HISTORY



Create Admin page:



QR Transaction History



Display a table containing:



- Transaction ID

- Student Name

- Student ID

- Action

- Date

- Time

- Admin/Staff

- Timestamp



Action values:



- IN

- OUT



Provide filters:



- Today

- IN

- OUT

- Student



Keep transaction history even after a mess reset.



---



17. SEAT AVAILABILITY



Create a configurable total-seat setting.



Default:



100 seats



But Admin must be able to change the total number of seats from Mess Settings.



Formula:



Available Seats = Total Seats - Current People Inside



Seat Availability %:



Available Seats / Total Seats × 100



Example:



Total seats = 100



People inside = 25



Available = 75



Availability = 75%



Another example:



Total seats = 200



People inside = 50



Available = 150



Availability = 75%



The calculation must be dynamic.



Never allow:



- negative available seats

- percentage above 100%

- percentage below 0%



---



18. QUEUE / CROWD PREDICTION



Create a crowd-level system based on the CURRENT number of people inside the mess.



The levels are:



- Very Low

- Low

- Medium

- High

- Very High



The thresholds should be configurable in Mess Settings.



Provide sensible default thresholds.



For example:



0–10 → Very Low

11–30 → Low

31–60 → Medium

61–80 → High

81+ → Very High



However, do NOT hard-code these values throughout the application.



Store them in Mess Settings so Admin can change them.



Important:



Queue prediction must be calculated from:



Current People Inside



It must NOT be:



- random

- manually typed

- static

- unrelated to QR scans.



---



19. MESS STATUS PAGE — STUDENT



Create a separate:



Mess Status



page.



Display:



- People Inside

- Available Seats

- Total Seats

- Seat Availability %

- Queue/Crowd Level

- Current meal period

- Current day's menu



This page should make it easy for a student to decide whether the mess is crowded.



---



20. REAL-TIME DATA CONSISTENCY



Use one shared source of truth.



The following must all be connected:



Admin QR IN/OUT

↓

Student current status

↓

Current people inside

↓

Available seats

↓

Seat availability %

↓

Queue level

↓

Student Dashboard

↓

Student Mess Status

↓

Admin Dashboard

↓

Admin Occupancy page



Do NOT maintain separate fake counts for Student and Admin.



When an Admin performs IN/OUT, all relevant pages must reflect the updated values.



Use real-time database subscriptions where supported so open dashboards update automatically.



---



21. STUDENT REPORT A PROBLEM



Create a separate page:



Report a Problem



Form:



Problem Category



Dropdown:



- Food Quality

- Food Quantity

- Hygiene

- Seating

- Water

- Cleaning

- Service

- Other



Problem Title



Text input.



Description



Textarea.



Upload Image



Image upload is OPTIONAL.



Clearly display:



"Image is optional."



Students must be able to submit without an image.



Validate image type and reasonable file size.



Store uploaded images in persistent storage.



Submit Problem



After successful submission:



- Generate unique report ID.

- Save student ID.

- Save category.

- Save title.

- Save description.

- Save optional image.

- Save date/time.

- Set initial status = Pending.



Show a success notification.



---



22. MY REPORTED PROBLEMS



Create separate page:



My Reported Problems



Students can see ONLY their own submitted problems.



Each problem card/table should show:



- Report ID

- Category

- Title

- Description

- Image if uploaded

- Date/time

- Status



Statuses:



- Pending

- In Progress

- Resolved

- Rejected



When Admin changes a status, it must automatically appear for the student.



Students must never see other students' reports.



---



23. ADMIN REPORTED PROBLEMS



Create separate Admin page:



Reported Problems



Admin can see ALL reports.



Show:



- Report ID

- Student Name

- Student ID

- Category

- Title

- Description

- Image

- Created date/time

- Current status



Admin must be able to update status.



Use a dropdown:



Pending

In Progress

Resolved

Rejected



Save status changes to the database.



The student who created the report must see the new status.



---



24. FOOD MENU SYSTEM



Create a separate Student page:



Food Menu



The menu must automatically depend on:



1. Day

2. Part of day / meal period



Meal periods:



Morning → Breakfast

Afternoon → Lunch

Evening → Snacks

Night → Dinner



The current meal should be prominently displayed.



Example:



Monday morning:



Today's Breakfast



Idly

Sambar

Chutney

Milk/Coffee



Monday afternoon:



Today's Lunch



Rice

Thotakura Pappu

Alu Dum Fry

Rasam

Curd



The system must determine the current day and current meal period using the application's local time.



Also provide a weekly menu view.



---



25. DEFAULT FOOD MENU



Insert the following exact default menu into the database during initial setup.



Do not lose these values.



MONDAY



Breakfast:

Idly, Sambar, Chutney, Milk/Coffee



Lunch:

Rice, Thotakura Pappu, Alu Dum Fry (Curry), Rasam, Curd



Snacks:

Boiled Sanagulu/Guggillu, Tea and Milk



Dinner:

Rice, Lady's Finger Curry, Sambar, Banana, Curd



---



TUESDAY



Breakfast:

Uthappam, Palli Chutney, Egg/Fruit, Coffee & Milk



Lunch:

Rice, Tomato Pappu, Cabbage 65, Rasam, Curd



Snacks:

Biscuit Contains Fibres, Tea & Milk



Dinner:

Jeera Rice, Potato Curry, Rice, Majjiga Charu, Sweet



---



WEDNESDAY



Breakfast:

Upma, Chutney, Coffee/Milk, Egg for Non-Vegetarians, Fruit for Vegetarians



Lunch:

Rice, Mulakaya Tomato Curry, Gongura Chutney, Rasam, Curd



Snacks:

Pakodi, Tea and Milk



Dinner:

Rice, Veg Pulav, Mixed Vegetable Paneer Curry, Rasam, Banana, Curd



---



THURSDAY



Breakfast:

Vada, Chutney, Sambar, Egg, Milk/Coffee



Lunch:

Rice, Pappu, Guttu Vankay Curry, Tomato Chutney, Rasam, Curd



Snacks:

Groundnut Chikki, Tea/Milk



Dinner:

Rice, Carrot Deep Fry, Sambar, Curd, Banana



---



FRIDAY



Breakfast:

Idly, Chutney, Sambar, Coffee/Milk



Lunch:

Rice, Chukka/Thota/Pala Kura Pappu, Gobi Curry, Rasam, Curd



Snacks:

Boiled Groundnut, Tea & Milk



Dinner:

Rice, Dondakaya Fry, Sambar, Curd, Banana



---



SATURDAY



Breakfast:

Bonda (Without Maida), Chutney, Milk/Coffee



Lunch:

Rice, Mudda Pappu, Ghee, Sweet, Avakay, Curd



Snacks:

Millet Chikki/Popcorn, Tea and Milk



Dinner:

Rice, Alu 65, Sambar, Curd, Banana



---



SUNDAY



Breakfast:

Dosa, Palli Chutney, Tomato Chutney, Milk & Coffee



Lunch:

Veg Pulav, Paneer for Vegetarians and Chicken Curry for Non-Vegetarians, Rasam, Curd



Snacks:

Biscuit, Tea & Coffee



Dinner:

Pulihora, Alu Kurma, Curd Rice, Banana



---



26. DEFAULT MENU VS ADMIN MENU



The above menu is the DEFAULT menu.



Admin must be able to modify the active menu.



Do NOT permanently destroy the default values when Admin edits something.



Implement either:



- default menu + admin override



or



- menu records with current active values and original default values.



The result must allow the system to initialize from the supplied menu and allow Admin to modify it.



---



27. ADMIN FOOD MENU MANAGEMENT



Create a separate page:



Food Menu Management



Admin can:



- View Monday-Sunday

- Select day

- Select Breakfast/Lunch/Snacks/Dinner

- View current menu

- Edit menu items

- Add items

- Remove items

- Save changes



Example:



Monday → Breakfast



Current:

Idly

Sambar

Chutney

Milk/Coffee



Admin changes to:

Dosa

Sambar

Chutney

Milk



Click:



Save Menu



The updated menu must immediately become the active menu for students.



---



28. MENU ITEM UI



Make menu editing easy.



Admin should be able to add/remove individual food items.



Do not force Admin to edit one giant text field if avoidable.



Use a list such as:



[ Idly ] [Remove]



[ Sambar ] [Remove]



[ Chutney ] [Remove]



[ Milk/Coffee ] [Remove]



[ + Add Item ]



[ Save Changes ]



---



29. ADMIN DASHBOARD



Create a separate Admin Dashboard.



Display:



Current People Inside



Example:

42



Available Seats



Example:

58 / 100



Seat Availability



Example:

58%



Current Crowd Level



Example:

Medium



Pending Problems



Example:

5



In Progress



Example:

3



Resolved



Example:

12



Also provide large quick-action buttons:



Scan Student QR



View Occupancy



Reported Problems



Manage Food Menu



Reset Mess



Do not put the complete functionality on this dashboard.



These buttons must navigate to their respective separate pages.



---



30. ADMIN OCCUPANCY PAGE



Create separate page:



Occupancy



Display:



- Current people inside

- Total seats

- Available seats

- Availability %

- Crowd level



Also show the current list of students who are inside.



For each:



- Student name

- Student ID

- Time entered

- Current status



This should be useful to Admin/Staff.



---



31. RESET MESS FUNCTION



This is compulsory.



Create separate Admin page:



Reset Mess



When the mess closes, Admin must be able to reset the current occupancy.



Display:



Current people inside:

42



Then:



Reset Mess Count



Before resetting show a confirmation dialog:



"Are you sure you want to reset the current mess occupancy? All students will be marked OUT for the new mess session. Historical transactions will be preserved."



If confirmed:



1. Set all currently IN students to OUT.

2. Set current occupancy = 0.

3. Set available seats = total seats.

4. Set seat availability = 100%.

5. Set queue/crowd level = Very Low / No Queue.

6. Start a new occupancy session.

7. Preserve all previous QR transaction history.

8. Preserve all reported problems.

9. Preserve menu.

10. Record reset date/time and Admin who performed the reset.



IMPORTANT:



RESET MUST NOT DELETE HISTORICAL QR TRANSACTIONS.



It only resets the CURRENT occupancy.



---



32. MESS SESSION



Implement a concept of a mess occupancy session.



Every reset creates a new mess session.



Store:



- Session ID

- Started at

- Reset by

- Reset timestamp

- Previous session information



QR transactions should be associated with the relevant session.



This prevents historical data from being lost.



---



33. MESS SETTINGS



Create Admin page:



Mess Settings



Allow Admin to configure:



Total Seats



Default:

100



Crowd Thresholds



Default:



Very Low:

0–10



Low:

11–30



Medium:

31–60



High:

61–80



Very High:

81+



Allow Admin to change the threshold values.



Validate that thresholds do not overlap incorrectly.



Save settings persistently.



---



34. CURRENT MEAL PERIOD



Use current local time.



Default meal periods:



Breakfast:

Morning



Lunch:

Afternoon



Snacks:

Evening



Dinner:

Night



Make meal-period start/end times configurable in Mess Settings if practical.



The Food Menu page must determine which meal is currently active.



If the current time is outside meal periods, show:



"No active meal period right now."



But allow the student to view the complete weekly menu.



---



35. PROFILE



Create separate Profile pages.



Student Profile:



- Name

- Student ID

- Email

- Role

- QR Code shortcut



Admin Profile:



- Name

- Email

- Role



Do not expose sensitive authentication information.



---



36. DATABASE STRUCTURE



Create persistent database tables similar to:



profiles



Fields:



- id

- full_name

- email

- role

- student_id

- created_at

- updated_at



Role:



student

admin



---



student_occupancy



Fields:



- id

- student_id

- current_status

- updated_at



current_status:



IN

OUT



---



qr_transactions



Fields:



- id

- student_id-

-session_id

action

timestamp

action:

IN OUT

mess_sessions

Fields:

id

started_at

ended_at

reset_by

created_at

mess_settings

Fields:

id

total_seats

very_low_max

low_max

medium_max

high_max

breakfast_start

breakfast_end

lunch_start

lunch_end

snacks_start

snacks_end

dinner_start

dinner_end

updated_at

updated_by

problems

Fields:

id

student_id

category

title

description

image_url

status

created_at

updated_at

updated_by

menu

Fields:

id

day

meal_period

items

is_default

updated_at

updated_by

37. DATABASE SECURITY

Implement proper authorization.

Students can:

read their own profile

read their own problems

create their own problems

read active menu

read current mess status

read their own QR information

Students cannot:

modify occupancy

create IN/OUT transactions

modify menu

modify other students' problems

access admin pages

modify mess settings

reset the mess

view all students' private information

Admins can:

scan QR

update occupancy

view QR transactions

view occupancy

view all reported problems

update problem status

modify menu

modify mess settings

reset current occupancy

Implement database security policies appropriate to the chosen backend.

Do not rely only on frontend hiding.

38. ADMIN ACCOUNT

Create/support an Admin/Staff role.

The Admin login uses the common password:

rguktsklmmess@2016

Do not hard-code an easily exposed admin password in frontend source code.

Use the authentication/database system appropriately so the credential is not exposed to students.

If initial admin account setup is required, create it through the supported backend/authentication initialization mechanism.

39. ERROR HANDLING

Implement proper errors.

Examples:

Invalid login: "Invalid email or password."

Duplicate student: "An account with this email already exists."

Invalid QR: "Invalid or unregistered student QR."

Camera denied: "Camera permission is required."

Duplicate IN: "Student is already inside."

Duplicate OUT: "Student is already outside."

Problem submission error: "Unable to submit the problem. Please try again."

Menu save error: "Unable to save menu changes."

Reset error: "Unable to reset mess occupancy."

Use toast notifications and inline validation where appropriate.

40. LOADING STATES

Every database operation must have loading states.

Examples:

Logging in...

Creating account...

Scanning...

Saving...

Submitting...

Updating status...

Saving menu...

Resetting...

Prevent duplicate submissions while an operation is processing.

41. EMPTY STATES

Use proper empty states.

No reported problems:

"No reported problems yet."

No transactions:

"No QR transactions yet."

No students inside:

"No students are currently inside the mess."

No active meal:

"No active meal period right now."

42. RESPONSIVE DESIGN

Make the entire application responsive.

Desktop:

Sidebar

Dashboard cards

Tables

Mobile:

Collapsible/sidebar navigation

Stacked cards

Mobile-friendly tables

Large QR camera area

Large IN/OUT buttons

Touch-friendly controls

The Admin QR Scanner is especially important on mobile.

43. ACCESSIBILITY

Use:

readable font sizes

sufficient contrast

clear labels

keyboard-accessible controls

accessible buttons

form validation messages

semantic structure

44. VISUAL DESIGN

Design style:

Modern college-management dashboard.

Use:

clean cards

rounded corners

subtle shadows

professional typography

simple icons

consistent spacing

clear status badges

progress bars

responsive layouts

Queue statuses should be

 visually distinguishable.

Seat availability should be visually obvious.

Do not use excessive gradients or flashy effects.

The website should look like a real product that could be used by students and mess staff.45. NAVIGATION BEHAVIOUR

All navigation must work.

Examples:

Student:

Login → Student Dashboard → Mess Status → Food Menu → Report Problem → My Problems → My QR → Profile → Sign Out

Admin:

Login → Admin Dashboard → QR Scanner → Occupancy → QR History → Reported Problems → Food Menu Management → Reset Mess → Mess Settings → Profile → Sign Out

Browser refresh must preserve authentication.

Protected URLs must redirect appropriately.

46. DASHBOARD QUICK ACTIONS

Student Dashboard quick actions:

Report a Problem

View Food Menu

View Mess Status

View My QR

Admin Dashboard quick actions:

SCAN STUDENT QR

View Occupancy

View Problems

Manage Menu

Reset Mess

Make the QR scanner the most prominent Admin action.

47. OCCUPANCY EXAMPLE

The system must behave like this:

Initial state:

People Inside = 0

Total Seats = 100

Available Seats = 100

Availability = 100%

Crowd = Very Low / No Queue

Then Admin scans Student A.

Student A status = OUT.

Admin clicks:

IN

Result:

People Inside = 1

Available Seats = 99

Availability = 99%

Crowd = Very Low

Then Admin scans Student B.

Clicks:

IN

Result:

People Inside = 2

Available Seats = 98

Availability = 98%

Then Student A leaves.

Admin scans Student A.

Clicks:

OUT

Result:

People Inside = 1

Available Seats = 99

Availability = 99%

This exact logic must be implemented dynamically.

48. RESET EXAMPLE

Before reset:

People Inside = 45

Available Seats = 55

Availability = 55%

Crowd = Medium

Admin clicks:

Reset Mess

Confirms.

After reset:

People Inside = 0

Available Seats = 100

Availability = 100%

Crowd = Very Low / No Queue

All students currently marked IN become OUT.

Historical transactions remain in QR Transaction History.

49. PROBLEM WORKFLOW

Student:

Report Problem ↓ Fill Category ↓ Title ↓ Description ↓ Optional Image ↓ Submit ↓ Status = Pending

Admin:

Reported Problems ↓ Open Report ↓ Review details/image ↓ Change Status ↓ Save

Student:

My Reported Problems ↓ See updated status

This must use persistent database data.

50. MENU WORKFLOW

Initial database:

Default weekly menu is populated with the exact menu supplied in this prompt.

Student:

Food Menu ↓ Current day ↓ Current meal period ↓ See active menu

Admin:

Food Menu Management ↓ Select day ↓ Select meal ↓ Edit items ↓ Save

Student automatically sees the updated active menu.

51. SECURITY REQUIREMENTS

Do not expose:

admin password

other students' private information

internal database credentials

service-role keys

Do not put secret credentials in client-side code.

Use environment variables/secrets for backend credentials.

Implement proper authentication and authorization.

52. NO MOCK FUNCTIONALITY

This requirement is extremely important.

Do NOT implement:

fake login

fake QR scanning

fake camera

fake occupancy numbers

random queue values

static seat availability

fake problem submission

fake menu updates

fake reset

buttons that do nothing

placeholder pages

"coming soon" features

Every feature requested in this prompt must actually work.

53. FINAL END-TO-END TESTING

Before considering the project complete, test the following complete workflows:

Authentication

Student registration → login → dashboard → refresh → still logged in → sign out.

Admin login → dashboard → refresh → still logged in → sign out.

QR

Create student → show QR → Admin scans QR → student details appear → click IN → count increases → seat percentage changes → queue changes.

Scan same student → click OUT → count decreases.

Attempt duplicate IN/OUT → correctly rejected.

Reset

Students inside → Admin reset → count becomes 0 → everyone becomes OUT → availability becomes 100% → history remains.

Problems

Student submits problem without image → works.

Student submits problem with image → works.

Student sees report → Admin sees report → Admin updates status → Student sees updated status.

Menu

Student sees default menu.

Admin edits menu.

Student sees updated menu.

Security

Student cannot access Admin routes.

Student cannot modify occupancy.

Student cannot see other students' problems.

Admin can perform admin operations.

54. FINAL PRODUCT STRUCTURE

The final application should contain these pages:

PUBLIC:

Welcome / Portal Selection

Student Login

Student Registration

Admin Login

STUDENT:

Student Dashboard

Mess Status

Food Menu

Report a Problem

My Reported Problems

My QR Code

Profile

ADMIN:

Admin Dashboard

QR Scanner

Occupancy

QR Transaction History

Reported Problems

Food Menu Management

Reset Mess

Mess Settings

Profile

55. MOST IMPORTANT BUSINESS LOGIC

The entire system revolves around this:

ADMIN SCANS STUDENT QR

↓

STUDENT IDENTIFIED

↓

ADMIN MUST CHOOSE IN OR OUT

↓

TRANSACTION SAVED

↓

STUDENT CURRENT STATUS UPDATED

↓

CURRENT PEOPLE INSIDE UPDATED

↓

AVAILABLE SEATS UPDATED

↓

SEAT AVAILABILITY % UPDATED

↓

QUEUE/CROWD LEVEL UPDATED

↓

STUDENT DASHBOARD UPDATED

↓

ADMIN DASHBOARD UPDATED

This chain must be implemented using the persistent database.

56. FINAL REQUIREMENT

Build the complete application now.

Do not simplify the requirements.

Do not remove any requested feature.

Do not combine separate pages into one page.

Do not replace real functionality with mock functionality.

Do not ask me to implement backend functionality later.

Do not ask me to create the database manually later if it can be created through the project setup.

Do not leave the QR scanner as a placeholder.

Do not leave authentication as a mock.

Do not leave menu management as static data.

Do not leave problem reporting as frontend-only.

Do not leave reset as a visual button.

Everything must be connected and functional.

The final result should be a polished, responsive, real-world RGUKT Srikakulam Mess Management System with:

Student Portal + Admin/Staff Portal + Real Authentication + Persistent Database + Role-Based Access + Student QR Codes + Real Camera QR Scanner + Mandatory Admin IN/OUT Confirmation + Dynamic Occupancy + Seat Availability % + Queue/Crowd Prediction + Resettable Mess Sessions + QR History + Problem Reporting + Optional Images + Problem Status Tracking + Default Weekly Menu + Admin Menu Editing + Real-Time Updates + Responsive Navigation

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://messmate-rgukt.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/80664e3b-c007-46eb-b839-4aa96410ce0d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
