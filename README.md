# Color Dropper Project

## Features

- Upload images.
- Toggle color dropper mode by clicking on the dropper icon.
- Display magnified view and hex code of the color under the cursor.
- Select and display the color details by clicking on the canvas.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/color-picker.git
    cd color-dropper
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Compile TypeScript to JavaScript:
    ```bash
    npm run build
    ```

4. Start the local server:
    ```bash
    npm start
    ```

## Usage

1. Open your web browser and navigate to `http://localhost:3000`.
2. Click on the "Select Image" button to upload an image.
3. Click on Dropper icon
4. Hover over the canvas to see the color details in the magnifier circle.
5. Click on the canvas to set selected color

## Files

- `index.html`: The HTML file that contains the structure of the application.
- `src/index.ts`: The TypeScript file that contains the main logic of the application.
- `src/index.js`: The compiled JavaScript file.
- `style.css`: The CSS file that contains the styles for the application.

## Development

To continuously compile TypeScript during development, run:
```bash
npx tsc --watch