# Pick & Spin

Pick & Spin is a random picker wheel built with React. It helps users make quick decisions by selecting a random item from a wheel.

Users can choose a built-in category or create their own custom wheels. Wheel settings are saved automatically in the browser.

## Features

- Animated random picker wheel
- Food picker based on cuisines
- Color picker
- Heads-or-tails picker
- Custom wheel names and options
- Add, edit, and remove wheel options
- Create multiple custom wheels
- Color wheel segments automatically match common color names, including light and dark color variations
- Automatic saving with localStorage
- QR-code sharing
- Copy and share the website link
- Responsive mobile and desktop design
- Light and dark themes with automatic preference saving

## How to Use

1. Select a category.
2. Add, edit, or remove wheel options.
3. Rename the wheel if needed.
4. Select **Spin the wheel**.
5. View the selected result.
6. Select **Again** to spin another time.

For custom wheels:

1. Select **Custom**.
2. Open **My wheels**.
3. Select **New custom wheel**.
4. Enter a wheel name.
5. Add your own options.

## Saved Wheels

The app uses browser localStorage to save wheel names and options automatically.

Saved wheels stay available in the same browser and on the same device. They will not automatically transfer to another browser or device.

## Sharing

Select the **Share** button to:

- Display a QR code
- Copy the website link
- Open the device share menu when supported

The shared link opens the website but does not include the user's locally saved wheels.

## Tech Stack

- React
- JavaScript and JSX
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Browser localStorage
- Git and GitHub
- Netlify

## Local Setup

Install the project dependencies:

```bash
npm install
```
